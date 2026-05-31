import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { PLAN_LIMITS } from '@/lib/pricing';
import { ENABLE_PREMIUM_FEATURES } from '@/lib/feature-flags';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pf_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(auth.userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const effectivePlan = ENABLE_PREMIUM_FEATURES ? (user.plan as keyof typeof PLAN_LIMITS) : 'free';
    const planLimits = PLAN_LIMITS[effectivePlan] || PLAN_LIMITS.free;
    const maxSizeBytes = planLimits.maxUploadSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: `File size exceeds the ${planLimits.maxUploadSizeMB}MB limit for your plan.` }, { status: 403 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // In serverless environments like Vercel, the filesystem is read-only.
    // Instead of saving to disk, we convert the image to a Data URL and store it directly.
    const mimeType = file.type || 'image/png';
    const base64Image = buffer.toString('base64');
    const url = `data:${mimeType};base64,${base64Image}`;
    
    const publicId = `img_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    return NextResponse.json({
      url,
      publicId
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
