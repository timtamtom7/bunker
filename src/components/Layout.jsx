import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Layout.css';

export default function Layout({ children, showNav = true }) {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) {
    return <div className="layout-landing">{children}</div>;
  }

  return (
    <div className="layout-app">
      <header className="layout-header glass">
        <div className="layout-header-inner">
          <Link to="/app" className="layout-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 7l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Bunker</span>
          </Link>
          <nav className="layout-nav">
            <Link to="/app" className={`nav-link ${location.pathname === '/app' ? 'active' : ''}`}>
              Decisions
            </Link>
            <Link to="/app/settings" className={`nav-link ${location.pathname === '/app/settings' ? 'active' : ''}`}>
              Settings
            </Link>
          </nav>
        </div>
      </header>
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}
