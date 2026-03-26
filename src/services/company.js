// Company Structure and Investment Readiness - Bunker

export const COMPANY = {
  name: 'Bunker Technologies, Inc.',
  founded: '2023',
  website: 'bunker.app',
  structure: 'C-Corp (Delaware)',
  stage: 'Bootstrapped / Pre-seed',
  employees: 1,
};

export const SUBSCRIPTION_PRICING = {
  free: { name: 'Free', price: 0, decisionsPerMonth: 10 },
  pro: { name: 'Pro', price: 7.99, decisionsPerMonth: -1, features: ['Unlimited decisions', 'AI coaching', 'Advanced synthesis'] },
  teams: { name: 'Teams', price: 14.99, decisionsPerMonth: -1, perUser: true, features: ['Everything in Pro', 'Team decisions', 'Admin dashboard'] },
};

export const FINANCIAL_METRICS = {
  arr: 0,
  arrTarget: 500000,
  activeSubscribers: 0,
  churnRate: 0.03,
  ltv: 220,
  cac: 15,
  get progressToTarget() { return Math.min(1, this.arr / this.arrTarget); },
};

export const INVESTMENT_CHECKLIST = [
  { title: 'Business Plan', completed: true, notes: 'Decision intelligence platform strategy' },
  { title: 'Financial Model', completed: true, notes: 'ARR projections to $500K' },
  { title: 'Cap Table', completed: false, notes: 'Pending legal setup' },
  { title: 'Pitch Deck', completed: false, notes: 'Needs clearer decision ROI angle' },
  { title: 'Unit Economics', completed: true, notes: 'LTV:CAC > 3.5x' },
];

export const HIRING_PLAN = [
  { role: 'iOS Engineer', timing: 'Q1 2025', priority: 'high', salaryRange: '$110-140K' },
  { role: 'ML Engineer (Decision AI)', timing: 'Q2 2025', priority: 'high', salaryRange: '$130-160K' },
];
