import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Feed from './pages/Feed';
import Community from './pages/Community';
import NewDecision from './pages/NewDecision';
import DecisionDetail from './pages/DecisionDetail';
import DecidedOutcome from './pages/DecidedOutcome';
import History from './pages/History';
import Settings from './pages/Settings';
import Pricing from './pages/Pricing';
import Onboarding, { hasCompletedOnboarding } from './components/Onboarding';
import DecisionCoach from './components/DecisionCoach';
import { useDecisions } from './hooks/useDecisions';
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
  const [showCoach, setShowCoach] = useState(false);
  const { create } = useDecisions();

  function handleOnboardingComplete() {
    setShowOnboarding(false);
    // Show the Decision Coach after onboarding for first decision
    setShowCoach(true);
  }

  function handleCoachComplete({ title, problem, regretAnswer }) {
    setShowCoach(false);
    // Pre-fill a new decision from coach answers
    const decision = create({
      title,
      problem,
      regretAnswer,
      status: 'active',
      options: [{ name: 'Option A', sixMonths: '', worst: '', best: '' }, { name: 'Option B', sixMonths: '', worst: '', best: '' }],
    });
    window.location.href = `/app/decisions/${decision.id}`;
  }

  return (
    <>
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      {showCoach && (
        <DecisionCoach
          onComplete={handleCoachComplete}
          onSkip={() => setShowCoach(false)}
        />
      )}
      <BrowserRouter>
        <PageTransition>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/app" element={<Layout />}>
              <Route index element={<Feed />} />
              <Route path="community" element={<Community />} />
              <Route path="decisions/new" element={<NewDecision />} />
              <Route path="decisions/:id" element={<DecisionDetail />} />
              <Route path="decisions/:id/decided" element={<DecidedOutcome />} />
              <Route path="history" element={<History />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransition>
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return <AppShell />;
}
