import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/User';
import { AppError, asyncHandler } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

function signToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 8) {
    throw new AppError(
      'Server configuration error: JWT_SECRET is not set or too short. Add JWT_SECRET to backend .env',
      503
    );
  }
  return jwt.sign(
    { userId, email },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
  );
}

export const register = asyncHandler(async (req, res): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.type, msg: e.msg })),
    });
    return;
  }
  const { email, password, name } = req.body;
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new AppError('User with this email already exists', 409);
  }
  const user = await User.create({ email: email.toLowerCase(), password, name });
  const token = signToken(user._id.toString(), user.email);
  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      verified: user.verified,
    },
  });
});

export const login = asyncHandler(async (req, res): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.type, msg: e.msg })),
    });
    return;
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  const token = signToken(user._id.toString(), user.email);
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      verified: user.verified,
    },
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }
  const user = await User.findById(req.user.id).select('-__v');
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.json({
    user: {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      verified: user.verified,
      createdAt: user.createdAt,
    },
  });
});
