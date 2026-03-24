import React, { useMemo, useState } from 'react';
import './RegretMeter.css';

function analyzeRegret(decision) {
  const factors = [];
  let score = 50; // baseline 50/100

  // Factor 1: Does the user have a clear regret answer?
  if (decision.regretAnswer && decision.regretAnswer.trim().length > 20) {
    factors.push({ label: 'Regret check filled in', positive: true });
    score += 10;
  } else {
    factors.push({ label: 'Regret check not filled', positive: false });
    score -= 10;
  }

  // Factor 2: Options with worst cases defined
  const worstsDefined = (decision.options || []).filter(o => o.worst && o.worst.trim()).length;
  if (worstsDefined >= 2) {
    factors.push({ label: `${worstsDefined} worst cases explored`, positive: true });
    score += 10;
  } else {
    factors.push({ label: 'Limited worst-case exploration', positive: false });
    score -= 5;
  }

  // Factor 3: Options with best cases defined
  const bestsDefined = (decision.options || []).filter(o => o.best && o.best.trim()).length;
  if (bestsDefined >= 2) {
    factors.push({ label: `${bestsDefined} best cases explored`, positive: true });
    score += 5;
  }

  // Factor 4: Has a deadline (creates urgency and clarity)
  if (decision.deadline) {
    factors.push({ label: 'Deadline set', positive: true });
    score += 5;
  } else {
    factors.push({ label: 'No deadline set', positive: false });
    score -= 5;
  }

  // Factor 5: Tradeoffs defined
  if (decision.tradeoffs && decision.tradeoffs.trim().length > 20) {
    factors.push({ label: 'Tradeoffs considered', positive: true });
    score += 5;
  }

  // Factor 6: Problem clearly stated
  if (decision.problem && decision.problem.trim().length > 30) {
    factors.push({ label: 'Problem clearly articulated', positive: true });
    score += 5;
  }

  return {
    probability: Math.max(0, Math.min(100, Math.round(score))),
    factors,
  };
}

export default function RegretMeter({ decision }) {
  const [expanded, setExpanded] = useState(false);

  const { probability, factors } = useMemo(() => analyzeRegret(decision), [decision]);

  const level = useMemo(() => {
    if (probability < 30) return { label: 'Low', color: 'var(--color-success)' };
    if (probability < 50) return { label: 'Moderate', color: 'var(--color-accent)' };
    if (probability < 70) return { label: 'Elevated', color: 'var(--color-warning)' };
    return { label: 'High', color: 'var(--color-error)' };
  }, [probability]);

  const circumference = 2 * Math.PI * 36; // r=36
  const strokeDash = (probability / 100) * circumference;

  return (
    <div className="regret-meter">
      <div className="regret-meter-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Decision Readiness</span>
        <button
          className="regret-meter-expand"
          onClick={() => setExpanded(e => !e)}
          aria-label={expanded ? 'Collapse details' : 'Expand details'}
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

      <div className="regret-meter-body">
        <div className="regret-gauge">
          <svg width="88" height="88" viewBox="0 0 88 88">
            {/* Background circle */}
            <circle
              cx="44"
              cy="44"
              r="36"
              fill="none"
              stroke="var(--surface-elevated)"
              strokeWidth="6"
            />
            {/* Progress arc */}
            <circle
              cx="44"
              cy="44"
              r="36"
              fill="none"
              stroke={level.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference}`}
              strokeDashoffset={circumference * 0.25} // start from bottom-left
              transform="rotate(-90 44 44)"
              style={{ transition: 'stroke-dasharray 600ms var(--ease-out)' }}
            />
          </svg>
          <div className="regret-gauge-center">
            <span className="regret-gauge-value" style={{ color: level.color }}>
              {probability}
            </span>
            <span className="regret-gauge-label">/100</span>
          </div>
        </div>

        <div className="regret-meter-info">
          <div className="regret-level" style={{ color: level.color }}>
            {level.label} Risk
          </div>
          <p className="regret-description">
            {probability < 30
              ? 'You\'ve thought this through carefully. Your decision is well-prepared.'
              : probability < 50
              ? 'Good foundation. Consider filling in any missing sections.'
              : probability < 70
              ? 'Some important areas may need more consideration before deciding.'
              : 'This decision may benefit from more analysis or discussion before committing.'}
          </p>
        </div>
      </div>

      {expanded && (
        <div className="regret-factors">
          {factors.map((f, idx) => (
            <div key={idx} className={`regret-factor ${f.positive ? 'factor-positive' : 'factor-negative'}`}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                {f.positive ? (
                  <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                )}
              </svg>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
