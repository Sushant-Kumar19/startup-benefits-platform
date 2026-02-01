import 'dotenv/config';
import mongoose from 'mongoose';
import { Deal } from '../models/Deal';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/startup-benefits';

const deals = [
  {
    title: 'AWS Activate – $1,000 in credits',
    description: 'Get up to $1,000 in AWS promotional credits when you join the AWS Activate program. Perfect for early-stage startups building on the cloud.',
    category: 'cloud',
    partnerName: 'Amazon Web Services',
    benefits: ['$1,000 in credits', '12 months validity', 'Technical support'],
    eligibilityConditions: 'Must be an early-stage startup. Apply through AWS Activate portal.',
    isLocked: false,
    discountInfo: '$1,000 credits',
  },
  {
    title: 'Google Cloud for Startups',
    description: 'Eligible startups receive up to $2,000 in Google Cloud credits. Build, scale, and deploy with Google Cloud infrastructure.',
    category: 'cloud',
    partnerName: 'Google Cloud',
    benefits: ['$2,000 in credits', 'Free technical training', 'Startup program access'],
    eligibilityConditions: 'Pre-seed to Series A startups. Application and approval required.',
    isLocked: true,
    discountInfo: '$2,000 credits',
  },
  {
    title: 'Vercel Pro for Startups',
    description: 'Deploy and host your frontend and serverless functions. Startups get Pro plan credits and priority support.',
    category: 'cloud',
    partnerName: 'Vercel',
    benefits: ['Pro plan credits', 'Priority support', 'Analytics'],
    eligibilityConditions: 'Early-stage startup. Apply via Vercel for Startups.',
    isLocked: false,
    discountInfo: 'Pro credits',
  },
  {
    title: 'HubSpot for Startups',
    description: 'Get up to 90% off HubSpot CRM and marketing tools. Manage leads, automate marketing, and track sales in one platform.',
    category: 'marketing',
    partnerName: 'HubSpot',
    benefits: ['Up to 90% discount', 'CRM suite', 'Marketing automation'],
    eligibilityConditions: 'Startups less than 3 years old. Must apply via HubSpot for Startups.',
    isLocked: false,
    discountInfo: 'Up to 90% off',
  },
  {
    title: 'Mailchimp for Startups',
    description: 'Email marketing and automation. Startups get discounted plans and free migration support.',
    category: 'marketing',
    partnerName: 'Mailchimp',
    benefits: ['Discounted plans', 'Free migration', 'Templates'],
    eligibilityConditions: 'Startup or small business. Sign up with work email.',
    isLocked: false,
    discountInfo: 'Discounted plans',
  },
  {
    title: 'Mixpanel Growth Plan',
    description: 'Free growth plan for product analytics. Track user behavior, run A/B tests, and understand your funnel.',
    category: 'analytics',
    partnerName: 'Mixpanel',
    benefits: ['Free growth plan', 'Unlimited events', 'Cohort analysis'],
    eligibilityConditions: 'Startups and small teams. Sign up with work email.',
    isLocked: false,
    discountInfo: 'Free growth plan',
  },
  {
    title: 'Amplitude for Startups',
    description: 'Product analytics and experimentation. Eligible startups get the Growth plan at a special rate.',
    category: 'analytics',
    partnerName: 'Amplitude',
    benefits: ['Growth plan discount', 'Experimentation', 'User journey'],
    eligibilityConditions: 'Pre-seed to Series B. Application required.',
    isLocked: true,
    discountInfo: 'Growth plan discount',
  },
  {
    title: 'Notion for Startups',
    description: 'Centralize docs, wikis, and project management. Notion offers special pricing for early-stage teams.',
    category: 'productivity',
    partnerName: 'Notion',
    benefits: ['Discounted team plan', 'Unlimited blocks', 'API access'],
    eligibilityConditions: 'Startup or small team. Verification may be required.',
    isLocked: true,
    discountInfo: 'Discounted team plan',
  },
  {
    title: 'Slack for Startups',
    description: 'Team communication and collaboration. Startups get credits and integrations to keep the team in sync.',
    category: 'productivity',
    partnerName: 'Slack',
    benefits: ['Credits', 'Integrations', 'Search history'],
    eligibilityConditions: 'Startup enrolled in an accelerator or program.',
    isLocked: false,
    discountInfo: 'Credits',
  },
  {
    title: 'Figma Professional',
    description: 'Design and collaborate in real time. Eligible teams get access to Figma Professional at a reduced rate.',
    category: 'design',
    partnerName: 'Figma',
    benefits: ['Professional plan discount', 'Unlimited files', 'Team libraries'],
    eligibilityConditions: 'Startup or design team. Apply through Figma for Startups.',
    isLocked: false,
    discountInfo: 'Professional plan discount',
  },
  {
    title: 'Canva for Work',
    description: 'Design templates and brand kits. Startups get Canva for Teams at a discounted annual price.',
    category: 'design',
    partnerName: 'Canva',
    benefits: ['Teams discount', 'Brand kit', 'Templates'],
    eligibilityConditions: 'Small team or startup. Sign up with work email.',
    isLocked: false,
    discountInfo: 'Teams discount',
  },
  {
    title: 'GitHub Team for Startups',
    description: 'Collaborate on code with GitHub Team. Startups get 20 seats free for 12 months.',
    category: 'development',
    partnerName: 'GitHub',
    benefits: ['20 seats free', '12 months', 'Advanced security'],
    eligibilityConditions: 'Must be in an accelerator or have funding. GitHub for Startups application.',
    isLocked: true,
    discountInfo: '20 seats free for 12 months',
  },
  {
    title: 'JetBrains All Products Pack',
    description: 'Full access to IntelliJ, WebStorm, and other JetBrains IDEs. Startups get discounted or free licenses.',
    category: 'development',
    partnerName: 'JetBrains',
    benefits: ['All products', 'Free/discounted', '1 year'],
    eligibilityConditions: 'Startup less than 5 years old. Apply via JetBrains for Startups.',
    isLocked: false,
    discountInfo: 'Free or discounted licenses',
  },
  {
    title: 'Linear for Startups',
    description: 'Issue tracking and product development. Early-stage teams get a discount on Linear Standard.',
    category: 'development',
    partnerName: 'Linear',
    benefits: ['Standard discount', 'Unlimited members', 'Integrations'],
    eligibilityConditions: 'Early-stage startup. Verification required.',
    isLocked: false,
    discountInfo: 'Standard discount',
  },
  {
    title: 'Loom Pro',
    description: 'Async video messaging for teams. Startups get Pro plan at a reduced price for async communication.',
    category: 'productivity',
    partnerName: 'Loom',
    benefits: ['Pro plan discount', 'Unlimited videos', 'Custom branding'],
    eligibilityConditions: 'Startup or small team. Sign up with work email.',
    isLocked: false,
    discountInfo: 'Pro discount',
  },
];

async function seed(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  await Deal.deleteMany({});
  await Deal.insertMany(deals);
  console.log(`Seeded ${deals.length} deals.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
