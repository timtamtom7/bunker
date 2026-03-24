import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import Button from '../components/Button';
import { exportData } from '../utils/storage';
import './Settings.css';

export default function Settings() {
  const { settings, toggleTheme, update } = useSettings();
  const [exported, setExported] = useState(false);

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

  return (
    <div className="page settings-page">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-sections stagger-in">
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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Dark
              </button>
              <button
                className={`theme-btn ${settings.theme === 'light' ? 'active' : ''}`}
                onClick={() => settings.theme !== 'light' && toggleTheme()}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

        {/* Privacy */}
        <section className="settings-section card-glass">
          <h2 className="settings-section-title">Privacy</h2>

          <div className="privacy-note">
            <div className="privacy-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>All data is stored locally on your device</span>
            </div>
            <div className="privacy-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <span>No accounts, no cloud, no tracking</span>
            </div>
            <div className="privacy-row">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </div>
          <p className="about-tagline">Think it through.</p>
        </section>
      </div>
    </div>
  );
}
