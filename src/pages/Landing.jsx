import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import './Landing.css';

/* ── Animated decision tree SVG for hero ── */
function HeroTreeSVG() {
  return (
    <svg
      className="hero-tree-svg"
      width="100%"
      height="auto"
      viewBox="0 0 600 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Background glow */}
      <defs>
        <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5b8def" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#5b8def" stopOpacity="0"/>
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Horizontal timeline line */}
      <line x1="50" y1="220" x2="550" y2="220" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>

      {/* Decision root node */}
      <circle cx="300" cy="60" r="36" fill="url(#nodeGlow)"/>
      <rect
        x="260" y="38" width="80" height="44" rx="10"
        fill="rgba(91,141,239,0.12)"
        stroke="#5b8def"
        strokeWidth="1.5"
        filter="url(#glow)"
      />
      <text x="300" y="56" textAnchor="middle" fill="#f5f5f7" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">
        Should I
      </text>
      <text x="300" y="70" textAnchor="middle" fill="#5b8def" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">
        take the Berlin job?
      </text>

      {/* Root to branches */}
      <path d="M 270 82 L 270 108" stroke="#5b8def" strokeWidth="1.5" strokeDasharray="200" strokeDashoffset="0" className="tree-animated-line"/>
      <path d="M 330 82 L 330 108" stroke="#5b8def" strokeWidth="1.5" strokeDasharray="200" strokeDashoffset="0" className="tree-animated-line" style={{ animationDelay: '0.3s' }}/>

      {/* Option A branch */}
      <path d="M 270 108 L 160 135" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" className="tree-animated-line" style={{ animationDelay: '0.2s' }}/>
      <path d="M 270 108 L 270 135" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" className="tree-animated-line" style={{ animationDelay: '0.4s' }}/>
      <path d="M 270 108 L 380 135" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" className="tree-animated-line" style={{ animationDelay: '0.6s' }}/>

      {/* Option B branch */}
      <path d="M 330 108 L 220 135" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" className="tree-animated-line" style={{ animationDelay: '0.5s' }}/>
      <path d="M 330 108 L 440 135" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" className="tree-animated-line" style={{ animationDelay: '0.7s' }}/>

      {/* Option A nodes */}
      <g className="tree-node-animated" style={{ animationDelay: '0.4s' }}>
        <rect x="118" y="139" width="84" height="36" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <text x="160" y="153" textAnchor="middle" fill="#8b8b8e" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="0.05em">OPTION A</text>
        <text x="160" y="166" textAnchor="middle" fill="#f5f5f7" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">Accept the offer</text>
      </g>

      <g className="tree-node-animated" style={{ animationDelay: '0.6s' }}>
        <rect x="228" y="139" width="84" height="36" rx="8" fill="rgba(48,164,108,0.08)" stroke="rgba(48,164,108,0.25)" strokeWidth="1"/>
        <text x="270" y="153" textAnchor="middle" fill="#30a46c" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="0.05em">BEST CASE</text>
        <text x="270" y="166" textAnchor="middle" fill="#f5f5f7" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">New chapter</text>
      </g>

      <g className="tree-node-animated" style={{ animationDelay: '0.8s' }}>
        <rect x="338" y="139" width="84" height="36" rx="8" fill="rgba(245,166,35,0.08)" stroke="rgba(245,166,35,0.25)" strokeWidth="1"/>
        <text x="380" y="153" textAnchor="middle" fill="#f5a623" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="0.05em">6 MONTHS</text>
        <text x="380" y="166" textAnchor="middle" fill="#f5f5f7" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">Settling in</text>
      </g>

      {/* Option B nodes */}
      <g className="tree-node-animated" style={{ animationDelay: '0.5s' }}>
        <rect x="178" y="139" width="84" height="36" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
        <text x="220" y="153" textAnchor="middle" fill="#8b8b8e" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="0.05em">OPTION B</text>
        <text x="220" y="166" textAnchor="middle" fill="#f5f5f7" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">Stay where I am</text>
      </g>

      <g className="tree-node-animated" style={{ animationDelay: '0.7s' }}>
        <rect x="398" y="139" width="84" height="36" rx="8" fill="rgba(245,166,35,0.08)" stroke="rgba(245,166,35,0.2)" strokeWidth="1"/>
        <text x="440" y="153" textAnchor="middle" fill="#f5a623" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="0.05em">RISK</text>
        <text x="440" y="166" textAnchor="middle" fill="#f5f5f7" fontSize="10" fontFamily="Inter, sans-serif" fontWeight="500">What if I regret it?</text>
      </g>

      {/* Connecting lines to timeline */}
      <path d="M 160 175 L 160 220 L 220 220" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 3" className="tree-animated-line" style={{ animationDelay: '0.8s' }}/>
      <path d="M 270 175 L 270 220" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 3" className="tree-animated-line" style={{ animationDelay: '1s' }}/>
      <path d="M 380 175 L 380 220 L 440 220" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 3" className="tree-animated-line" style={{ animationDelay: '1.2s' }}/>

      {/* Confidence node at bottom */}
      <g className="tree-node-animated" style={{ animationDelay: '1.2s' }}>
        <circle cx="300" cy="240" r="28" fill="rgba(91,141,239,0.08)" stroke="rgba(91,141,239,0.2)" strokeWidth="1"/>
        <circle cx="300" cy="240" r="4" fill="#5b8def"/>
        <text x="300" y="255" textAnchor="middle" fill="#8b8b8e" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="0.05em">CONFIDENCE</text>
      </g>

      {/* Dashed connections to confidence */}
      <path d="M 160 220 L 160 230" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M 220 220 L 220 230" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M 270 220 L 270 230" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M 380 220 L 380 230" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M 440 220 L 440 230" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M 160 230 L 300 212" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 3"/>
      <path d="M 440 230 L 300 212" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="3 3"/>
    </svg>
  );
}

/* ── Feature icon SVGs ── */
const FEATURE_ICONS = {
  structure: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  lightbulb: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  privacy: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="9 12 11 14 15 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const FEATURES = [
  {
    icon: FEATURE_ICONS.structure,
    title: 'Structured thinking',
    desc: 'Articulate the problem, explore your options, map the tradeoffs — in a format that actually forces clarity.',
  },
  {
    icon: FEATURE_ICONS.clock,
    title: 'Deadline-driven',
    desc: 'Pick a date. When it arrives, Bunker checks in. No decision stays open in limbo forever.',
  },
  {
    icon: FEATURE_ICONS.lightbulb,
    title: 'The regret check',
    desc: 'Which would you regret more — doing it and failing, or never knowing? The answer is usually revealing.',
  },
  {
    icon: FEATURE_ICONS.privacy,
    title: 'Completely private',
    desc: 'All data stays on your device. No accounts. No cloud. No tracking. Your decisions are yours alone.',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M2 7l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Bunker</span>
        </div>
        <nav className="landing-nav">
          <Link to="/pricing" className="landing-nav-link">Pricing</Link>
          <Button size="sm" onClick={() => navigate('/app')}>
            Open App
          </Button>
        </nav>
      </header>

      <main className="landing-main">
        {/* Hero */}
        <div className="landing-hero">
          <div className="landing-badge">
            <span className="badge badge-active">Private • Local-first • No accounts</span>
          </div>
          <h1 className="landing-headline">
            The decision that's been<br />
            keeping you up at night.<br />
            <span className="landing-headline-accent">Time to think it through.</span>
          </h1>
          <p className="landing-sub">
            Bunker gives you a quiet, structured space to work through the decisions that matter —
            before you commit. Not a pros-and-cons list. Not an AI telling you what to do.
            Just honest thinking, clearly organized.
          </p>
          <div className="landing-actions">
            <Button size="lg" onClick={() => navigate('/app')}>
              Start thinking clearly
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
            <Link to="/pricing">
              <Button size="lg" variant="secondary">
                See pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero illustration */}
        <div className="landing-hero-graphic">
          <HeroTreeSVG />
        </div>

        {/* Example */}
        <div className="landing-example stagger-in">
          <div className="landing-example-card card-glass">
            <div className="landing-example-header">
              <span className="landing-example-badge badge badge-active">Active</span>
              <span className="landing-example-deadline">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                  <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Deadline in 4 days
              </span>
            </div>
            <h3 className="landing-example-title">Should I take the job offer in Berlin?</h3>
            <p className="landing-example-problem">
              The role is significantly better — but it means leaving everyone I know.
              If I stay, I'll always wonder what could have been.
            </p>
            <div className="landing-example-options">
              <div className="landing-example-option">
                <span className="landing-example-opt-label">Option A</span>
                <span>Accept the Berlin offer</span>
              </div>
              <div className="landing-example-option">
                <span className="landing-example-opt-label">Option B</span>
                <span>Stay at current job</span>
              </div>
            </div>
            <div className="landing-example-regret">
              <span className="landing-example-regret-label">Regret check</span>
              <span>I'd regret not going more than going and it not working out.</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="landing-features stagger-in">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card card-glass">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="landing-tagline">
          <span className="tagline-label">Think it through.</span>
        </div>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-logo" style={{ fontSize: 'var(--text-sm)', opacity: 0.5 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 7l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Bunker</span>
          </div>
          <div className="landing-footer-links">
            <Link to="/pricing">Pricing</Link>
            <button className="landing-footer-link" onClick={() => navigate('/app')}>Open App</button>
          </div>
        </div>
        <p>All data stored locally. No tracking. No accounts.</p>
      </footer>
    </div>
  );
}
