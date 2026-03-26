// Platform Detection and Subscription Utilities - Bunker

export const PLATFORM = {
  WEB: 'web',
  IOS: 'ios',
  ANDROID: 'android',
};

export function getPlatform() {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('android')) return PLATFORM.ANDROID;
  if (/iphone|ipad|ipod/.test(ua)) return PLATFORM.IOS;
  return PLATFORM.WEB;
}

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  TEAMS: 'teams',
};

export const subscriptionConfig = {
  [SUBSCRIPTION_TIERS.FREE]: {
    name: 'Free',
    price: '$0',
    features: ['10 decisions/month', 'Basic templates', 'Simple synthesis'],
  },
  [SUBSCRIPTION_TIERS.PRO]: {
    name: 'Pro',
    price: '$7.99/month',
    features: ['Unlimited decisions', 'All templates', 'AI coaching', 'Advanced synthesis', 'Export'],
  },
  [SUBSCRIPTION_TIERS.TEAMS]: {
    name: 'Teams',
    price: '$14.99/user/month',
    features: ['Everything in Pro', 'Team decisions', 'Admin dashboard', 'SSO', 'Priority support'],
  },
};

export const RETENTION_MILESTONES = [
  { day: 1, event: 'first_decision', title: 'First Decision', description: 'Record your first decision' },
  { day: 3, event: 'first_synthesis', title: 'First Synthesis', description: 'Generate your first decision synthesis' },
  { day: 7, event: 'first_ai_coaching', title: 'AI Coaching', description: 'Receive your first AI coaching insight' },
];
