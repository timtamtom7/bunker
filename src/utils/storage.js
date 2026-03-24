/* ============================================
   BUNKER — localStorage Persistence
   ============================================ */

const STORAGE_KEY = 'bunker_data';

const defaultData = {
  decisions: [],
  settings: {
    theme: 'dark',
    checkInEnabled: true,
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
    // Update existing
    const idx = data.decisions.findIndex(d => d.id === decision.id);
    if (idx >= 0) {
      data.decisions[idx] = { ...data.decisions[idx], ...decision, updatedAt: now };
      saveData(data);
      return data.decisions[idx];
    }
  }

  // Create new
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
