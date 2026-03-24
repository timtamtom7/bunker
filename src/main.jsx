import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Apply saved theme before first paint to avoid flash
try {
  const raw = localStorage.getItem('bunker_data');
  if (raw) {
    const data = JSON.parse(raw);
    if (data.settings?.theme) {
      document.documentElement.setAttribute('data-theme', data.settings.theme);
    }
  }
} catch {}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
