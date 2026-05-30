import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { PLAN_LIMITS } from '@/lib/pricing';
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

  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  const isMock = !key_id || !key_secret;

  try {
    await connectDB();
    const user = await User.findById(auth.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const planData = PLAN_LIMITS.premium;
    const amountInPaise = planData.price * 100;

    let orderId = `order_mock_${Date.now()}`;
    
    if (!isMock) {
      const razorpay = new Razorpay({ key_id: key_id as string, key_secret: key_secret as string });
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);
      if (!order) {
        return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
      }
      orderId = order.id;
    }

    // Save transaction in database
    await Transaction.create({
      userId: user._id,
      razorpayOrderId: orderId,
      amount: planData.price,
      currency: 'INR',
      plan: 'premium',
      status: 'pending',
    });

    return NextResponse.json({
      success: true,
      isMock,
      order: {
        id: orderId,
        amount: amountInPaise,
        currency: 'INR',
      },
      key_id: key_id || 'mock_key',
      user: {
        name: user.name,
        email: user.email,
        phone: '',
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Server error while creating order' }, { status: 500 });
  }
}
