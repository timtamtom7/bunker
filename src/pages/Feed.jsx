import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDecisions } from '../hooks/useDecisions';
import { useSubscription } from '../hooks/useSubscription';
import DecisionCard from '../components/DecisionCard';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import './Feed.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'decided', label: 'Decided' },
];

function OfflineBanner() {
  return (
    <div className="feed-offline-banner">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M1 1l22 22M8.59 13.51A6 6 0 0115.5 7.5M16.41 16.49A6 6 0 018.5 16.5M5 12.49a15.9 15.9 0 014.5-4.5M19 12.49a15.9 15.9 0 00-4.5-4.5M12 20h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      You're offline. Some features may be limited.
    </div>
  );
}

function DecisionLimitBanner({ activeCount, limit, onUpgrade }) {
  return (
    <div className="feed-limit-banner">
      <div className="feed-limit-info">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span>
          You've reached the limit of {limit} active decisions.{' '}
          <button className="feed-limit-link" onClick={onUpgrade}>
            Upgrade to Pro for unlimited →
          </button>
        </span>
      </div>
    </div>
  );
}

export default function Feed() {
  const { decisions, loading } = useDecisions();
  const { isFree, canAdd, activeCount, limit } = useSubscription();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const filtered = useMemo(() => {
    let list = decisions;
    if (filter === 'active') list = list.filter(d => d.status === 'active');
    if (filter === 'decided') list = list.filter(d => d.status === 'decided');
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        (d.problem && d.problem.toLowerCase().includes(q))
      );
    }
    return list;
  }, [decisions, filter, search]);

  function handleNewDecision() {
    if (isFree && !canAdd) {
      navigate('/pricing');
      return;
    }
    navigate('/app/decisions/new');
  }

  return (
    <div className="page feed-page">
      {!isOnline && <OfflineBanner />}
      {isFree && !canAdd && (
        <DecisionLimitBanner
          activeCount={activeCount}
          limit={limit}
          onUpgrade={() => navigate('/pricing')}
        />
      )}

      <div className="feed-header">
        <div className="feed-header-top">
          <h1 className="feed-title">Decisions</h1>
          <Button onClick={handleNewDecision}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Decision
          </Button>
        </div>

        <div className="feed-controls">
          <div className="search-wrap">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              className="input search-input"
              placeholder="Search decisions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`filter-tab ${filter === f.key ? 'active' : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="feed-loading">
          <div className="feed-loading-dots">
            <span/><span/><span/>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        filter === 'all' && !search ? (
          <EmptyState
            title="No decisions yet"
            description="Every important choice deserves a quiet space to think it through properly."
            action={
              <Button onClick={handleNewDecision}>
                Start a Decision
              </Button>
            }
            secondary={
              isFree && activeCount >= limit ? (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-3)' }}>
                  You're at your Free plan limit.{' '}
                  <Link to="/pricing" style={{ color: 'var(--color-accent)' }}>Upgrade to Pro →</Link>
                </p>
              ) : null
            }
          />
        ) : (
          <EmptyState
            title="No matching decisions"
            description="Try adjusting your search or filter."
            action={
              <Button variant="ghost" onClick={() => { setSearch(''); setFilter('all'); }}>
                Clear filters
              </Button>
            }
          />
        )
      ) : (
        <>
          <div className="feed-list stagger-in">
            {filtered.map(d => (
              <DecisionCard key={d.id} decision={d} />
            ))}
          </div>
          {isFree && activeCount >= limit && (
            <div className="feed-upgrade-nudge card-glass">
              <div className="feed-upgrade-nudge-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="feed-upgrade-nudge-text">
                <strong>Unlock unlimited decisions</strong>
                <span> AI advice, worst/best case modeling, PDF export, and more.</span>
              </div>
              <Link to="/pricing">
                <Button size="sm">Upgrade to Pro</Button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
