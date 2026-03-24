import React, { useMemo, useState } from 'react';
import './ConfidenceGauge.css';

function calculateConfidence(decision) {
  let score = 0;
  let maxScore = 0;
  const breakdown = [];

  // Criteria 1: Has title (5pts)
  maxScore += 5;
  if (decision.title && decision.title.trim()) {
    score += 5;
    breakdown.push({ label: 'Title defined', points: 5, max: 5 });
  } else {
    breakdown.push({ label: 'Title missing', points: 0, max: 5 });
  }

  // Criteria 2: Has problem statement (10pts)
  maxScore += 10;
  if (decision.problem && decision.problem.trim().length > 20) {
    score += 10;
    breakdown.push({ label: 'Problem clearly stated', points: 10, max: 10 });
  } else if (decision.problem && decision.problem.trim().length > 0) {
    score += 5;
    breakdown.push({ label: 'Problem partially stated', points: 5, max: 10 });
  } else {
    breakdown.push({ label: 'Problem missing', points: 0, max: 10 });
  }

  // Criteria 3: At least 2 options with names (15pts)
  maxScore += 15;
  const namedOpts = (decision.options || []).filter(o => o.name && o.name.trim()).length;
  if (namedOpts >= 2) {
    score += 15;
    breakdown.push({ label: `${namedOpts} options defined`, points: 15, max: 15 });
  } else if (namedOpts === 1) {
    score += 7;
    breakdown.push({ label: 'Only 1 option defined', points: 7, max: 15 });
  } else {
    breakdown.push({ label: 'No options defined', points: 0, max: 15 });
  }

  // Criteria 4: Worst/best cases for options (20pts)
  maxScore += 20;
  const optsWithWorst = (decision.options || []).filter(o => o.worst && o.worst.trim()).length;
  const optsWithBest = (decision.options || []).filter(o => o.best && o.best.trim()).length;
  const worstRatio = namedOpts > 0 ? optsWithWorst / namedOpts : 0;
  const bestRatio = namedOpts > 0 ? optsWithBest / namedOpts : 0;
  const scenarioPts = Math.round((worstRatio + bestRatio) * 10);
  score += scenarioPts;
  breakdown.push({ label: 'Worst/best cases', points: scenarioPts, max: 20 });

  // Criteria 5: Has tradeoffs (10pts)
  maxScore += 10;
  if (decision.tradeoffs && decision.tradeoffs.trim().length > 20) {
    score += 10;
    breakdown.push({ label: 'Tradeoffs considered', points: 10, max: 10 });
  } else if (decision.tradeoffs && decision.tradeoffs.trim().length > 0) {
    score += 5;
    breakdown.push({ label: 'Tradeoffs partial', points: 5, max: 10 });
  } else {
    breakdown.push({ label: 'Tradeoffs missing', points: 0, max: 10 });
  }

  // Criteria 6: Has deadline (10pts)
  maxScore += 10;
  if (decision.deadline) {
    score += 10;
    breakdown.push({ label: 'Deadline set', points: 10, max: 10 });
  } else {
    breakdown.push({ label: 'No deadline', points: 0, max: 10 });
  }

  // Criteria 7: Has regret check (10pts)
  maxScore += 10;
  if (decision.regretAnswer && decision.regretAnswer.trim().length > 20) {
    score += 10;
    breakdown.push({ label: 'Regret check done', points: 10, max: 10 });
  } else if (decision.regretAnswer && decision.regretAnswer.trim().length > 0) {
    score += 5;
    breakdown.push({ label: 'Regret check partial', points: 5, max: 10 });
  } else {
    breakdown.push({ label: 'Regret check missing', points: 0, max: 10 });
  }

  // Criteria 8: Has 6-month scenarios (20pts)
  maxScore += 20;
  const optsWith6m = (decision.options || []).filter(o => o.sixMonths && o.sixMonths.trim().length > 20).length;
  const sixRatio = namedOpts > 0 ? optsWith6m / namedOpts : 0;
  const sixPts = Math.round(sixRatio * 20);
  score += sixPts;
  breakdown.push({ label: 'Scenario planning', points: sixPts, max: 20 });

  return {
    score,
    maxScore,
    percentage: maxScore > 0 ? Math.round((score / maxScore) * 100) : 0,
    breakdown,
  };
}

export default function ConfidenceGauge({ decision }) {
  const [expanded, setExpanded] = useState(false);

  const { percentage, breakdown } = useMemo(() => calculateConfidence(decision), [decision]);

  const level = useMemo(() => {
    if (percentage < 30) return { label: 'Low', text: 'Needs more work', color: 'var(--color-error)' };
    if (percentage < 50) return { label: 'Building', text: 'Getting there', color: 'var(--color-warning)' };
    if (percentage < 70) return { label: 'Good', text: 'Solid foundation', color: 'var(--color-accent)' };
    if (percentage < 85) return { label: 'Strong', text: 'Well-prepared', color: 'var(--color-success)' };
    return { label: 'Excellent', text: 'Decision-ready', color: 'var(--color-success)' };
  }, [percentage]);

  const fillHeight = (percentage / 100) * 64;

  return (
    <div className="confidence-gauge">
      <div className="confidence-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Confidence Score</span>
        <button
          className="confidence-expand"
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? 'Collapse' : 'Expand'}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="confidence-body">
        <div className="confidence-bar-track">
          <div className="confidence-bar-bg" />
          <div
            className="confidence-bar-fill"
            style={{
              height: `${fillHeight}px`,
              background: level.color,
            }}
          />
          <div className="confidence-ticks">
            {[0, 25, 50, 75, 100].map(tick => (
              <div key={tick} className="confidence-tick" style={{ bottom: `${tick}%` }}>
                <div className="confidence-tick-line" />
                <span className="confidence-tick-label">{tick}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="confidence-info">
          <div className="confidence-score" style={{ color: level.color }}>
            {percentage}
            <span className="confidence-max">/100</span>
          </div>
          <div className="confidence-level">{level.label}</div>
          <div className="confidence-text">{level.text}</div>
        </div>
      </div>

      {expanded && (
        <div className="confidence-breakdown">
          {breakdown.map((b, idx) => (
            <div key={idx} className="confidence-breakdown-row">
              <span className="breakdown-label">{b.label}</span>
              <div className="breakdown-bar-track">
                <div
                  className="breakdown-bar-fill"
                  style={{
                    width: `${(b.points / b.max) * 100}%`,
                    background: b.points === b.max ? 'var(--color-success)' : b.points > b.max / 2 ? 'var(--color-accent)' : 'var(--color-warning)',
                  }}
                />
              </div>
              <span className="breakdown-points">{b.points}/{b.max}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
