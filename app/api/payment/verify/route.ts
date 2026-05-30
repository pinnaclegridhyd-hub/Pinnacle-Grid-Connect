import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { ENABLE_PREMIUM_FEATURES } from '@/lib/feature-flags';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pf_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(req: NextRequest) {
  if (!ENABLE_PREMIUM_FEATURES) {
    return NextResponse.json({ error: 'Premium features are temporarily disabled.' }, { status: 403 });
  }

  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || (!razorpay_signature && !razorpay_order_id.startsWith('order_mock_'))) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const isMock = razorpay_order_id.startsWith('order_mock_');

    if (!isMock) {
      const secret = process.env.RAZORPAY_KEY_SECRET;

      if (!secret) {
        return NextResponse.json({ error: 'Razorpay API keys are not configured.' }, { status: 500 });
      }

      // Verify signature
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');

      if (generated_signature !== razorpay_signature) {
        // Payment verification failed
        await connectDB();
        await Transaction.findOneAndUpdate(
          { razorpayOrderId: razorpay_order_id, userId: auth.userId },
          { status: 'failed' }
        );
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
      }
    }

    // Payment is successful
    await connectDB();
    
    const transaction = await Transaction.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, userId: auth.userId },
      { 
        status: 'success', 
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      },
      { new: true }
    );

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Upgrade user plan to premium
    await User.findByIdAndUpdate(auth.userId, { plan: transaction.plan });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Server error while verifying payment' }, { status: 500 });
  }
}
