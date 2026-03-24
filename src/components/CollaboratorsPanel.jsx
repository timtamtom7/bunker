import React, { useState, useEffect, useCallback } from 'react';
import { getCollaborators, addCollaborator, removeCollaborator } from '../utils/storage';
import Button from './Button';
import './CollaboratorsPanel.css';

const AVATAR_COLORS = [
  '#5b8def', '#30a46c', '#f5a623', '#e5484d',
  '#9b5de5', '#00d4aa', '#ff7c43', '#06b6d4',
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function Avatar({ name, size = 28 }) {
  const initial = name ? name[0].toUpperCase() : '?';
  const color = getAvatarColor(name);
  return (
    <div
      className="collab-avatar"
      style={{ width: size, height: size, background: color, fontSize: size * 0.45 }}
      title={name}
    >
      {initial}
    </div>
  );
}

export default function CollaboratorsPanel({ decisionId, currentUser }) {
  const [collaborators, setCollaborators] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [adding, setAdding] = useState(false);

  const load = useCallback(() => {
    const collabs = getCollaborators(decisionId);
    setCollaborators(collabs);
  }, [decisionId]);

  useEffect(() => {
    load();
  }, [load]);

  function handleInvite(e) {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    setAdding(true);
    const collab = addCollaborator(decisionId, {
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
    });
    setCollaborators(prev => {
      const existing = prev.findIndex(c => c.email === inviteEmail);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = collab;
        return updated;
      }
      return [...prev, collab];
    });
    setInviteName('');
    setInviteEmail('');
    setShowInvite(false);
    setAdding(false);
  }

  function handleRemove(collabId) {
    removeCollaborator(decisionId, collabId);
    setCollaborators(prev => prev.filter(c => c.id !== collabId));
  }

  return (
    <div className="collab-panel">
      <div className="collab-header">
        <div className="collab-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span>Collaborators</span>
          <span className="collab-count">{collaborators.length}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowInvite(s => !s)}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Invite
        </Button>
      </div>

      {collaborators.length === 0 && !showInvite && (
        <div className="collab-empty">
          No collaborators yet. Invite someone to share this decision.
        </div>
      )}

      {collaborators.length > 0 && (
        <div className="collab-list">
          {collaborators.map(c => (
            <div key={c.id} className="collab-item">
              <Avatar name={c.name} />
              <div className="collab-info">
                <span className="collab-name">{c.name}</span>
                <span className="collab-email">{c.email}</span>
              </div>
              <span className={`collab-role role-${c.role}`}>{c.role}</span>
              <button
                className="collab-remove"
                onClick={() => handleRemove(c.id)}
                title="Remove collaborator"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {showInvite && (
        <form className="collab-invite-form" onSubmit={handleInvite}>
          <div className="collab-invite-row">
            <input
              type="text"
              className="input input-sm"
              placeholder="Name"
              value={inviteName}
              onChange={e => setInviteName(e.target.value)}
              required
            />
            <input
              type="email"
              className="input input-sm"
              placeholder="Email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              required
            />
          </div>
          <div className="collab-invite-row">
            <select
              className="input input-sm"
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
            <Button type="submit" size="sm" loading={adding}>
              Send Invite
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowInvite(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Owner/you indicator */}
      {currentUser && (
        <div className="collab-owner">
          <Avatar name={currentUser} size={24} />
          <span className="collab-owner-label">
            You are the owner · <strong>Editor</strong>
          </span>
        </div>
      )}
    </div>
  );
}
