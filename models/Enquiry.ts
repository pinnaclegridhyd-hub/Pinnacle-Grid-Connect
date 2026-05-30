import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  vcardId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vcardId: { type: Schema.Types.ObjectId, ref: 'VCard', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV === 'development') {
  delete (mongoose.models as any).Enquiry;
}

const Enquiry: Model<IEnquiry> = mongoose.models.Enquiry || mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
