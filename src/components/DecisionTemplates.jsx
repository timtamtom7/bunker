import React, { useState } from 'react';
import { getAllTemplates, getUserTemplates, saveUserTemplate, deleteUserTemplate } from '../utils/templates';
import Button from './Button';
import './DecisionTemplates.css';

export default function DecisionTemplates({ onSelect, onClose }) {
  const [tab, setTab] = useState('built-in');
  const [saveMode, setSaveMode] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [saving, setSaving] = useState(false);

  const builtIn = getAllTemplates().filter(t => !t.id.startsWith('user_'));
  const userTemplates = getUserTemplates();

  function handleSelect(template) {
    if (onSelect) onSelect(template);
    if (onClose) onClose();
  }

  function handleSaveCurrentAsTemplate(e) {
    e.preventDefault();
    if (!newTemplateName.trim()) return;
    setSaving(true);
    saveUserTemplate({
      id: `user_${Date.now()}`,
      name: newTemplateName.trim(),
      description: newTemplateDesc.trim() || 'Custom template',
      icon: '📋',
      prefill: {},
    });
    setNewTemplateName('');
    setNewTemplateDesc('');
    setSaveMode(false);
    setSaving(false);
    setTab('my-templates');
  }

  function handleDeleteUserTemplate(id) {
    deleteUserTemplate(id);
  }

  return (
    <div className="templates-panel">
      <div className="templates-header">
        <div className="templates-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="9" y1="21" x2="9" y2="9" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <span>Decision Templates</span>
        </div>
        {onClose && (
          <button className="templates-close" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="templates-tabs">
        <button
          className={`templates-tab ${tab === 'built-in' ? 'active' : ''}`}
          onClick={() => setTab('built-in')}
        >
          Built-in
        </button>
        <button
          className={`templates-tab ${tab === 'my-templates' ? 'active' : ''}`}
          onClick={() => setTab('my-templates')}
        >
          My Templates
          {userTemplates.length > 0 && (
            <span className="templates-tab-badge">{userTemplates.length}</span>
          )}
        </button>
      </div>

      {tab === 'built-in' && (
        <div className="templates-grid">
          {builtIn.map(template => (
            <button
              key={template.id}
              className="template-card"
              onClick={() => handleSelect(template)}
            >
              <span className="template-icon">{template.icon}</span>
              <span className="template-name">{template.name}</span>
              <span className="template-desc">{template.description}</span>
            </button>
          ))}
        </div>
      )}

      {tab === 'my-templates' && (
        <div className="templates-my">
          {userTemplates.length === 0 && !saveMode && (
            <div className="templates-empty">
              <p>No saved templates yet.</p>
              <p>Start from a built-in template or save your own.</p>
            </div>
          )}

          {userTemplates.length > 0 && (
            <div className="templates-grid">
              {userTemplates.map(template => (
                <div key={template.id} className="template-card template-card-user">
                  <div className="template-card-top">
                    <span className="template-icon">{template.icon || '📋'}</span>
                    <button
                      className="template-delete"
                      onClick={(e) => { e.stopPropagation(); handleDeleteUserTemplate(template.id); }}
                      title="Delete template"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                  <span className="template-name">{template.name}</span>
                  <span className="template-desc">{template.description}</span>
                  <button
                    className="template-use-btn"
                    onClick={() => handleSelect(template)}
                  >
                    Use this template
                  </button>
                </div>
              ))}
            </div>
          )}

          {!saveMode && (
            <button className="templates-save-trigger" onClick={() => setSaveMode(true)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Save current decision as template
            </button>
          )}

          {saveMode && (
            <form className="templates-save-form" onSubmit={handleSaveCurrentAsTemplate}>
              <input
                type="text"
                className="input input-sm"
                placeholder="Template name"
                value={newTemplateName}
                onChange={e => setNewTemplateName(e.target.value)}
                required
              />
              <input
                type="text"
                className="input input-sm"
                placeholder="Description (optional)"
                value={newTemplateDesc}
                onChange={e => setNewTemplateDesc(e.target.value)}
              />
              <div className="templates-save-actions">
                <Button type="button" variant="ghost" size="sm" onClick={() => setSaveMode(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" loading={saving}>
                  Save Template
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
