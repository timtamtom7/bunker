import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { useSubscription } from '../hooks/useSubscription';
import { useNotifications } from '../hooks/useNotifications';
import { PLANS, PLAN_LIMITS, PLAN_FEATURES } from '../utils/storage';
import Button from '../components/Button';
import { exportData } from '../utils/storage';
import './Settings.css';

function SlackConnectInput({ onSave, disabled }) {
  const [url, setUrl] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleSave() {
    if (!url.trim()) return;
    if (!url.startsWith('https://hooks.slack.com/')) {
      setError('Invalid Slack webhook URL');
      return;
    }
    setSaving(true);
    setError('');
    onSave(url.trim());
    setSaving(false);
    setShowInput(false);
  }

  if (disabled) {
    return (
      <Link to="/pricing">
        <Button size="sm" variant="secondary">Upgrade to connect</Button>
      </Link>
    );
  }

  if (showInput) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: '320px' }}>
        <input
          type="url"
          className="input"
          placeholder="https://hooks.slack.com/services/..."
          value={url}
          onChange={e => { setUrl(e.target.value); setError(''); }}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          autoFocus
          style={{ fontSize: 'var(--text-sm)' }}
        />
        {error && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-danger)' }}>{error}</span>}
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button size="sm" onClick={handleSave} loading={saving}>Save</Button>
          <Button size="sm" variant="ghost" onClick={() => setShowInput(false)}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <Button size="sm" variant="secondary" onClick={() => setShowInput(true)}>
      Connect Slack
    </Button>
  );
}

function PlanBadge({ plan }) {
  const labels = { free: 'Free', pro: 'Pro', teams: 'Teams' };
  const colors = { free: 'badge-active', pro: '', teams: '' };
  const style = plan === 'pro' || plan === 'teams'
    ? { background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' }
    : {};
  return (
    <span className={`badge ${plan === 'pro' || plan === 'teams' ? '' : 'badge-active'}`} style={style}>
      {labels[plan] || plan}
    </span>
  );
}

function LockBadge() {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/>
      </svg>
      Pro
    </span>
  );
}

export default function Settings() {
  const { settings, toggleTheme, update } = useSettings();
  const { subscription, upgrade, activeCount, limit, unlimited } = useSubscription();
  const { permission, enabled, requestPermission } = useNotifications();
  const navigate = useNavigate();
  const [exported, setExported] = useState(false);
  const [notifRequested, setNotifRequested] = useState(false);

  function handleExport() {
    exportData();
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  function handleClearData() {
    if (window.confirm('Delete ALL data? This cannot be undone.')) {
      if (window.confirm('Are you absolutely sure? All decisions will be permanently deleted.')) {
        localStorage.removeItem('bunker_data');
        window.location.reload();
      }
    }
  }

  const isFree = subscription.plan === PLANS.FREE;
  const isPro = subscription.plan === PLANS.PRO || subscription.plan === PLANS.TEAMS;

  return (
    <div className="page settings-page">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-sections stagger-in">
        {/* Subscription */}
        <section className="settings-section card-glass">
          <h2 className="settings-section-title">Subscription</h2>

          <div className="settings-row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="settings-row-info">
                <div className="settings-row-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  Current plan
                  <PlanBadge plan={subscription.plan} />
                </div>
                <div className="settings-row-desc">
                  {isFree
                    ? `${activeCount} of ${limit} decisions used`
                    : `${activeCount} active decisions — unlimited`
                  }
                </div>
              </div>
              {isFree && (
                <Link to="/pricing">
                  <Button size="sm">Upgrade</Button>
                </Link>
              )}
            </div>

            {/* Usage bar for free users */}
            {isFree && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {activeCount} / {limit} decisions used
                  </span>
                  {activeCount >= limit && (
                    <Link to="/pricing" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)' }}>
                      Upgrade →
                    </Link>
                  )}
                </div>
                <div style={{
                  height: '4px',
                  background: 'var(--surface-elevated)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min((activeCount / limit) * 100, 100)}%`,
                    background: activeCount >= limit ? 'var(--color-warning)' : 'var(--color-accent)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 300ms var(--ease-out)',
                  }}/>
                </div>
              </div>
            )}

            {isPro && (
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-accent-subtle)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                color: 'var(--text-secondary)',
              }}>
                You have access to all Pro features. Thank you for supporting Bunker.
              </div>
            )}

            {!isFree && (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button variant="secondary" size="sm" onClick={() => upgrade(PLANS.FREE)}>
                  Switch to Free
                </Button>
                <Link to="/pricing">
                  <Button variant="ghost" size="sm">Change plan</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Appearance */}
        <section className="settings-section card-glass">
          <h2 className="settings-section-title">Appearance</h2>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Theme</div>
              <div className="settings-row-desc">Choose how Bunker looks on your screen.</div>
            </div>
            <div className="theme-toggle">
              <button
                className={`theme-btn ${settings.theme === 'dark' ? 'active' : ''}`}
                onClick={() => settings.theme !== 'dark' && toggleTheme()}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Dark
              </button>
              <button
                className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
                onClick={() => settings.theme !== 'light' && toggleTheme()}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5"/>
                  <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Light
              </button>
            </div>
          </div>
        </section>

        {/* Check-ins */}
        <section className="settings-section card-glass">
          <h2 className="settings-section-title">Check-ins</h2>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Deadline reminders</div>
              <div className="settings-row-desc">
                Get reminded when a decision deadline arrives.
                Currently {settings.checkInEnabled ? 'enabled' : 'disabled'}.
              </div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={settings.checkInEnabled}
                onChange={e => update({ checkInEnabled: e.target.checked })}
              />
              <span className="toggle-track">
                <span className="toggle-thumb" />
              </span>
            </label>
          </div>
        </section>

        {/* Notifications */}
        <section className="settings-section card-glass">
          <h2 className="settings-section-title">Notifications</h2>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Browser notifications</div>
              <div className="settings-row-desc">
                {permission === 'granted'
                  ? 'Notifications are enabled. You\'ll get deadline reminders.'
                  : permission === 'denied'
                  ? 'Notifications are blocked by your browser. Enable them in browser settings.'
                  : 'Enable browser notifications to get deadline reminders and check-ins.'}
              </div>
            </div>
            {permission !== 'granted' && permission !== 'denied' && (
              <Button
                size="sm"
                variant="secondary"
                loading={notifRequested}
                onClick={async () => {
                  setNotifRequested(true);
                  await requestPermission();
                  setNotifRequested(false);
                }}
              >
                Enable
              </Button>
            )}
            {permission === 'granted' && (
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Enabled
              </span>
            )}
            {permission === 'denied' && (
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-warning)' }}>
                Blocked
              </span>
            )}
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Notification schedule</div>
              <div className="settings-row-desc">
                Bunker sends notifications at these moments:
              </div>
              <ul style={{ marginTop: 'var(--space-2)', paddingLeft: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <li style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>2 days before</strong> deadline — reminder to decide
                </li>
                <li style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>On deadline day</strong> — have you decided?
                </li>
                <li style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>1 week after</strong> deadline — how did it go?
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data */}
        <section className="settings-section card-glass">
          <h2 className="settings-section-title">Data</h2>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">Export data</div>
              <div className="settings-row-desc">
                Download all your decisions as a JSON file. Useful for backups.
              </div>
            </div>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              {exported ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Exported!
                </>
              ) : 'Export JSON'}
            </Button>
          </div>

          <div className="settings-row settings-row-danger">
            <div className="settings-row-info">
              <div className="settings-row-label">Clear all data</div>
              <div className="settings-row-desc">
                Permanently delete all decisions and settings. This cannot be undone.
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={handleClearData}>
              Clear Data
            </Button>
          </div>
        </section>

        {/* Integrations */}
        <section className="settings-section card-glass">
          <h2 className="settings-section-title">Integrations</h2>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">
                Slack
                {!isPro && <LockBadge />}
              </div>
              <div className="settings-row-desc">
                Post decision summaries to a Slack channel when you make a decision.
              </div>
            </div>
            <div className="integration-slack">
              {settings.slackWebhook ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Connected
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => update({ slackWebhook: null })}>Disconnect</Button>
                </div>
              ) : (
                <SlackConnectInput
                  onSave={(url) => update({ slackWebhook: url })}
                  disabled={!isPro}
                />
              )}
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">
                Calendar sync
                <span style={{ marginLeft: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 400 }}>
                  Always available
                </span>
              </div>
              <div className="settings-row-desc">
                Add decision deadlines to your calendar via .ics file (Apple Calendar, Google Calendar, Outlook).
                Available on every decision's detail page.
              </div>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Available
            </span>
          </div>

          <div className="settings-row">
            <div className="settings-row-info">
              <div className="settings-row-label">
                Notion export
                <span style={{ marginLeft: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 400 }}>
                  Always available
                </span>
              </div>
              <div className="settings-row-desc">
                Export decisions as markdown for easy import into Notion or any notes app.
                Available on every decision's detail page.
              </div>
            </div>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Available
            </span>
          </div>
        </section>

        {/* Privacy */}
        <section className="settings-section card-glass">
          <h2 className="settings-section-title">Privacy</h2>

          <div className="privacy-note">
            <div className="privacy-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>All data is stored locally on your device</span>
            </div>
            <div className="privacy-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>No accounts, no cloud, no tracking</span>
            </div>
            <div className="privacy-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Your decisions are private — only visible to you</span>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="settings-section card-glass">
          <h2 className="settings-section-title">About</h2>
          <div className="about-info">
            <div className="about-row">
              <span className="about-label">Version</span>
              <span className="about-value">1.0.0</span>
            </div>
            <div className="about-row">
              <span className="about-label">Storage</span>
              <span className="about-value">localStorage only</span>
            </div>
            <div className="about-row">
              <span className="about-label">Current plan</span>
              <span className="about-value" style={{ textTransform: 'capitalize' }}>{subscription.plan}</span>
            </div>
          </div>
          <p className="about-tagline">Think it through.</p>
        </section>
      </div>
    </div>
  );
}
