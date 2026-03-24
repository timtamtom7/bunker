import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import { PLANS, PLAN_FEATURES } from '../utils/storage';
import Button from '../components/Button';
import './Pricing.css';

function CheckIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CrossIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function LockIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PricingCard({ planKey, plan }) {
  const { subscription, upgrade, isFree } = useSubscription();
  const navigate = useNavigate();
  const isCurrent = subscription.plan === planKey;
  const isHighlight = plan.highlight;

  function handleCTA() {
    if (isCurrent) {
      navigate('/app');
      return;
    }
    // Simulate upgrade (in real app: redirect to checkout)
    upgrade(planKey);
    navigate('/app');
  }

  return (
    <div className={`pricing-card card-glass ${isHighlight ? 'card-highlight' : ''}`}>
      {isHighlight && <div className="pricing-popular">Most Popular</div>}

      <div className="pricing-plan-name">
        {plan.label}
        {isCurrent && (
          <span> — Current plan</span>
        )}
      </div>

      <div className="pricing-price">
        {plan.price === 0 ? (
          <>
            <span className="pricing-price-amount pricing-price-zero">Free</span>
          </>
        ) : (
          <>
            <span className="pricing-price-amount">${plan.price.toFixed(2)}</span>
            <span className="pricing-price-period">/{plan.period}</span>
          </>
        )}
      </div>

      <div className="pricing-divider" />

      <ul className="pricing-features">
        {plan.features.map((f, i) => (
          <li key={i} className={`pricing-feature ${!f.included ? 'excluded' : ''}`}>
            <span className={`pricing-feature-icon ${f.included ? 'included' : 'excluded'}`}>
              {f.included ? <CheckIcon /> : <CrossIcon />}
            </span>
            <span>{f.text}</span>
          </li>
        ))}
      </ul>

      <div className="pricing-cta">
        {isCurrent ? (
          <Button variant="secondary" fullWidth onClick={() => navigate('/app')}>
            Open Bunker
          </Button>
        ) : plan.price === 0 ? (
          <Button variant="secondary" fullWidth onClick={handleCTA}>
            {plan.cta || 'Get Started'}
          </Button>
        ) : (
          <Button fullWidth onClick={handleCTA}>
            {plan.cta || `Upgrade to ${plan.label}`}
          </Button>
        )}
      </div>
    </div>
  );
}

const COMPARISON_ROWS = [
  { label: 'Active decisions', free: '5', pro: 'Unlimited', teams: 'Unlimited' },
  { label: 'Decisions history', free: ' Unlimited', pro: 'Unlimited', teams: 'Unlimited' },
  { label: 'Basic guidance', free: true, pro: true, teams: true },
  { label: 'Deadline tracking', free: true, pro: true, teams: true },
  { label: 'Regret check', free: true, pro: true, teams: true },
  { label: 'AI advice on options', free: false, pro: true, teams: true },
  { label: 'Worst/best case modeling', free: false, pro: true, teams: true },
  { label: 'Export to PDF', free: false, pro: true, teams: true },
  { label: 'Priority support', free: false, pro: true, teams: true },
  { label: 'Team workspaces', free: false, pro: false, teams: true },
  { label: 'Shared decision library', free: false, pro: false, teams: true },
];

function ComparisonCell({ value }) {
  if (value === true) return <span className="comp-check"><CheckIcon size={16}/></span>;
  if (value === false) return <span className="comp-cross"><CrossIcon size={16}/></span>;
  return <span className="comp-limit">{value}</span>;
}

export default function Pricing() {
  const { subscription } = useSubscription();
  const navigate = useNavigate();

  return (
    <div className="page pricing-page">
      <div className="pricing-header stagger-in">
        <div className="pricing-eyebrow">Simple, honest pricing</div>
        <h1 className="pricing-title">
          The tool your decisions<br />deserve.
        </h1>
        <p className="pricing-subtitle">
          Start free. Upgrade when you're ready to take your thinking further.
          No hidden fees. No surprise charges.
        </p>
      </div>

      {/* Tiers */}
      <div className="pricing-tiers stagger-in">
        {Object.entries(PLAN_FEATURES).map(([key, plan]) => (
          <PricingCard key={key} planKey={key} plan={plan} />
        ))}
      </div>

      {/* Comparison table */}
      <div style={{ marginBottom: 'var(--space-16)' }}>
        <div className="pricing-comparison stagger-in">
          <div className="pricing-comparison-header">
            <div className="pricing-comp-col">Feature</div>
            <div className="pricing-comp-col">Free</div>
            <div className="pricing-comp-col highlight-col">Pro — $6.99/mo</div>
          </div>
          {COMPARISON_ROWS.map((row, i) => (
            <div key={i} className="pricing-comp-row">
              <div className="pricing-comp-col">{row.label}</div>
              <div className="pricing-comp-col"><ComparisonCell value={row.free}/></div>
              <div className="pricing-comp-col" style={{ background: 'rgba(91,141,239,0.04)' }}><ComparisonCell value={row.pro}/></div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="pricing-faq">
        <h2 className="pricing-faq-title">Common questions</h2>
        {[
          {
            q: 'Can I switch plans at any time?',
            a: 'Yes. You can upgrade or downgrade your plan at any time. When you upgrade, the change takes effect immediately.',
          },
          {
            q: 'What counts as an "active" decision?',
            a: 'Any decision with a status of "Active" — meaning you\'re still weighing your options. Once you mark it as "Decided," it no longer counts toward your limit.',
          },
          {
            q: 'Is my data private?',
            a: 'Completely. All your decisions are stored locally on your device. Bunker never sends your data anywhere. No accounts required.',
          },
          {
            q: 'What happens when I hit my decision limit on the Free plan?',
            a: 'You\'ll see an upgrade prompt. You can still view and manage your existing decisions — you just won\'t be able to create new ones until you upgrade or mark some as decided.',
          },
          {
            q: 'Is the Pro plan worth it?',
            a: 'If you\'re making more than 5 decisions at a time, or you want AI-powered insights and PDF exports, Pro pays for itself quickly. Many users say it\'s the tool that finally helped them stop second-guessing.',
          },
        ].map((item, i) => (
          <div key={i} className="pricing-faq-item">
            <div className="pricing-faq-q">{item.q}</div>
            <div className="pricing-faq-a">{item.a}</div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-12)', paddingBottom: 'var(--space-8)' }}>
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-secondary)', marginBottom: 'var(--space-5)' }}>
          Not ready to commit? Start with Free — no credit card required.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={() => navigate('/app')}>
            Open Free Bunker
          </Button>
          <Button onClick={() => navigate('/app')}>
            Upgrade to Pro
          </Button>
        </div>
      </div>
    </div>
  );
}
