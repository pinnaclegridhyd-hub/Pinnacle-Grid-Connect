import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import VCard from '@/models/VCard';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const resolvedParams = await params;

    const vcard = await VCard.findOne({ url: resolvedParams.slug, isActive: true });
    if (!vcard) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Increment view count (fire and forget)
    VCard.findByIdAndUpdate(vcard._id, { $inc: { views: 1 } }).exec();

    return NextResponse.json({ vcard });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
