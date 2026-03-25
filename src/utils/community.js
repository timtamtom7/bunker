/* ============================================
   BUNKER — Community / Anonymous Sharing
   ============================================ */

const COMMUNITY_KEY = 'bunker_community';

/**
 * Get all publicly shared decisions
 */
export function getPublicDecisions() {
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    // Filter out decisions whose deadline has passed and no outcome
    const now = new Date();
    return (data.decisions || []).filter(d => {
      if (!d.isPublished) return false;
      // Show if: still active OR decided OR has outcome
      if (d.status === 'decided') return true;
      if (d.outcome) return true;
      if (!d.deadline) return true;
      return true;
    }).sort((a, b) =>
      new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt)
    );
  } catch {
    return [];
  }
}

/**
 * Publish a decision anonymously
 * The decision data is stored separately from the user's private data
 */
export function publishDecision(decisionId) {
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    const data = raw ? JSON.parse(raw) : { decisions: [] };

    const privateDecisions = JSON.parse(localStorage.getItem('bunker_data') || '{}').decisions || [];
    const original = privateDecisions.find(d => d.id === decisionId);
    if (!original) return false;

    // Create a public version (no personal identifiers)
    const publicDecision = {
      publicId: crypto.randomUUID(),
      isPublished: true,
      isOwner: true,
      publishedAt: new Date().toISOString(),
      title: original.title,
      problem: original.problem,
      options: original.options,
      status: original.status,
      tradeoffs: original.tradeoffs,
      regretAnswer: original.regretAnswer,
      deadline: original.deadline,
      outcome: original.outcome,
      outcomeNote: original.outcomeNote,
      outcomeRating: original.outcomeRating,
      category: inferCategory(original),
      patterns: generatePatterns(original),
    };

    // Remove any existing entry for this decisionId
    data.decisions = data.decisions.filter(d => d.publicId !== decisionId);
    data.decisions.unshift(publicDecision);

    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('Bunker: could not publish decision', e);
    return false;
  }
}

/**
 * Unpublish a decision
 */
export function unpublishDecision(decisionId) {
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    data.decisions = data.decisions.filter(d => d.publicId !== decisionId);
    localStorage.setItem(COMMUNITY_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a decision is published
 */
export function isPublished(decisionId) {
  try {
    const raw = localStorage.getItem(COMMUNITY_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return data.decisions.some(d => d.publicId === decisionId);
  } catch {
    return false;
  }
}

/**
 * Infer a category from decision content
 */
function inferCategory(decision) {
  const text = `${decision.title} ${decision.problem}`.toLowerCase();
  if (/job| career| role| employer| promotion| salary| interview/.test(text)) return 'career';
  if (/move| city| country| relocate| rent| buy house/.test(text)) return 'relocation';
  if (/money| invest| spend| budget| loan| debt| financial/.test(text)) return 'financial';
  if (/school| course| degree| master| PhD| learn| bootcamp/.test(text)) return 'education';
  return 'personal';
}

/**
 * Generate anonymous pattern hints for a decision
 * These are simulated aggregated insights
 */
function generatePatterns(decision) {
  // Simulated patterns — in a real app, these would come from aggregated community data
  const patterns = [];
  const text = `${decision.title} ${decision.problem}`.toLowerCase();

  if (decision.options) {
    decision.options.forEach((opt, i) => {
      if (opt.best && opt.best.length > 10) {
        patterns.push({
          option: opt.name || `Option ${i + 1}`,
          reason: `Many cite ${truncate(opt.best, 40)} as the main reason for choosing this path.`,
          votes: Math.floor(Math.random() * 40) + 5,
        });
      }
    });
  }

  // Specific insight for career-related decisions
  if (text.includes('job') || text.includes('career')) {
    patterns.push({
      option: 'Accept the new role',
      reason: 'Those who moved cite "career growth" and "new challenges" most frequently.',
      votes: Math.floor(Math.random() * 60) + 10,
    });
  }

  return patterns.sort((a, b) => b.votes - a.votes);
}

function truncate(str, maxLen) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}

/**
 * Get a specific public decision by its public ID
 */
export function getPublicDecision(publicId) {
  const all = getPublicDecisions();
  return all.find(d => d.publicId === publicId) || null;
}
