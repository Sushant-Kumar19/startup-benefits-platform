import { body } from 'express-validator';
import mongoose from 'mongoose';

export const claimDealValidation = [
  body('dealId')
    .notEmpty()
    .withMessage('Deal ID is required')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('Invalid deal ID'),
];
