/* ============================================
   BUNKER — Helper Utilities
   ============================================ */

/**
 * Format a date string for display
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date for input[type=date] value
 */
export function toDateInputValue(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toISOString().split('T')[0];
}

/**
 * Days remaining until deadline
 */
export function daysUntil(isoDate) {
  if (!isoDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const deadline = new Date(isoDate);
  deadline.setHours(0, 0, 0, 0);
  const diff = deadline - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Deadline label
 */
export function deadlineLabel(isoDate) {
  if (!isoDate) return 'No deadline set';
  const days = daysUntil(isoDate);
  if (days === null) return 'No deadline set';
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

/**
 * Deadline status
 */
export function deadlineStatus(isoDate) {
  if (!isoDate) return 'none';
  const days = daysUntil(isoDate);
  if (days === null) return 'none';
  if (days < 0) return 'overdue';
  if (days === 0) return 'today';
  if (days <= 3) return 'soon';
  return 'ok';
}

/**
 * Is the deadline today?
 */
export function isDeadlineToday(isoDate) {
  return daysUntil(isoDate) === 0;
}

/**
 * Is it 30+ days since the decision was made?
 */
export function needsReflection(decidedAt) {
  if (!decidedAt) return false;
  const now = new Date();
  const decided = new Date(decidedAt);
  const diff = now - decided;
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= 30;
}

/**
 * Generate a UUID
 */
export function uuid() {
  return crypto.randomUUID();
}

/**
 * Truncate text
 */
export function truncate(str, maxLen = 80) {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + '…';
}
