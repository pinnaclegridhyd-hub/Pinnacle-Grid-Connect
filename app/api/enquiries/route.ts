import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
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

export async function GET(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(auth.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const effectivePlan = ENABLE_PREMIUM_FEATURES ? (user.plan as keyof typeof PLAN_LIMITS) : 'free';
    const planLimits = PLAN_LIMITS[effectivePlan] || PLAN_LIMITS.free;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const enquiries = await Enquiry.find({ userId: auth.userId }).sort({ createdAt: -1 });

    const currentMonthCount = await Enquiry.countDocuments({
      userId: auth.userId,
      createdAt: { $gte: startOfMonth }
    });

    return NextResponse.json({ 
      enquiries,
      quota: {
        used: currentMonthCount,
        max: planLimits.maxEnquiriesPerMonth
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, status } = await req.json();
    if (!id || !['new', 'contacted', 'closed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await connectDB();
    const enquiry = await Enquiry.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      { status },
      { new: true }
    );

    if (!enquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ enquiry });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
