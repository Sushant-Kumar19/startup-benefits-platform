export interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  createdAt?: string;
}

export interface Deal {
  _id: string;
  title: string;
  description: string;
  category: string;
  partnerName: string;
  partnerLogo?: string;
  benefits: string[];
  eligibilityConditions: string;
  isLocked: boolean;
  discountInfo?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export interface Claim {
  _id: string;
  user: string;
  deal: Deal;
  status: ClaimStatus;
  claimedAt: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  cloud: 'Cloud',
  marketing: 'Marketing',
  analytics: 'Analytics',
  productivity: 'Productivity',
  development: 'Development',
  design: 'Design',
  other: 'Other',
};
