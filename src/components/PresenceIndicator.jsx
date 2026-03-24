import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getPresence, setPresence } from '../utils/storage';
import './PresenceIndicator.css';

const AVATAR_COLORS = ['#5b8def', '#30a46c', '#f5a623', '#e5484d', '#9b5de5', '#00d4aa'];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function PresenceAvatar({ name, size = 24, isYou = false }) {
  const initial = name ? name[0].toUpperCase() : '?';
  return (
    <div
      className={`presence-avatar ${isYou ? 'presence-avatar-you' : ''}`}
      style={{
        width: size,
        height: size,
        background: getAvatarColor(name),
        fontSize: size * 0.45,
      }}
      title={isYou ? `${name} (you)` : name}
    >
      {initial}
    </div>
  );
}

export default function PresenceIndicator({ decisionId, currentUser = 'You' }) {
  const [viewers, setViewers] = useState([]);
  const intervalRef = useRef(null);

  const refresh = useCallback(() => {
    const present = getPresence(decisionId);
    // Filter out yourself from the "others viewing" list
    const others = present.filter(v => v.name !== currentUser);
    setViewers(others);
  }, [decisionId, currentUser]);

  useEffect(() => {
    // Register presence
    const userId = `user_${Date.now()}`;
    setPresence(decisionId, userId, currentUser);

    // Refresh presence every 30 seconds
    intervalRef.current = setInterval(refresh, 30000);

    // Also refresh immediately and on window focus
    refresh();
    const handleFocus = () => {
      setPresence(decisionId, userId, currentUser);
      refresh();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener('focus', handleFocus);
    };
  }, [decisionId, currentUser, refresh]);

  if (viewers.length === 0) {
    return (
      <div className="presence-indicator">
        <div className="presence-status">
          <div className="presence-dot" />
          <span className="presence-text">Only you are viewing</span>
        </div>
      </div>
    );
  }

  const displayViewers = viewers.slice(0, 3);
  const overflow = viewers.length - 3;

  return (
    <div className="presence-indicator">
      <div className="presence-avatars">
        <div className="presence-avatar presence-avatar-you-wrapper" title={`${currentUser} (you)`}>
          <PresenceAvatar name={currentUser} size={24} isYou />
        </div>
        {displayViewers.map((v, idx) => (
          <div
            key={v.id || idx}
            className="presence-avatar-wrapper"
            style={{ zIndex: displayViewers.length - idx }}
          >
            <PresenceAvatar name={v.name} size={24} />
          </div>
        ))}
        {overflow > 0 && (
          <div className="presence-overflow">+{overflow}</div>
        )}
      </div>
      <div className="presence-info">
        <span className="presence-count">
          {viewers.length} other{viewers.length !== 1 ? 's' : ''} viewing
        </span>
        <span className="presence-names">
          {displayViewers.map(v => v.name).join(', ')}
          {overflow > 0 ? ` +${overflow}` : ''}
        </span>
      </div>
    </div>
  );
}
