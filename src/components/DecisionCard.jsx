import React from 'react';
import { Link } from 'react-router-dom';
import { deadlineLabel, deadlineStatus, truncate } from '../utils/helpers';
import './DecisionCard.css';

export default function DecisionCard({ decision }) {
  const { id, title, status, deadline, decidedAt, chosenOption, options, problem } = decision;

  const statusClass = status === 'decided' ? 'badge-decided' : 'badge-active';
  const statusLabel = status === 'decided' ? 'Decided' : 'Active';

  const dlStatus = deadlineStatus(deadline);
  const dlLabel = deadlineLabel(deadline);
  const dlClass = dlStatus === 'overdue' || dlStatus === 'today' ? 'badge-deadline' : '';

  const chosenOptionName = options?.[chosenOption]?.name || null;

  return (
    <Link to={`/app/decisions/${id}`} className="decision-card card-glass">
      <div className="decision-card-header">
        <span className={`badge ${statusClass}`}>{statusLabel}</span>
        {deadline && status !== 'decided' && (
          <span className={`badge ${dlClass}`}>{dlLabel}</span>
        )}
      </div>

      <h3 className="decision-card-title">{title}</h3>

      {problem && (
        <p className="decision-card-problem">{truncate(problem, 100)}</p>
      )}

      {status === 'decided' && chosenOptionName && (
        <div className="decision-card-outcome">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Chose: <strong>{chosenOptionName}</strong></span>
        </div>
      )}

      <div className="decision-card-footer">
        <span className="decision-card-date">
          {status === 'decided' && decidedAt
            ? `Decided ${new Date(decidedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
            : `Created ${new Date(decision.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
          }
        </span>
        <svg className="decision-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  );
}
