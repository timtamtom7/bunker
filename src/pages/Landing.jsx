import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M2 7l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Bunker</span>
        </div>
      </header>

      <main className="landing-main">
        <div className="landing-hero">
          <div className="landing-badge">
            <span className="badge badge-active">Private • Local-first</span>
          </div>
          <h1 className="landing-headline">
            The decisions worth making<br />
            deserve a quiet place to think.
          </h1>
          <p className="landing-sub">
            Bunker walks you through articulating what's actually at stake
            before you decide. No pros-and-cons lists. No AI telling you what to do.
            Just structured, honest thinking.
          </p>
          <div className="landing-actions">
            <Button size="lg" onClick={() => navigate('/app')}>
              Open Bunker
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Button>
          </div>
        </div>

        <div className="landing-features stagger-in">
          <div className="feature-card card-glass">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Safe Space</h3>
            <p className="feature-desc">
              Everything stays on your device. No accounts, no cloud sync, no tracking.
              Your decisions are yours alone.
            </p>
          </div>

          <div className="feature-card card-glass">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">Set a Deadline</h3>
            <p className="feature-desc">
              Pick a date. Bunker checks in when it's time — no decision stays open
              forever unless you want it to.
            </p>
          </div>

          <div className="feature-card card-glass">
            <div className="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="feature-title">The Regret Check</h3>
            <p className="feature-desc">
              Which would you regret more — doing it and failing, or never trying?
              The answer often clarifies everything.
            </p>
          </div>
        </div>

        <div className="landing-tagline">
          <span className="tagline-label">Think it through.</span>
        </div>
      </main>

      <footer className="landing-footer">
        <p>All data stored locally. No tracking. No accounts.</p>
      </footer>
    </div>
  );
}
