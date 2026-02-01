import { Response } from 'express';
import { validationResult } from 'express-validator';
import { Claim } from '../models/Claim';
import { Deal } from '../models/Deal';
import { asyncHandler } from '../utils/errors';
import { AppError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

export const claimDeal = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.type, msg: e.msg })),
    });
    return;
  }
  if (!req.user) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }
  const { dealId } = req.body;
  const deal = await Deal.findById(dealId);
  if (!deal) {
    throw new AppError('Deal not found', 404);
  }
  if (deal.isLocked && !req.user.verified) {
    throw new AppError(
      'This deal is restricted. Your account must be verified to claim it.',
      403
    );
  }
  const existing = await Claim.findOne({
    user: req.user.id,
    deal: dealId,
  });
  if (existing) {
    throw new AppError('You have already claimed this deal', 409);
  }
  const claim = await Claim.create({
    user: req.user.id,
    deal: dealId,
    status: 'pending',
  });
  await claim.populate('deal', 'title category partnerName');
  res.status(201).json({
    message: 'Deal claimed successfully',
    claim: {
      id: claim._id,
      deal: claim.deal,
      status: claim.status,
      claimedAt: claim.claimedAt,
    },
  });
});

export const getMyClaims = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }
  const claims = await Claim.find({ user: req.user.id })
    .populate('deal', 'title description category partnerName benefits eligibilityConditions isLocked discountInfo validUntil')
    .sort({ claimedAt: -1 })
    .lean();
  res.json({ claims });
});
