import mongoose, { Document, Schema } from 'mongoose';

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface IClaim extends Document {
  user: mongoose.Types.ObjectId;
  deal: mongoose.Types.ObjectId;
  status: ClaimStatus;
  claimedAt: Date;
  updatedAt: Date;
}

const claimSchema = new Schema<IClaim>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deal: {
      type: Schema.Types.ObjectId,
      ref: 'Deal',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

claimSchema.index({ user: 1, deal: 1 }, { unique: true });
claimSchema.index({ user: 1 });
claimSchema.index({ deal: 1 });

export const Claim = mongoose.model<IClaim>('Claim', claimSchema);
