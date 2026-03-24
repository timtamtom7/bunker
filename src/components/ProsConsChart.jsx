import React, { useMemo, useState } from 'react';
import './ProsConsChart.css';

function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function ProsConsChart({ decision }) {
  const [selectedOption, setSelectedOption] = useState(0);

  const analysis = useMemo(() => {
    if (!decision.options || decision.options.length === 0) return null;
    const options = decision.options.map((opt, idx) => {
      const bestWords = countWords(opt.best);
      const worstWords = countWords(opt.worst);
      const sixWords = countWords(opt.sixMonths);
      const totalWords = bestWords + worstWords + sixWords;
      // Weight: more detail = stronger consideration
      const pros = bestWords + (sixWords * 0.5);
      const cons = worstWords;
      return {
        idx,
        name: opt.name || `Option ${idx + 1}`,
        bestWords,
        worstWords,
        sixWords,
        totalWords,
        pros,
        cons,
        netScore: pros - cons,
      };
    });

    const maxPros = Math.max(...options.map(o => o.pros), 1);
    const maxCons = Math.max(...options.map(o => o.cons), 1);
    const maxVal = Math.max(maxPros, maxCons);

    return { options, maxPros, maxCons, maxVal };
  }, [decision.options]);

  if (!analysis) return null;

  const current = analysis.options[selectedOption] || analysis.options[0];

  return (
    <div className="proscons-chart">
      <div className="proscons-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 14l4-4 4 4 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Options Analysis</span>
        <div className="proscons-option-tabs">
          {analysis.options.map((opt, idx) => (
            <button
              key={idx}
              className={`proscons-tab ${selectedOption === idx ? 'active' : ''}`}
              onClick={() => setSelectedOption(idx)}
            >
              {opt.name.substring(0, 12)}{opt.name.length > 12 ? '…' : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="proscons-bars">
        <div className="proscons-row">
          <div className="proscons-label">
            <span className="pros-label">Pros</span>
          </div>
          <div className="proscons-bar-track">
            <div
              className="proscons-bar pros-bar"
              style={{ width: `${(current.pros / analysis.maxVal) * 100}%` }}
            />
            <span className="proscons-bar-value">{Math.round(current.pros)}</span>
          </div>
        </div>
        <div className="proscons-row">
          <div className="proscons-label">
            <span className="cons-label">Cons</span>
          </div>
          <div className="proscons-bar-track">
            <div
              className="proscons-bar cons-bar"
              style={{ width: `${(current.cons / analysis.maxVal) * 100}%` }}
            />
            <span className="proscons-bar-value">{Math.round(current.cons)}</span>
          </div>
        </div>
      </div>

      <div className="proscons-summary">
        <div className={`proscons-net ${current.netScore >= 0 ? 'net-positive' : 'net-negative'}`}>
          <span className="proscons-net-label">Net score</span>
          <span className="proscons-net-value">
            {current.netScore >= 0 ? '+' : ''}{current.netScore.toFixed(1)}
          </span>
        </div>
        <div className="proscons-detail-counts">
          <span className="detail-count detail-pros">{current.bestWords} best case words</span>
          <span className="detail-count detail-cons">{current.worstWords} risk words</span>
          <span className="detail-count detail-six">{current.sixWords} scenario words</span>
        </div>
      </div>
    </div>
  );
}
