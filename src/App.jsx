import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Feed from './pages/Feed';
import NewDecision from './pages/NewDecision';
import DecisionDetail from './pages/DecisionDetail';
import DecidedOutcome from './pages/DecidedOutcome';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Onboarding, { hasCompletedOnboarding } from './components/Onboarding';
import './styles/global.css';
import './styles/forms.css';

/** Applies page-out animation to old page, then page-in to new page */
function PageTransition({ children }) {
  const location = useLocation();
  const prevPath = useRef(location.pathname);
  const [phase, setPhase] = useState('idle'); // idle | exiting | entering
  const [displayLocation, setDisplayLocation] = useState(location);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      setPhase('exiting');
      prevPathRef.current = location.pathname;

      const exitTimer = setTimeout(() => {
        setDisplayLocation(location);
        setPhase('entering');

        const enterTimer = setTimeout(() => {
          setPhase('idle');
        }, 300);

        return () => clearTimeout(enterTimer);
      }, 150);

      return () => clearTimeout(exitTimer);
    }
  }, [location]);

  const animClass =
    phase === 'exiting' ? 'page-exiting'
    : phase === 'entering' ? 'page-entering'
    : '';

  return (
    <div
      key={displayLocation.pathname}
      className={`page-wrapper ${animClass}`}
    >
      {children}
    </div>
  );
}

function AppShell() {
  const [showOnboarding, setShowOnboarding] = useState(!hasCompletedOnboarding());

  function handleOnboardingComplete() {
    setShowOnboarding(false);
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <BrowserRouter>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/app" element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path="decisions/new" element={<NewDecision />} />
            <Route path="decisions/:id" element={<DecisionDetail />} />
            <Route path="decisions/:id/decided" element={<DecidedOutcome />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  );
}

export default function App() {
  return <AppShell />;
}
