import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import VCard from '@/models/VCard';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pf_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolvedParams = await params;
  await connectDB();
  const vcard = await VCard.findOne({ _id: resolvedParams.id, userId: auth.userId });
  if (!vcard) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ vcard });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resolvedParams = await params;
  await connectDB();
  await VCard.findOneAndDelete({ _id: resolvedParams.id, userId: auth.userId });
  return NextResponse.json({ success: true });
}
