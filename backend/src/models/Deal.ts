import mongoose, { Document, Schema } from 'mongoose';

export interface IDeal extends Document {
  title: string;
  description: string;
  category: string;
  partnerName: string;
  partnerLogo?: string;
  benefits: string[];
  eligibilityConditions: string;
  isLocked: boolean;
  discountInfo?: string;
  validUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const dealSchema = new Schema<IDeal>(
  {
    title: {
      type: String,
      required: [true, 'Deal title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Deal description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: [
        'cloud',
        'marketing',
        'analytics',
        'productivity',
        'development',
        'design',
        'other',
      ],
    },
    partnerName: {
      type: String,
      required: [true, 'Partner name is required'],
      trim: true,
    },
    partnerLogo: { type: String, trim: true },
    benefits: {
      type: [String],
      default: [],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'At least one benefit is required',
      },
    },
    eligibilityConditions: {
      type: String,
      required: [true, 'Eligibility conditions are required'],
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    discountInfo: { type: String, trim: true },
    validUntil: { type: Date },
  },
  { timestamps: true }
);

dealSchema.index({ category: 1 });
dealSchema.index({ isLocked: 1 });
dealSchema.index({ title: 'text', description: 'text' });

export const Deal = mongoose.model<IDeal>('Deal', dealSchema);
