import { useState, useEffect, useCallback } from 'react';
import {
  getDecisions,
  saveDecision,
  deleteDecision as removeDecision,
} from '../utils/storage';

export function useDecisions() {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const data = getDecisions();
    setDecisions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback((decision) => {
    const saved = saveDecision(decision);
    setDecisions(prev => [saved, ...prev.filter(d => d.id !== saved.id)]);
    return saved;
  }, []);

  const update = useCallback((decision) => {
    const saved = saveDecision(decision);
    setDecisions(prev => prev.map(d => d.id === saved.id ? saved : d));
    return saved;
  }, []);

  const remove = useCallback((id) => {
    removeDecision(id);
    setDecisions(prev => prev.filter(d => d.id !== id));
  }, []);

  const get = useCallback((id) => {
    return decisions.find(d => d.id === id) || null;
  }, [decisions]);

  return { decisions, loading, reload: load, create, update, remove, get };
}
