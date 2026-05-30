import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import User from '@/models/User';
import VCard from '@/models/VCard';
import { PLAN_LIMITS } from '@/lib/pricing';
import { ENABLE_PREMIUM_FEATURES } from '@/lib/feature-flags';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    // Basic spam protection (honeypot field)
    if (body._honey && body._honey.length > 0) {
      // Spam detected, silently return success
      return NextResponse.json({ success: true });
    }

    const { vcardId, name, email, phone, message } = body;

    if (!vcardId || !name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const vcard = await VCard.findById(vcardId);
    if (!vcard) {
      return NextResponse.json({ error: 'VCard not found' }, { status: 404 });
    }

    const user = await User.findById(vcard.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Plan Limits Validation
    const effectivePlan = ENABLE_PREMIUM_FEATURES ? (user.plan as keyof typeof PLAN_LIMITS) : 'free';
    const planLimits = PLAN_LIMITS[effectivePlan] || PLAN_LIMITS.free;
    
    if (planLimits.maxEnquiriesPerMonth !== Infinity) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const enquiryCount = await Enquiry.countDocuments({
        vcardId: vcard._id,
        createdAt: { $gte: startOfMonth }
      });

      if (enquiryCount >= planLimits.maxEnquiriesPerMonth) {
        return NextResponse.json({ error: 'This profile has reached its monthly inquiry limit.' }, { status: 403 });
      }
    }

    const enquiry = await Enquiry.create({
      userId: user._id,
      vcardId: vcard._id,
      name,
      email,
      phone: phone || '',
      message
    });

    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
