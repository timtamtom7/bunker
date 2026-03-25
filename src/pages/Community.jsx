import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPublicDecisions, publishDecision, unpublishDecision } from '../utils/community';
import Button from '../components/Button';
import './Community.css';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'career', label: 'Career' },
  { key: 'personal', label: 'Personal' },
  { key: 'financial', label: 'Financial' },
  { key: 'relocation', label: 'Relocation' },
  { key: 'education', label: 'Education' },
];

function CategoryBadge({ category }) {
  const colors = {
    career: 'badge-career',
    personal: 'badge-personal',
    financial: 'badge-financial',
    relocation: 'badge-relocation',
    education: 'badge-education',
  };
  return (
    <span className={`community-category-badge ${colors[category] || ''}`}>
      {category}
    </span>
  );
}

function DecisionPatternCard({ pattern }) {
  return (
    <div className="pattern-card">
      <div className="pattern-votes">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 4l-8 8h5v8h6v-8h5z" fill="currentColor"/>
        </svg>
        {pattern.votes}
      </div>
      <div className="pattern-content">
        <div className="pattern-option">{pattern.option}</div>
        <div className="pattern-reason">{pattern.reason}</div>
      </div>
    </div>
  );
}

function PublicDecisionCard({ decision }) {
  const navigate = useNavigate();

  return (
    <div className="public-decision-card">
      <div className="public-decision-header">
        <CategoryBadge category={decision.category || 'personal'} />
        <span className="public-decision-date">
          {new Date(decision.publishedAt || decision.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </div>
      <h3 className="public-decision-title">{decision.title}</h3>
      <p className="public-decision-problem">{decision.problem}</p>

      {decision.options?.length > 0 && (
        <div className="public-decision-options">
          {decision.options.map((opt, i) => (
            <div key={i} className="public-decision-option">
              <span className="option-name">{opt.name}</span>
              {opt.best && <span className="option-best">Best: {opt.best}</span>}
            </div>
          ))}
        </div>
      )}

      {decision.outcome && (
        <div className={`public-decision-outcome outcome-${decision.outcome}`}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            {decision.outcome === 'good'
              ? <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              : decision.outcome === 'bad'
              ? <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              : <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            }
          </svg>
          Outcome: {decision.outcome === 'good' ? 'Went well' : decision.outcome === 'bad' ? 'Regrets' : 'Neutral'}
          {decision.outcomeNote && <span className="outcome-note"> — {decision.outcomeNote}</span>}
        </div>
      )}

      {decision.patterns?.length > 0 && (
        <div className="public-decision-patterns">
          <div className="patterns-label">Common patterns:</div>
          {decision.patterns.slice(0, 2).map((p, i) => (
            <DecisionPatternCard key={i} pattern={p} />
          ))}
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/app/decisions/new', { state: { fromCommunity: true, template: decision } })}
      >
        Use as template →
      </Button>
    </div>
  );
}

export default function Community() {
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showMyShared, setShowMyShared] = useState(false);

  const publicDecisions = useMemo(() => getPublicDecisions(), []);
  const myShared = publicDecisions.filter(d => d.isOwner);

  const filtered = useMemo(() => {
    let list = showMyShared ? myShared : publicDecisions;
    if (category !== 'all') list = list.filter(d => d.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.problem.toLowerCase().includes(q) ||
        (d.options || []).some(o => o.name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [publicDecisions, myShared, category, search, showMyShared]);

  const handlePublish = (decision) => {
    publishDecision(decision.id);
    navigate('/app');
  };

  const handleUnpublish = (decision) => {
    unpublishDecision(decision.id);
  };

  return (
    <div className="page community-page">
      <div className="community-header">
        <div>
          <h1 className="community-title">Community</h1>
          <p className="community-subtitle">
            See how others approached similar decisions. Anonymously shared.
          </p>
        </div>
        <div className="community-header-actions">
          <button
            className={`community-toggle ${showMyShared ? 'active' : ''}`}
            onClick={() => setShowMyShared(s => !s)}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {showMyShared ? 'My Shared' : 'Public'}
          </button>
        </div>
      </div>

      {/* Share a decision CTA */}
      {!showMyShared && (
        <div className="community-cta card-glass">
          <div className="community-cta-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="community-cta-text">
            <strong>Share a decision anonymously</strong>
            <span> Help others facing similar choices. Your identity stays private.</span>
          </div>
          <Button size="sm" onClick={() => navigate('/app')}>
            Choose what to share
          </Button>
        </div>
      )}

      <div className="community-controls">
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
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`filter-tab ${category === c.key ? 'active' : ''}`}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="community-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <h3>No decisions here yet</h3>
          <p>
            {showMyShared
              ? 'You haven\'t shared any decisions publicly.'
              : 'Be the first to share a decision anonymously.'}
          </p>
          <Button variant="secondary" onClick={() => navigate('/app')}>
            {showMyShared ? 'Go to Decisions' : 'Share a Decision'}
          </Button>
        </div>
      ) : (
        <div className="community-grid stagger-in">
          {filtered.map(d => (
            <PublicDecisionCard key={d.publicId} decision={d} />
          ))}
        </div>
      )}

      {!showMyShared && publicDecisions.length > 0 && (
        <div className="community-stats">
          <span>{publicDecisions.length} decision{publicDecisions.length !== 1 ? 's' : ''} shared anonymously</span>
        </div>
      )}
    </div>
  );
}
