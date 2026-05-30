import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import VCard from '@/models/VCard';
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

// GET /api/vcards — get all vcards for logged-in user
export async function GET() {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const vcards = await VCard.find({ userId: auth.userId }).sort({ createdAt: -1 });
  return NextResponse.json({ vcards });
}

// POST /api/vcards — create or update vcard (upsert by userId)
export async function POST(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();

    // Generate url slug if not provided
    if (!body.url) {
      body.url = body.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    }

    const user = await User.findById(auth.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const effectivePlan = ENABLE_PREMIUM_FEATURES ? (user.plan as keyof typeof PLAN_LIMITS) : 'free';
    const planLimits = PLAN_LIMITS[effectivePlan] || PLAN_LIMITS.free;

    if (body.servicesList && body.servicesList.length > planLimits.maxServices) {
      return NextResponse.json({ error: `${planLimits.name} is limited to ${planLimits.maxServices} services. Please upgrade to add more.` }, { status: 403 });
    }
    if (body.galleryImages && body.galleryImages.length > planLimits.maxGalleryImages) {
      return NextResponse.json({ error: `${planLimits.name} is limited to ${planLimits.maxGalleryImages} gallery images. Please upgrade to add more.` }, { status: 403 });
    }

    // Upsert: one vcard per user (update if exists, create if not)
    const vcard = await VCard.findOneAndUpdate(
      { userId: auth.userId },
      { ...body, userId: auth.userId },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ vcard });
  } catch (error: any) {
    console.error('VCard save error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Profile URL already taken. Try another.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
