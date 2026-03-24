import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDecisions } from '../hooks/useDecisions';
import DecisionCard from '../components/DecisionCard';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import './Feed.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'decided', label: 'Decided' },
];

export default function Feed() {
  const { decisions, loading } = useDecisions();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

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

  return (
    <div className="page feed-page">
      <div className="feed-header">
        <div className="feed-header-top">
          <h1 className="feed-title">Decisions</h1>
          <Link to="/app/decisions/new">
            <Button>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              New Decision
            </Button>
          </Link>
        </div>

        <div className="feed-controls">
          <div className="search-wrap">
            <svg className="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <div className="feed-loading">Loading…</div>
      ) : filtered.length === 0 ? (
        filter === 'all' && !search ? (
          <EmptyState
            title="No decisions yet"
            description="Every important choice deserves a quiet space to think it through properly."
            action={
              <Link to="/app/decisions/new">
                <Button>Start a Decision</Button>
              </Link>
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
        <div className="feed-list stagger-in">
          {filtered.map(d => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      )}
    </div>
  );
}
