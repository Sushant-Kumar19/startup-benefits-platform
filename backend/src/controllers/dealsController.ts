import { Response } from 'express';
import { Deal } from '../models/Deal';
import { asyncHandler } from '../utils/errors';
import { AppError } from '../utils/errors';

export const getAllDeals = asyncHandler(async (req, res): Promise<void> => {
  const { category, accessLevel, search } = req.query;
  const filter: Record<string, unknown> = {};

  if (typeof category === 'string' && category.trim()) {
    filter.category = category.trim();
  }
  if (typeof accessLevel === 'string' && accessLevel) {
    if (accessLevel === 'locked') filter.isLocked = true;
    else if (accessLevel === 'unlocked') filter.isLocked = false;
  }
  if (typeof search === 'string' && search.trim()) {
    const term = search.trim();
    filter.$or = [
      { title: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { partnerName: { $regex: term, $options: 'i' } },
    ];
  }
  const deals = await Deal.find(filter)
    .sort({ createdAt: -1 })
    .lean();
  res.json({ deals });
});

export const getDealById = asyncHandler(async (req, res): Promise<void> => {
  const { id } = req.params;
  const deal = await Deal.findById(id).lean();
  if (!deal) {
    throw new AppError('Deal not found', 404);
  }
  res.json({ deal });
});
