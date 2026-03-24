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

// ============================================
// BUNKER — Collaborators & Comments
// ============================================

const COLLAB_KEY = 'bunker_collaborators';
const COMMENTS_KEY = 'bunker_comments';
const PRESENCE_KEY = 'bunker_presence';

export function getCollaborators(decisionId) {
  try {
    const raw = localStorage.getItem(COLLAB_KEY);
    if (!raw) return [];
    const collabs = JSON.parse(raw);
    return collabs[decisionId] || [];
  } catch {
    return [];
  }
}

export function addCollaborator(decisionId, collaborator) {
  const collab = {
    ...collaborator,
    id: collaborator.id || crypto.randomUUID(),
    addedAt: new Date().toISOString(),
  };
  try {
    const raw = localStorage.getItem(COLLAB_KEY);
    const collabs = raw ? JSON.parse(raw) : {};
    if (!collabs[decisionId]) collabs[decisionId] = [];
    const existing = collabs[decisionId].findIndex(c => c.email === collaborator.email);
    if (existing >= 0) {
      collabs[decisionId][existing] = { ...collabs[decisionId][existing], ...collab };
    } else {
      collabs[decisionId].push(collab);
    }
    localStorage.setItem(COLLAB_KEY, JSON.stringify(collabs));
  } catch (e) {
    console.warn('Bunker: could not save collaborator', e);
  }
  return collab;
}

export function removeCollaborator(decisionId, collaboratorId) {
  try {
    const raw = localStorage.getItem(COLLAB_KEY);
    const collabs = raw ? JSON.parse(raw) : {};
    if (collabs[decisionId]) {
      collabs[decisionId] = collabs[decisionId].filter(c => c.id !== collaboratorId);
      localStorage.setItem(COLLAB_KEY, JSON.stringify(collabs));
    }
  } catch (e) {
    console.warn('Bunker: could not remove collaborator', e);
  }
}

export function getComments(decisionId) {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    if (!raw) return [];
    const allComments = JSON.parse(raw);
    return (allComments[decisionId] || []).sort((a, b) =>
      new Date(a.createdAt) - new Date(b.createdAt)
    );
  } catch {
    return [];
  }
}

export function addComment(decisionId, comment) {
  const newComment = {
    ...comment,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    const allComments = raw ? JSON.parse(raw) : {};
    if (!allComments[decisionId]) allComments[decisionId] = [];
    allComments[decisionId].push(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
  } catch (e) {
    console.warn('Bunker: could not save comment', e);
  }
  return newComment;
}

export function deleteComment(decisionId, commentId) {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    const allComments = raw ? JSON.parse(raw) : {};
    if (allComments[decisionId]) {
      allComments[decisionId] = allComments[decisionId].filter(c => c.id !== commentId);
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
    }
  } catch (e) {
    console.warn('Bunker: could not delete comment', e);
  }
}

// Presence: simulate who's viewing by storing last-seen timestamps
export function setPresence(decisionId, userId, userName) {
  try {
    const raw = localStorage.getItem(PRESENCE_KEY);
    const presence = raw ? JSON.parse(raw) : {};
    if (!presence[decisionId]) presence[decisionId] = {};
    presence[decisionId][userId] = {
      name: userName,
      lastSeen: new Date().toISOString(),
    };
    // Clean up stale presence (> 2 minutes old)
    const cutoff = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    Object.keys(presence[decisionId]).forEach(uid => {
      if (presence[decisionId][uid].lastSeen < cutoff) {
        delete presence[decisionId][uid];
      }
    });
    localStorage.setItem(PRESENCE_KEY, JSON.stringify(presence));
  } catch (e) {
    console.warn('Bunker: could not update presence', e);
  }
}

export function getPresence(decisionId) {
  try {
    const raw = localStorage.getItem(PRESENCE_KEY);
    if (!raw) return [];
    const presence = JSON.parse(raw);
    const users = presence[decisionId] || {};
    return Object.entries(users).map(([id, data]) => ({ id, ...data }));
  } catch {
    return [];
  }
}
