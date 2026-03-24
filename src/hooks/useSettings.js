import { useState, useEffect, useCallback } from 'react';
import { getSettings, saveSettings } from '../utils/storage';

export function useSettings() {
  const [settings, setSettings] = useState({ theme: 'dark', checkInEnabled: true });

  useEffect(() => {
    const s = getSettings();
    setSettings(s);
    document.documentElement.setAttribute('data-theme', s.theme);
  }, []);

  const update = useCallback((updates) => {
    const newSettings = saveSettings(updates);
    setSettings(newSettings);
    if (updates.theme) {
      document.documentElement.setAttribute('data-theme', newSettings.theme);
    }
    return newSettings;
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    return update({ theme: newTheme });
  }, [settings.theme, update]);

  return { settings, update, toggleTheme };
}
