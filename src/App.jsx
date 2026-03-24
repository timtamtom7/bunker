import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Feed from './pages/Feed';
import NewDecision from './pages/NewDecision';
import DecisionDetail from './pages/DecisionDetail';
import DecidedOutcome from './pages/DecidedOutcome';
import Settings from './pages/Settings';
import './styles/global.css';
import './styles/forms.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Feed />} />
          <Route path="decisions/new" element={<NewDecision />} />
          <Route path="decisions/:id" element={<DecisionDetail />} />
          <Route path="decisions/:id/decided" element={<DecidedOutcome />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
