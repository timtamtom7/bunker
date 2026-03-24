import { useState, useEffect, useCallback } from 'react';
import {
  getSubscription,
  saveSubscription,
  PLANS,
  PLAN_LIMITS,
  getDecisionCountInfo,
} from '../utils/storage';

export function useSubscription() {
  const [subscription, setSubscription] = useState({ plan: PLANS.FREE, status: 'active', trialEndsAt: null });

  useEffect(() => {
    setSubscription(getSubscription());
  }, []);

  const setPlan = useCallback((plan) => {
    const updated = saveSubscription({ plan, status: 'active' });
    setSubscription(updated);
    return updated;
  }, []);

  const upgrade = useCallback((plan) => {
    return setPlan(plan);
  }, [setPlan]);

  const isPro = subscription.plan === PLANS.PRO || subscription.plan === PLANS.TEAMS;
  const isFree = subscription.plan === PLANS.FREE;
  const { activeCount, limit, unlimited } = getDecisionCountInfo();
  const canAdd = activeCount < limit;

  return {
    subscription,
    setPlan,
    upgrade,
    isPro,
    isFree,
    canAdd,
    activeCount,
    limit,
    unlimited,
  };
}
