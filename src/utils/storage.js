/* ============================================
   BUNKER — localStorage Persistence
   ============================================ */

const STORAGE_KEY = 'bunker_data';

// Subscription plans
export const PLANS = {
  FREE: 'free',
  PRO: 'pro',
  TEAMS: 'teams',
};

export const PLAN_LIMITS = {
  free: { maxActiveDecisions: 5 },
  pro: { maxActiveDecisions: Infinity },
  teams: { maxActiveDecisions: Infinity },
};

export const PLAN_FEATURES = {
  free: {
    label: 'Free',
    price: 0,
    features: [
      { text: '5 active decisions', included: true },
      { text: 'Basic advice & guidance', included: true },
      { text: 'Deadline tracking', included: true },
      { text: 'Unlimited decisions', included: false },
      { text: 'AI advice on options', included: false },
      { text: 'Worst/best case modeling', included: false },
      { text: 'Export decisions to PDF', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  pro: {
    label: 'Pro',
    price: 6.99,
    period: 'month',
    features: [
      { text: 'Unlimited decisions', included: true },
      { text: 'AI advice on options', included: true },
      { text: 'Worst/best case modeling', included: true },
      { text: 'Export decisions to PDF', included: true },
      { text: 'Priority support', included: true },
      { text: '5 active decisions', included: false, note: 'unlimited in Pro' },
    ],
    cta: 'Upgrade to Pro',
    highlight: true,
  },
  teams: {
    label: 'Teams',
    price: 19.99,
    period: 'month',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Team decision workspaces', included: true },
      { text: 'Shared decision library', included: true },
      { text: 'Team deadlines & check-ins', included: true },
      { text: 'Custom export branding', included: true },
    ],
    cta: 'Get Teams',
  },
};

const defaultData = {
  decisions: [],
  settings: {
    theme: 'dark',
    checkInEnabled: true,
  },
  subscription: {
    plan: PLANS.FREE,
    status: 'active', // active | trialing | canceled
    trialEndsAt: null,
  },
};

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const data = JSON.parse(raw);
    return {
      decisions: Array.isArray(data.decisions) ? data.decisions : [],
      settings: {
        theme: data.settings?.theme || 'dark',
        checkInEnabled: data.settings?.checkInEnabled !== false,
      },
      subscription: {
        plan: data.subscription?.plan || PLANS.FREE,
        status: data.subscription?.status || 'active',
        trialEndsAt: data.subscription?.trialEndsAt || null,
      },
    };
  } catch {
    return defaultData;
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Bunker: could not save to localStorage', e);
  }
}

export function getDecisions() {
  return loadData().decisions;
}

export function getDecision(id) {
  const decisions = getDecisions();
  return decisions.find(d => d.id === id) || null;
}

export function saveDecision(decision) {
  const data = loadData();
  const now = new Date().toISOString();

  if (decision.id) {
    const idx = data.decisions.findIndex(d => d.id === decision.id);
    if (idx >= 0) {
      data.decisions[idx] = { ...data.decisions[idx], ...decision, updatedAt: now };
      saveData(data);
      return data.decisions[idx];
    }
  }

  const newId = decision.id || crypto.randomUUID();
  const newDecision = {
    ...decision,
    id: newId,
    createdAt: now,
    updatedAt: now,
  };
  data.decisions.unshift(newDecision);
  saveData(data);
  return newDecision;
}

export function deleteDecision(id) {
  const data = loadData();
  data.decisions = data.decisions.filter(d => d.id !== id);
  saveData(data);
}

export function getSettings() {
  return loadData().settings;
}

export function saveSettings(settings) {
  const data = loadData();
  data.settings = { ...data.settings, ...settings };
  saveData(data);
  return data.settings;
}

export function getSubscription() {
  return loadData().subscription;
}

export function saveSubscription(sub) {
  const data = loadData();
  data.subscription = { ...data.subscription, ...sub };
  saveData(data);
  return data.subscription;
}

export function canAddDecision() {
  const data = loadData();
  const activeCount = data.decisions.filter(d => d.status === 'active').length;
  const limit = PLAN_LIMITS[data.subscription?.plan || PLANS.FREE]?.maxActiveDecisions ?? 5;
  return activeCount < limit;
}

export function getDecisionCountInfo() {
  const data = loadData();
  const activeCount = data.decisions.filter(d => d.status === 'active').length;
  const limit = PLAN_LIMITS[data.subscription?.plan || PLANS.FREE]?.maxActiveDecisions ?? 5;
  return { activeCount, limit, unlimited: limit === Infinity };
}

export function exportData() {
  const data = loadData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bunker-export-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
