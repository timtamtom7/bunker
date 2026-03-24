import React, { useState, useMemo } from 'react';
import './AIAdviceCard.css';

function generateAdvice(decision) {
  const { title, problem, options = [] } = decision;
  const titleLower = (title || '').toLowerCase();
  const problemLower = (problem || '').toLowerCase();
  const advice = [];

  // Generic thought-provoking questions
  advice.push({
    type: 'question',
    icon: 'question',
    text: 'What does the status quo look like if you do nothing? Inaction is also a choice.',
  });

  // Option-specific advice
  if (options.length >= 2) {
    const optNames = options.map(o => o.name).filter(Boolean);
    if (optNames[0]) {
      advice.push({
        type: 'insight',
        icon: 'lightbulb',
        text: `Have you considered the long-term implications of "${optNames[0]}"? What does this look like in 5 years?`,
      });
    }
    if (optNames[1]) {
      advice.push({
        type: 'warning',
        icon: 'alert',
        text: `"${optNames[1]}" might feel safer short-term. But could it close doors you'd want to keep open?`,
      });
    }
  }

  // Time-horizon check
  advice.push({
    type: 'question',
    icon: 'clock',
    text: 'How will you feel about this decision in 6 months? In 2 years? Time horizon changes everything.',
  });

  // Reversibility
  advice.push({
    type: 'insight',
    icon: 'undo',
    text: 'Is this decision reversible? If yes, you can be more bold. If no, slow down and be thorough.',
  });

  // Regret check prompt
  advice.push({
    type: 'question',
    icon: 'regret',
    text: 'Which would you regret more: doing this and it going wrong — or NOT doing it and wondering "what if"?',
  });

  // Risk framing
  const hasRiskKeywords = titleLower.includes('risk') || titleLower.includes('safe') || titleLower.includes('career') || problemLower.includes('fear');
  if (hasRiskKeywords) {
    advice.push({
      type: 'warning',
      icon: 'alert',
      text: 'It sounds like risk is a core concern. Ask yourself: what\'s the actual downside, and can you survive it?',
    });
  }

  // Financial decision
  const hasMoneyKeywords = titleLower.includes('money') || titleLower.includes('salary') || titleLower.includes('pay') || titleLower.includes('invest') || titleLower.includes('cost');
  if (hasMoneyKeywords) {
    advice.push({
      type: 'insight',
      icon: 'chart',
      text: 'Money decisions are emotional. Before choosing, separate the math from the feeling.',
    });
  }

  // Career decision
  const hasCareerKeywords = titleLower.includes('job') || titleLower.includes('career') || titleLower.includes('offer') || titleLower.includes('role') || titleLower.includes('company');
  if (hasCareerKeywords) {
    advice.push({
      type: 'insight',
      icon: 'rocket',
      text: 'Career regrets are rarely about the safe choice. People usually regret NOT taking the leap.',
    });
  }

  // Sleep on it
  advice.push({
    type: 'pattern',
    icon: 'moon',
    text: 'You make big decisions faster when you sleep on it. If it still feels right tomorrow, it probably is.',
  });

  return advice.slice(0, 5);
}

export default function AIAdviceCard({ decision }) {
  const [expanded, setExpanded] = useState(false);

  const allAdvice = useMemo(() => generateAdvice(decision), [decision]);
  const visibleAdvice = expanded ? allAdvice : allAdvice.slice(0, 2);
  const hasMore = allAdvice.length > 2;

  if (!decision.options || decision.options.length < 2) return null;

  return (
    <div className="ai-advice-card">
      <div className="ai-advice-header">
        <div className="ai-advice-icon-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="ai-advice-title-wrap">
          <span className="ai-advice-label">AI Decision Advice</span>
          <span className="ai-advice-sublabel">Based on your framework</span>
        </div>
        <span className="ai-advice-badge">Simulated</span>
      </div>

      <div className="ai-advice-list">
        {visibleAdvice.map((item, idx) => (
          <div key={idx} className={`ai-advice-item ai-advice-${item.type}`}>
            <div className="ai-advice-item-icon">
              {item.icon === 'question' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              )}
              {item.icon === 'lightbulb' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {item.icon === 'alert' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {item.icon === 'clock' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/><polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              )}
              {item.icon === 'undo' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="1 4 1 10 7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {item.icon === 'regret' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5"/></svg>
              )}
              {item.icon === 'chart' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              )}
              {item.icon === 'rocket' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
              {item.icon === 'moon' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </div>
            <p className="ai-advice-text">{item.text}</p>
          </div>
        ))}
      </div>

      {hasMore && (
        <button className="ai-advice-toggle" onClick={() => setExpanded(e => !e)}>
          {expanded ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Show less
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              {allAdvice.length - 2} more insights
            </>
          )}
        </button>
      )}
    </div>
  );
}
