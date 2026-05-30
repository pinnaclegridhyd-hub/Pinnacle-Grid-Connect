import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import VCard from '@/models/VCard';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pf_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const auth = verifyToken(token);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectDB();
  const vcards = await VCard.find({ userId: auth.userId });

  const totalViews = vcards.reduce((sum, v) => sum + (v.views || 0), 0);
  const totalVCards = vcards.length;
  const activeVCards = vcards.filter((v) => v.isActive).length;

  return NextResponse.json({
    totalViews,
    totalVCards,
    activeVCards,
    // Return only actual tracked database counts
    qrScans: 0,
    whatsappClicks: 0,
    enquiries: 0,
  });
}
