import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { errorHandler } from './utils/errors';
import authRoutes from './routes/authRoutes';
import dealsRoutes from './routes/dealsRoutes';
import claimsRoutes from './routes/claimsRoutes';

// Dev fallback so login works without .env (set JWT_SECRET in .env for production)
if (!process.env.JWT_SECRET && process.env.NODE_ENV !== 'production') {
  process.env.JWT_SECRET = 'dev-secret-change-in-production';
  console.warn('JWT_SECRET not set; using dev default. Set JWT_SECRET in .env for production.');
}

connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/deals', dealsRoutes);
app.use('/api/claims', claimsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
