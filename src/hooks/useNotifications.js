// ============================================
// BUNKER — Notification Hook
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { getDecisions } from '../utils/storage';

const NOTIF_KEY = 'bunker_notif_permission';

function getStoredPermission() {
  return localStorage.getItem(NOTIF_KEY) || 'default';
}

function storePermission(permission) {
  localStorage.setItem(NOTIF_KEY, permission);
}

export function useNotifications() {
  const [permission, setPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  );
  const [enabled, setEnabled] = useState(() => {
    const stored = getStoredPermission();
    return stored === 'granted';
  });

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
      setEnabled(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'denied';
    const result = await Notification.requestPermission();
    setPermission(result);
    storePermission(result);
    setEnabled(result === 'granted');
    return result;
  }, []);

  const sendNotification = useCallback((title, options = {}) => {
    if (!enabled || typeof Notification === 'undefined') return null;
    try {
      const notif = new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        ...options,
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
      return notif;
    } catch (e) {
      console.warn('Bunker: could not send notification', e);
      return null;
    }
  }, [enabled]);

  const notifyDeadlineReminder = useCallback((decision) => {
    sendNotification(
      `Decision deadline: ${decision.title}`,
      {
        body: 'Your decision deadline is approaching. Have you made your choice?',
        tag: `deadline-${decision.id}`,
      }
    );
  }, [sendNotification]);

  const notifyDecisionDay = useCallback((decision) => {
    sendNotification(
      `Decision day: ${decision.title}`,
      {
        body: 'Your decision deadline is today. Have you decided yet?',
        tag: `deadline-${decision.id}`,
      }
    );
  }, [sendNotification]);

  const notifyHowDidItGo = useCallback((decision) => {
    sendNotification(
      `How did it go? ${decision.title}`,
      {
        body: 'It\'s been a week since your decision. How did it turn out?',
        tag: `followup-${decision.id}`,
      }
    );
  }, [sendNotification]);

  // Check for notifications that need to be sent
  const checkNotifications = useCallback(() => {
    if (!enabled) return;
    const decisions = getDecisions();
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);

    decisions.forEach(decision => {
      if (decision.status !== 'active' || !decision.deadline) return;

      const dlDate = new Date(decision.deadline);
      dlDate.setHours(0, 0, 0, 0);

      // 2 days before deadline
      const twoDaysBefore = new Date(dlDate);
      twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
      const today = new Date(now);
      today.setHours(0, 0, 0, 0);

      if (twoDaysBefore.getTime() === today.getTime()) {
        notifyDeadlineReminder(decision);
      }

      // On deadline day
      if (dlDate.getTime() === today.getTime()) {
        notifyDecisionDay(decision);
      }

      // 1 week after deadline
      const weekAfter = new Date(dlDate);
      weekAfter.setDate(weekAfter.getDate() + 7);
      if (weekAfter.getTime() === today.getTime()) {
        notifyHowDidItGo(decision);
      }
    });
  }, [enabled, notifyDeadlineReminder, notifyDecisionDay, notifyHowDidItGo]);

  return {
    permission,
    enabled,
    requestPermission,
    sendNotification,
    checkNotifications,
    notifyDeadlineReminder,
    notifyDecisionDay,
    notifyHowDidItGo,
  };
}
