import React, { useState, useEffect } from 'react';
import Button from './Button';
import './Onboarding.css';

const ONBOARDING_KEY = 'bunker_onboarding_complete';

function DecisionTreeSVG() {
  return (
    <svg className="decision-tree-svg" width="280" height="200" viewBox="0 0 280 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Root node */}
      <rect className="tree-node tree-node-root" x="112" y="8" width="56" height="28" rx="6"/>
      <text className="tree-label-root" x="140" y="25" textAnchor="middle">Decision</text>

      {/* Lines from root */}
      <path className="tree-line" d="M 140 36 L 140 56"/>
      <path className="tree-line" d="M 140 36 L 220 56"/>

      {/* Left branch label */}
      <text className="tree-label" x="108" y="52" textAnchor="middle">Option A</text>

      {/* Right branch label */}
      <text className="tree-label" x="228" y="52" textAnchor="middle">Option B</text>

      {/* Option A subtree */}
      <path className="tree-line" d="M 140 60 L 80 80"/>
      <path className="tree-line" d="M 140 60 L 140 80"/>
      <path className="tree-line" d="M 140 60 L 200 80"/>

      <rect className="tree-node" x="52" y="84" width="56" height="24" rx="5"/>
      <text className="tree-label" x="80" y="99" textAnchor="middle">Best</text>

      <rect className="tree-node" x="112" y="84" width="56" height="24" rx="5"/>
      <text className="tree-label" x="140" y="99" textAnchor="middle">Worst</text>

      <rect className="tree-node" x="172" y="84" width="56" height="24" rx="5"/>
      <text className="tree-label" x="200" y="99" textAnchor="middle">6mo</text>

      {/* Option B subtree */}
      <path className="tree-line" d="M 220 60 L 220 80"/>
      <path className="tree-line" d="M 220 60 L 252 80"/>

      <rect className="tree-node" x="192" y="84" width="56" height="24" rx="5"/>
      <text className="tree-label" x="220" y="99" textAnchor="middle">6mo</text>

      <rect className="tree-node" x="252" y="84" width="22" height="24" rx="5"/>
      <text className="tree-label" x="263" y="99" textAnchor="middle">?</text>

      {/* Confidence indicator */}
      <circle className="tree-node-circle" cx="140" cy="160" r="32"/>
      <circle className="tree-node-circle-inner" cx="140" cy="160" r="4"/>
      <text className="tree-label" x="140" y="172" textAnchor="middle">Confidence</text>

      {/* Connecting lines to confidence */}
      <path className="tree-line" d="M 140 108 L 140 128" strokeDasharray="4 3"/>
      <path className="tree-line" d="M 220 108 L 140 128" strokeDasharray="4 3"/>
      <path className="tree-line" d="M 263 108 L 140 128" strokeDasharray="4 3"/>
    </svg>
  );
}

function BranchingSVG() {
  return (
    <svg className="branching-svg" width="260" height="180" viewBox="0 0 260 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Root */}
      <rect className="branch-node" x="100" y="4" width="60" height="26" rx="6"/>
      <text style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 600, fill: 'var(--text)', textAnchor: 'middle', dominantBaseline: 'middle' }} x="130" y="17">
        Take job in Berlin?
      </text>

      {/* Branch paths */}
      <path className="branch-path branch-path-a" d="M 130 30 L 130 50 L 60 70"/>
      <path className="branch-path branch-path-b" d="M 130 30 L 130 50 L 200 70"/>

      {/* Option A */}
      <rect className="branch-node branch-node-a" x="14" y="74" width="92" height="50" rx="8"/>
      <text style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--text-muted)', textAnchor: 'start', x: '24', y: '92' }}>
        OPTION A
      </text>
      <text style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, fill: 'var(--text)', x: '24', y: '108' }}>
        Accept the offer
      </text>
      <text style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--color-success)', x: '24', y: '118' }}>
        + New city, growth
      </text>

      {/* Option B */}
      <rect className="branch-node branch-node-b" x="154" y="74" width="92" height="50" rx="8"/>
      <text style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--text-muted)', textAnchor: 'start', x: '164', y: '92' }}>
        OPTION B
      </text>
      <text style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 600, fill: 'var(--text)', x: '164', y: '108' }}>
        Stay at current job
      </text>
      <text style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', fill: 'var(--color-warning)', x: '164', y: '118' }}>
        + Stability, familiar
      </text>

      {/* Sub-paths */}
      <path className="branch-path branch-path-a" d="M 60 124 L 60 140 L 36 160" style={{ animationDelay: '0.8s' }}/>
      <path className="branch-path branch-path-a" d="M 60 124 L 60 140 L 84 160" style={{ animationDelay: '1s' }}/>
      <path className="branch-path branch-path-b" d="M 200 124 L 200 140 L 176 160" style={{ animationDelay: '1.1s' }}/>
      <path className="branch-path branch-path-b" d="M 200 124 L 200 140 L 224 160" style={{ animationDelay: '1.3s' }}/>

      {/* Leaf nodes */}
      <circle className="branch-node" cx="36" cy="166" r="12" style={{ animation: 'nodeAppear 0.3s ease-out 0.9s both' }}/>
      <circle className="branch-node" cx="84" cy="166" r="12" style={{ animation: 'nodeAppear 0.3s ease-out 1.1s both' }}/>
      <circle className="branch-node" cx="176" cy="166" r="12" style={{ animation: 'nodeAppear 0.3s ease-out 1.2s both' }}/>
      <circle className="branch-node" cx="224" cy="166" r="12" style={{ animation: 'nodeAppear 0.3s ease-out 1.4s both' }}/>

      <text style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fill: 'var(--text-muted)', textAnchor: 'middle', x: '36', y: '170' }}>Best</text>
      <text style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fill: 'var(--text-muted)', textAnchor: 'middle', x: '84', y: '170' }}>Worst</text>
      <text style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fill: 'var(--text-muted)', textAnchor: 'middle', x: '176', y: '170' }}>6mo</text>
      <text style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', fill: 'var(--text-muted)', textAnchor: 'middle', x: '224', y: '170' }}>2yr</text>
    </svg>
  );
}

const SCREENS = [
  {
    label: '01 — Concept',
    title: 'Every big decision\nstarts with this.',
    desc: 'Not a pros-and-cons list. Not an AI telling you what to do. Just a quiet space to think clearly — before you commit.',
    illustration: <DecisionTreeSVG />,
    example: null,
  },
  {
    label: '02 — Your Options',
    title: 'Add your options.\nBe honest about each one.',
    desc: 'Name each path. What does it look like in 6 months? In 2 years? What\'s the worst that could happen? What\'s the best case?',
    illustration: <BranchingSVG />,
    example: {
      title: '"Should I take the job in Berlin?"',
      meta: 'Two options, each with honest best/worst case scenarios. Deadline: end of month.',
    },
  },
  {
    label: '03 — Tradeoffs',
    title: 'See what actually\nmatters to you.',
    desc: 'The regret check surfaces what you\'d miss either way. The tradeoff section forces clarity on what each option costs you.',
    illustration: null,
    example: {
      title: 'Regret Check',
      meta: 'Which would you regret more: moving to Berlin and it not working out — or never going and always wondering?',
    },
  },
  {
    label: '04 — Confidence',
    title: 'Make the call.\nKnow why you made it.',
    desc: 'Record your decision with a deadline. Bunker checks in when it\'s time. Thirty days later, you reflect — was it the right call?',
    illustration: null,
    example: null,
  },
];

export default function Onboarding({ onComplete }) {
  const [screen, setScreen] = useState(0);
  const [exiting, setExiting] = useState(false);

  function goNext() {
    if (screen < SCREENS.length - 1) {
      setExiting(true);
      setTimeout(() => {
        setScreen(s => s + 1);
        setExiting(false);
      }, 250);
    } else {
      finish();
    }
  }

  function goBack() {
    if (screen > 0) {
      setExiting(true);
      setTimeout(() => {
        setScreen(s => s - 1);
        setExiting(false);
      }, 250);
    }
  }

  function finish() {
    try {
      localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (_) {}
    onComplete();
  }

  function handleKey(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goNext();
    }
    if (e.key === 'Escape') {
      finish();
    }
  }

  const s = SCREENS[screen];
  const isLast = screen === SCREENS.length - 1;

  return (
    <div className="onboarding-overlay" onKeyDown={handleKey} tabIndex={-1}>
      <header className="onboarding-header">
        <div className="onboarding-logo">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M2 7l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Bunker</span>
        </div>
        <button className="onboarding-skip" onClick={finish}>
          Skip intro
        </button>
      </header>

      <div className="onboarding-progress">
        {SCREENS.map((_, i) => (
          <div
            key={i}
            className={`progress-dot ${i === screen ? 'active' : i < screen ? 'done' : ''}`}
          />
        ))}
      </div>

      <div className={`onboarding-screen ${exiting ? 'exiting' : ''}`}>
        {s.illustration && (
          <div className="onboarding-illustration">
            {s.illustration}
          </div>
        )}

        <div className="onboarding-label">{s.label}</div>
        <h1 className="onboarding-title">{s.title}</h1>
        <p className="onboarding-desc">{s.desc}</p>

        {s.example && (
          <div className="onboarding-example">
            <div className="onboarding-example-label">Example</div>
            <div className="onboarding-example-title">{s.example.title}</div>
            <p className="onboarding-example-meta">{s.example.meta}</p>
          </div>
        )}
      </div>

      <div className="onboarding-actions">
        <span className="onboarding-nav-hint">
          {screen > 0 ? '← Previous' : `${screen + 1} of ${SCREENS.length}`}
        </span>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          {screen > 0 && (
            <Button variant="ghost" onClick={goBack}>
              Back
            </Button>
          )}
          <Button onClick={goNext}>
            {isLast ? 'Get Started' : 'Continue'}
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
    </div>
  );
}

export function hasCompletedOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === 'true';
  } catch (_) {
    return false;
  }
}
