import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDecisions } from '../hooks/useDecisions';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/helpers';
import './History.css';

const OUTCOME_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'good', label: 'Good' },
  { key: 'neutral', label: 'Neutral' },
  { key: 'bad', label: 'Bad' },
];

function detectPatterns(decisions) {
  const patterns = [];

  const decided = decisions.filter(d => d.status === 'decided' && d.decidedAt);
  if (decided.length < 3) return patterns;

  // Pattern: fast decisions
  const fastDecisions = decided.filter(d => {
    const created = new Date(d.createdAt);
    const decided2 = new Date(d.decidedAt);
    const hours = (decided2 - created) / (1000 * 60 * 60);
    return hours < 24;
  });
  if (fastDecisions.length > decided.length * 0.6) {
    patterns.push({
      type: 'fast',
      icon: '⚡',
      headline: 'You tend to decide quickly.',
      body: 'Most of your decisions were made within a day of creation. Quick decisions can be powerful — just make sure you\'ve slept on the big ones.',
      color: 'var(--color-warning)',
    });
  }

  // Pattern: slow decisions
  const slowDecisions = decided.filter(d => {
    const created = new Date(d.createdAt);
    const decided2 = new Date(d.decidedAt);
    const days = (decided2 - created) / (1000 * 60 * 60 * 24);
    return days > 7;
  });
  if (slowDecisions.length > decided.length * 0.4) {
    patterns.push({
      type: 'slow',
      icon: '🌙',
      headline: 'You make big decisions faster when you sleep on it.',
      body: 'You often take more than a week to decide. This patience usually leads to better outcomes — keep trusting the process.',
      color: 'var(--color-success)',
    });
  }

  // Pattern: high regret rate
  const regrets = decided.filter(d => d.wouldChooseAgain === false);
  if (regrets.length >= 2 && regrets.length > decided.length * 0.3) {
    patterns.push({
      type: 'regret',
      icon: '🔁',
      headline: 'Some decisions didn\'t age well.',
      body: `${regrets.length} of your decisions came with second thoughts. Consider adding a regret check before committing.`,
      color: 'var(--color-error)',
    });
  }

  // Pattern: consistency
  const consistent = decided.filter(d => d.wouldChooseAgain === true);
  if (consistent.length >= 3 && consistent.length > decided.length * 0.6) {
    patterns.push({
      type: 'confident',
      icon: '✅',
      headline: 'You\'re a confident decision maker.',
      body: `${consistent.length} of your decisions came with zero regrets. You know what you want — trust that.`,
      color: 'var(--color-success)',
    });
  }

  return patterns;
}

function TimelineItem({ decision, index }) {
  const navigate = useNavigate();
  const isChosen = decision.chosenOption !== null && decision.chosenOption !== undefined;
  const chosenOpt = decision.options?.[decision.chosenOption];
  const daysToDecide = decision.decidedAt
    ? Math.round((new Date(decision.decidedAt) - new Date(decision.createdAt)) / (1000 * 60 * 60 * 24))
    : null;

  const outcomeColor = decision.outcome === 'good'
    ? 'var(--color-success)'
    : decision.outcome === 'bad'
    ? 'var(--color-error)'
    : 'var(--text-muted)';

  return (
    <div className="timeline-item" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="timeline-connector">
        <div className="timeline-dot" style={{ background: outcomeColor }} />
        {index !== 0 && <div className="timeline-line" />}
      </div>

      <div className="timeline-content">
        <div className="timeline-meta">
          <span className="timeline-date">{formatDate(decision.decidedAt || decision.createdAt)}</span>
          {daysToDecide !== null && (
            <span className="timeline-duration">
              {daysToDecide === 0 ? 'Decided same day' : `${daysToDecide} day${daysToDecide === 1 ? '' : 's'} to decide`}
            </span>
          )}
          {decision.outcome && (
            <span className="timeline-outcome-badge" style={{ color: outcomeColor, borderColor: outcomeColor }}>
              {decision.outcome}
            </span>
          )}
        </div>

        <button
          className="timeline-title"
          onClick={() => navigate(`/app/decisions/${decision.id}`)}
        >
          {decision.title}
        </button>

        {isChosen && chosenOpt && (
          <div className="timeline-chosen">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Chose: <strong>{chosenOpt.name}</strong>
          </div>
        )}

        {decision.decisionWhy && (
          <p className="timeline-why">{decision.decisionWhy}</p>
        )}
      </div>
    </div>
  );
}

export default function History() {
  const { decisions } = useDecisions();
  const [outcomeFilter, setOutcomeFilter] = useState('all');

  const decidedDecisions = useMemo(() => {
    return decisions
      .filter(d => d.status === 'decided')
      .sort((a, b) => {
        const dateA = new Date(a.decidedAt || a.createdAt);
        const dateB = new Date(b.decidedAt || b.createdAt);
        return dateB - dateA;
      });
  }, [decisions]);

  const filtered = useMemo(() => {
    if (outcomeFilter === 'all') return decidedDecisions;
    return decidedDecisions.filter(d => d.outcome === outcomeFilter);
  }, [decidedDecisions, outcomeFilter]);

  const patterns = useMemo(() => detectPatterns(decidedDecisions), [decidedDecisions]);

  const stats = useMemo(() => {
    const total = decidedDecisions.length;
    const good = decidedDecisions.filter(d => d.outcome === 'good').length;
    const neutral = decidedDecisions.filter(d => d.outcome === 'neutral').length;
    const bad = decidedDecisions.filter(d => d.outcome === 'bad').length;
    const noRegrets = decidedDecisions.filter(d => d.wouldChooseAgain === true).length;
    const withRegrets = decidedDecisions.filter(d => d.wouldChooseAgain === false).length;
    return { total, good, neutral, bad, noRegrets, withRegrets };
  }, [decidedDecisions]);

  return (
    <div className="page history-page">
      <div className="history-header">
        <div className="history-header-top">
          <div>
            <h1 className="history-title">Decision History</h1>
            <p className="history-subtitle">
              {stats.total === 0
                ? 'No decided decisions yet.'
                : `${stats.total} decision${stats.total === 1 ? '' : 's'} made`}
            </p>
          </div>
          <Link to="/app">
            <Button variant="secondary" size="sm">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Back
            </Button>
          </Link>
        </div>
      </div>

      {stats.total === 0 ? (
        <EmptyState
          title="No decisions yet"
          description="When you record decisions, they'll appear here as a timeline of your decision history."
          action={
            <Link to="/app/decisions/new">
              <Button>Make Your First Decision</Button>
            </Link>
          }
        />
      ) : (
        <div className="history-body stagger-in">
          {/* Stats row */}
          <div className="history-stats">
            <div className="history-stat">
              <span className="history-stat-value">{stats.total}</span>
              <span className="history-stat-label">Decisions made</span>
            </div>
            <div className="history-stat history-stat-good">
              <span className="history-stat-value">{stats.good}</span>
              <span className="history-stat-label">Good outcomes</span>
            </div>
            <div className="history-stat history-stat-neutral">
              <span className="history-stat-value">{stats.neutral}</span>
              <span className="history-stat-label">Neutral</span>
            </div>
            <div className="history-stat history-stat-bad">
              <span className="history-stat-value">{stats.bad}</span>
              <span className="history-stat-label">Regretted</span>
            </div>
          </div>

          {/* Outcome filter */}
          <div className="history-filter">
            <div className="filter-tabs">
              {OUTCOME_FILTERS.map(f => (
                <button
                  key={f.key}
                  className={`filter-tab ${outcomeFilter === f.key ? 'active' : ''}`}
                  onClick={() => setOutcomeFilter(f.key)}
                >
                  {f.label}
                  {f.key !== 'all' && stats[f.key] > 0 && (
                    <span className="filter-count">{stats[f.key]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pattern cards */}
          {patterns.length > 0 && (
            <div className="history-patterns">
              {patterns.map((p, i) => (
                <div key={i} className="pattern-card" style={{ borderColor: p.color + '40', background: p.color + '10' }}>
                  <span className="pattern-icon">{p.icon}</span>
                  <div className="pattern-text">
                    <strong style={{ color: p.color }}>{p.headline}</strong>
                    <p className="pattern-body">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Timeline */}
          {filtered.length === 0 ? (
            <div className="history-empty-filter">
              <p>No {outcomeFilter} outcomes found.</p>
              <button className="btn btn-ghost btn-sm" onClick={() => setOutcomeFilter('all')}>
                Show all decisions
              </button>
            </div>
          ) : (
            <div className="timeline">
              {filtered.map((d, i) => (
                <TimelineItem key={d.id} decision={d} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
