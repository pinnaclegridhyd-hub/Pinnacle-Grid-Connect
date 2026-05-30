import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { ENABLE_PREMIUM_FEATURES } from '@/lib/feature-flags';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pf_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    await connectDB();
    const user = await User.findById(payload.userId).select('-password');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const effectivePlan = ENABLE_PREMIUM_FEATURES ? user.plan : 'free';

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        company: user.company,
        avatar: user.avatar,
        plan: effectivePlan,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
