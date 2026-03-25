import React, { useState } from 'react';
import Button from './Button';
import './DecisionCoach.css';

const COACH_STEPS = [
  {
    id: 'problem',
    label: 'The Problem',
    question: 'What decision are you facing? Describe it in one sentence.',
    placeholder: 'e.g., Should I accept the job offer in Berlin or stay at my current job?',
    hint: 'Be specific. "Should I move?" is a weak problem. "Should I take the senior engineer role at a Berlin startup or stay as a mid-level at my current company?" is a strong one.',
    field: 'title',
  },
  {
    id: 'context',
    label: 'Context',
    question: 'Why is this decision hard right now? What\'s the pressure to decide?',
    placeholder: 'e.g., The Berlin offer expires Friday. My current team is restructuring. I\'ve been here 3 years.',
    hint: 'The pressure reveals your values. A deadline means something matters. Name it.',
    field: 'problem',
  },
  {
    id: 'options',
    label: 'Your Options',
    question: 'What are the realistic paths forward? Name each one.',
    placeholder: 'e.g., Option A: Accept Berlin. Option B: Stay and negotiate. Option C: Stay as-is.',
    hint: 'Don\'t invent fantasy options. Stick to what\'s actually on the table.',
    field: 'optionsHint',
  },
  {
    id: 'stakes',
    label: 'The Stakes',
    question: 'What\'s the worst that could happen with each option? Be honest.',
    placeholder: 'e.g., Berlin: I hate the city, new team doesn\'t work out, I\'m back job-hunting in 6 months with a gap.',
    hint: 'People underestimate worst cases for options they\'re drawn to. Don\'t skip this.',
    field: 'stakesHint',
  },
  {
    id: 'regret',
    label: 'The Regret Check',
    question: 'If you look back in 5 years — which would you regret more?',
    placeholder: 'e.g., I\'d regret not going to Berlin more than I\'d regret staying.',
    hint: 'This isn\'t about being brave. It\'s about which voice you\'d hear later. The louder one matters.',
    field: 'regretAnswer',
  },
];

function ProgressDots({ current, total, onSelect }) {
  return (
    <div className="coach-progress">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={`coach-dot ${i === current ? 'active' : i < current ? 'done' : ''}`}
          onClick={() => i < current && onSelect(i)}
          title={`Step ${i + 1}`}
        />
      ))}
    </div>
  );
}

export default function DecisionCoach({ onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    title: '',
    problem: '',
    optionsHint: '',
    stakesHint: '',
    regretAnswer: '',
  });
  const [exiting, setExiting] = useState(false);

  const current = COACH_STEPS[step];

  function goNext() {
    if (step < COACH_STEPS.length - 1) {
      setExiting(true);
      setTimeout(() => {
        setStep(s => s + 1);
        setExiting(false);
      }, 200);
    } else {
      finish();
    }
  }

  function goBack() {
    if (step > 0) {
      setExiting(true);
      setTimeout(() => {
        setStep(s => s - 1);
        setExiting(false);
      }, 200);
    }
  }

  function finish() {
    // Build a pre-filled decision from the coach answers
    const title = answers.title || 'Untitled Decision';
    const problem = answers.problem;
    const regretAnswer = answers.regretAnswer;

    onComplete({ title, problem, regretAnswer });
  }

  function handleKey(e) {
    if (e.key === 'Enter' && e.metaKey) goNext();
    if (e.key === 'Escape') onSkip?.();
  }

  const isLast = step === COACH_STEPS.length - 1;
  const canProceed = step < 2 || answers[COACH_STEPS[step].field]?.trim();

  return (
    <div className="coach-overlay" onKeyDown={handleKey} tabIndex={-1}>
      <header className="coach-header">
        <div className="coach-logo">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M2 7l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Decision Coach</span>
        </div>
        <button className="coach-skip" onClick={onSkip}>
          Skip
        </button>
      </header>

      <ProgressDots current={step} total={COACH_STEPS.length} onSelect={setStep} />

      <div className={`coach-screen ${exiting ? 'exiting' : ''}`}>
        <div className="coach-step-label">{current.label}</div>
        <h2 className="coach-question">{current.question}</h2>

        <textarea
          className="coach-input"
          placeholder={current.placeholder}
          value={answers[current.field] || ''}
          onChange={e => setAnswers(a => ({ ...a, [current.field]: e.target.value }))}
          rows={4}
          autoFocus
        />

        <div className="coach-hint">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {current.hint}
        </div>
      </div>

      <div className="coach-actions">
        <span className="coach-nav-hint">
          {step > 0 ? (
            <button className="coach-back-link" onClick={goBack}>← Back</button>
          ) : (
            <span className="coach-step-count">{step + 1} of {COACH_STEPS.length}</span>
          )}
        </span>
        <Button
          onClick={goNext}
          disabled={!canProceed}
        >
          {isLast ? 'Build My Decision' : 'Continue'}
          {!isLast && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {isLast && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}
