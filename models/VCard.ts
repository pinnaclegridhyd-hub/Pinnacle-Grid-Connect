import mongoose, { Schema, Document, Model } from 'mongoose';

const HoursSchema = new Schema(
  {
    day:    { type: String },
    open:   { type: String, default: '09:00' },
    close:  { type: String, default: '18:00' },
    closed: { type: Boolean, default: false },
  },
  { _id: false }
);

const SocialSchema = new Schema(
  {
    website:     String,
    facebook:    String,
    instagram:   String,
    twitter:     String,
    linkedin:    String,
    youtube:     String,
    tiktok:      String,
    whatsapp:    String,
    reddit:      String,
    pinterest:   String,
    telegram:    String,
    googledrive: String,
  },
  { _id: false }
);

export interface IVCard extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  // Basic Info
  name: string;
  designation: string;
  company: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  bio: string;
  url: string;       // unique slug
  isActive: boolean;
  // Template
  template: string;
  // Social
  socialLinks: {
    website?: string; facebook?: string; instagram?: string;
    twitter?: string; linkedin?: string; youtube?: string;
    tiktok?: string; whatsapp?: string; reddit?: string;
    pinterest?: string; telegram?: string; googledrive?: string;
  };
  // Business Hours — array of {day, open, close, closed}
  hours: { day: string; open: string; close: string; closed: boolean }[];
  // QR
  qrColor: string;
  qrBgColor: string;
  qrSize: number;
  qrLabel: string;
  // Banner
  bannerTitle: string;
  bannerUrl: string;
  bannerDescription: string;
  bannerButton: string;
  // Legal
  privacyPolicy: string;
  termsConditions: string;
  // Dynamic Sections
  servicesList: { title: string; description: string; icon?: string }[];
  galleryImages: { url: string; publicId: string; caption?: string }[];
  customLinks: { id: string; label: string; url: string }[];
  enquiryConfig: { email: string; title: string };
  // Sections
  sections: {
    header: boolean; businessHours: boolean; services: boolean;
    products: boolean; gallery: boolean; testimonials: boolean;
    contact: boolean; banner: boolean; newsletter: boolean;
  };
  sectionOrder: string[];
  // Stats
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const VCardSchema = new Schema<IVCard>(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name:        { type: String, required: true, trim: true },
    designation: { type: String, default: '' },
    company:     { type: String, default: '' },
    email:       { type: String, default: '' },
    phone:       { type: String, default: '' },
    whatsappNumber: { type: String, default: '' },
    address:     { type: String, default: '' },
    bio:         { type: String, default: '' },
    url:         { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive:    { type: Boolean, default: true },
    template:    { type: String, default: 'simple-contact' },
    socialLinks: { type: SocialSchema, default: {} },
    hours:       { type: [HoursSchema], default: [] },
    qrColor:     { type: String, default: '#7c3aed' },
    qrBgColor:   { type: String, default: '#ffffff' },
    qrSize:      { type: Number, default: 180 },
    qrLabel:     { type: String, default: 'Scan to connect' },
    bannerTitle:       { type: String, default: '' },
    bannerUrl:         { type: String, default: '' },
    bannerDescription: { type: String, default: '' },
    bannerButton:      { type: String, default: '' },
    privacyPolicy:     { type: String, default: '' },
    termsConditions:   { type: String, default: '' },
    servicesList: [{
      title: { type: String, required: true },
      description: { type: String, required: true },
      icon: { type: String, default: '' },
    }],
    galleryImages: [{
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      caption: { type: String, default: '' },
    }],
    customLinks: [{
      id: { type: String, required: true },
      label: { type: String, default: '' },
      url: { type: String, required: true },
    }],
    enquiryConfig: {
      email: { type: String, default: '' },
      title: { type: String, default: 'Inquiries' },
    },
    sections: {
      type: {
        header:       { type: Boolean, default: true },
        businessHours:{ type: Boolean, default: true },
        services:     { type: Boolean, default: true },
        products:     { type: Boolean, default: true },
        gallery:      { type: Boolean, default: true },
        testimonials: { type: Boolean, default: true },
        contact:      { type: Boolean, default: true },
        banner:       { type: Boolean, default: true },
        newsletter:   { type: Boolean, default: true },
      },
      default: {},
    },
    sectionOrder: {
      type: [String],
      default: ['header','businessHours','services','products','gallery','testimonials','contact','banner','newsletter'],
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development') {
  delete (mongoose.models as any).VCard;
}

const VCard: Model<IVCard> =
  mongoose.models.VCard || mongoose.model<IVCard>('VCard', VCardSchema);

export default VCard;
