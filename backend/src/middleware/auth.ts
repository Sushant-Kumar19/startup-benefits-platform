import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    verified: boolean;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Not authorized. No token provided.' });
      return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    const user = await User.findById(decoded.userId).select('_id email verified');
    if (!user) {
      res.status(401).json({ message: 'User not found. Token invalid.' });
      return;
    }
    req.user = {
      id: user._id.toString(),
      email: user.email,
      verified: user.verified,
    };
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized. Invalid or expired token.' });
  }
};

export const requireVerified = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user?.verified) {
    res.status(403).json({
      message: 'Access denied. This deal requires verified account status.',
    });
    return;
  }
  next();
};
