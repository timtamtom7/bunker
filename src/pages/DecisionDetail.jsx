import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDecisions } from '../hooks/useDecisions';
import Button from '../components/Button';
import { deadlineLabel, deadlineStatus, toDateInputValue } from '../utils/helpers';
import './DecisionWorkspace.css';

const EMPTY_OPTION = { name: '', sixMonths: '', worst: '', best: '' };

export default function DecisionDetail() {
  const { id } = useParams();
  const { get, update, remove } = useDecisions();
  const navigate = useNavigate();
  const decision = get(id);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Editable fields
  const [title, setTitle] = useState(decision?.title || '');
  const [status, setStatus] = useState(decision?.status || 'active');
  const [problem, setProblem] = useState(decision?.problem || '');
  const [options, setOptions] = useState(decision?.options || [{ ...EMPTY_OPTION }]);
  const [tradeoffs, setTradeoffs] = useState(decision?.tradeoffs || '');
  const [deadline, setDeadline] = useState(toDateInputValue(decision?.deadline || ''));
  const [regretAnswer, setRegretAnswer] = useState(decision?.regretAnswer || '');

  if (!decision) {
    return (
      <div className="page workspace-page">
        <div className="workspace-not-found">
          <h2>Decision not found</h2>
          <p>This decision may have been deleted.</p>
          <Link to="/app"><Button>Back to Decisions</Button></Link>
        </div>
      </div>
    );
  }

  function validate() {
    if (!title.trim()) return false;
    if (!problem.trim()) return false;
    return true;
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    update({
      id: decision.id,
      title: title.trim(),
      status,
      problem: problem.trim(),
      options: options.filter(o => o.name.trim()),
      tradeoffs: tradeoffs.trim(),
      deadline: deadline || null,
      regretAnswer: regretAnswer.trim() || null,
    });
    setEditing(false);
    setSaving(false);
  }

  async function handleDelete() {
    setDeleting(true);
    remove(decision.id);
    navigate('/app');
  }

  function updateOption(idx, field, value) {
    setOptions(opts => opts.map((o, i) => i === idx ? { ...o, [field]: value } : o));
  }

  function addOption() {
    if (options.length < 4) setOptions(opts => [...opts, { ...EMPTY_OPTION }]);
  }

  function removeOption(idx) {
    if (options.length > 1) setOptions(opts => opts.filter((_, i) => i !== idx));
  }

  const dlStatus = deadlineStatus(decision.deadline);
  const dlLabel = deadlineLabel(decision.deadline);
  const isDecided = decision.status === 'decided';
  const canRecordOutcome = isDecided && !decision.chosenOption && !decision.decidedAt;

  return (
    <div className="page workspace-page">
      <div className="workspace-header">
        <button className="back-btn btn-ghost" onClick={() => navigate('/app')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <div className="workspace-header-actions">
          {!editing && (
            <>
              {isDecided ? (
                <Link to={`/app/decisions/${id}/decided`}>
                  <Button variant="secondary" size="sm">View Outcome</Button>
                </Link>
              ) : (
                <Link to={`/app/decisions/${id}/decided`}>
                  <Button size="sm">Record Decision</Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Button>
            </>
          )}
          {editing && (
            <>
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancel</Button>
              <Button size="sm" loading={saving} onClick={handleSave}>Save</Button>
            </>
          )}
        </div>
      </div>

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm card-glass">
            <h3>Delete this decision?</h3>
            <p>This action cannot be undone.</p>
            <div className="delete-confirm-actions">
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
              <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Deadline banner */}
      {!editing && decision.deadline && decision.status !== 'decided' && (
        <div className={`deadline-banner ${dlStatus === 'overdue' || dlStatus === 'today' ? 'deadline-banner-urgent' : ''}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
            <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Deadline: {dlLabel}
        </div>
      )}

      <div className="workspace-title-row">
        <h1 className="workspace-title">{decision.title}</h1>
        <div className="workspace-badges">
          <span className={`badge ${isDecided ? 'badge-decided' : 'badge-active'}`}>
            {isDecided ? 'Decided' : 'Active'}
          </span>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="workspace-form" noValidate>
          {/* Status */}
          <div className="field">
            <label className="label">Status</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {['active', 'decided'].map(s => (
                <label key={s} className={`radio-option ${status === s ? 'selected' : ''}`} style={{ flex: 1 }}>
                  <input type="radio" name="edit-status" value={s} checked={status === s} onChange={() => setStatus(s)} style={{ display: 'none' }} />
                  <div className="radio-dot" />
                  <div className="radio-text">
                    <div className="radio-title">{s === 'active' ? 'Active' : 'Decided'}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="field">
            <label className="label" htmlFor="edit-title">The Decision</label>
            <input id="edit-title" type="text" className="input" value={title} onChange={e => setTitle(e.target.value)} maxLength={200} />
          </div>

          {/* Problem */}
          <div className="field">
            <label className="label" htmlFor="edit-problem">The Problem</label>
            <textarea id="edit-problem" className="textarea" value={problem} onChange={e => setProblem(e.target.value)} rows={4} />
          </div>

          {/* Options */}
          <div className="field">
            <label className="label">Options</label>
            <div className="options-list">
              {options.map((opt, idx) => (
                <div key={idx} className="option-block">
                  <div className="option-block-header">
                    <span className="option-number">Option {idx + 1}</span>
                    {options.length > 1 && (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeOption(idx)}>Remove</button>
                    )}
                  </div>
                  <div className="option-block-fields">
                    <div className="field">
                      <label className="label-sm">Name</label>
                      <input type="text" className="input" value={opt.name} onChange={e => updateOption(idx, 'name', e.target.value)} maxLength={100} />
                    </div>
                    <div className="field">
                      <label className="label-sm">6 months / 2 years</label>
                      <textarea className="textarea textarea-sm" value={opt.sixMonths} onChange={e => updateOption(idx, 'sixMonths', e.target.value)} rows={2} />
                    </div>
                    <div className="field">
                      <label className="label-sm">Worst thing</label>
                      <textarea className="textarea textarea-sm" value={opt.worst} onChange={e => updateOption(idx, 'worst', e.target.value)} rows={2} />
                    </div>
                    <div className="field">
                      <label className="label-sm">Best case</label>
                      <textarea className="textarea textarea-sm" value={opt.best} onChange={e => updateOption(idx, 'best', e.target.value)} rows={2} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {options.length < 4 && (
              <button type="button" className="btn btn-ghost btn-sm add-option-btn" onClick={addOption}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                Add option
              </button>
            )}
          </div>

          {/* Tradeoffs */}
          <div className="field">
            <label className="label" htmlFor="edit-tradeoffs">Tradeoffs</label>
            <textarea id="edit-tradeoffs" className="textarea" value={tradeoffs} onChange={e => setTradeoffs(e.target.value)} rows={3} />
          </div>

          {/* Deadline */}
          <div className="field">
            <label className="label" htmlFor="edit-deadline">Deadline</label>
            <input id="edit-deadline" type="date" className="input" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>

          {/* Regret */}
          <div className="field">
            <label className="label" htmlFor="edit-regret">Regret Check</label>
            <textarea id="edit-regret" className="textarea" value={regretAnswer} onChange={e => setRegretAnswer(e.target.value)} rows={3} />
          </div>

          <div className="form-actions">
            <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Save Changes</Button>
          </div>
        </form>
      ) : (
        <div className="workspace-view stagger-in">
          <WorkspaceSection title="The Problem" mono>
            {decision.problem || <span className="empty-field">Not specified</span>}
          </WorkspaceSection>

          <WorkspaceSection title={`Options (${decision.options?.length || 0})`} mono>
            {(!decision.options || decision.options.length === 0) ? (
              <span className="empty-field">No options added</span>
            ) : (
              <div className="view-options">
                {decision.options.map((opt, idx) => (
                  <div key={idx} className="view-option card-glass">
                    <div className="view-option-name">{opt.name}</div>
                    {opt.sixMonths && (
                      <div className="view-option-row">
                        <span className="view-option-label">6 months / 2 years</span>
                        <span className="view-option-value">{opt.sixMonths}</span>
                      </div>
                    )}
                    {opt.worst && (
                      <div className="view-option-row">
                        <span className="view-option-label">Worst case</span>
                        <span className="view-option-value">{opt.worst}</span>
                      </div>
                    )}
                    {opt.best && (
                      <div className="view-option-row">
                        <span className="view-option-label">Best case</span>
                        <span className="view-option-value">{opt.best}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </WorkspaceSection>

          {decision.tradeoffs && (
            <WorkspaceSection title="Tradeoffs" mono>
              {decision.tradeoffs}
            </WorkspaceSection>
          )}

          {decision.deadline && (
            <WorkspaceSection title="Deadline" mono>
              <span className={`deadline-text deadline-${dlStatus}`}>
                {new Date(decision.deadline).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                {' — '}{dlLabel}
              </span>
            </WorkspaceSection>
          )}

          {decision.regretAnswer && (
            <WorkspaceSection title="Regret Check" mono>
              {decision.regretAnswer}
            </WorkspaceSection>
          )}

          {isDecided && decision.chosenOption !== null && decision.options?.[decision.chosenOption] && (
            <WorkspaceSection title="Decision Made" mono>
              <div className="decided-outcome-box">
                <div className="decided-chosen">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Chose: <strong>{decision.options[decision.chosenOption].name}</strong>
                </div>
                {decision.decisionWhy && (
                  <p className="decided-why">{decision.decisionWhy}</p>
                )}
                {decision.wouldChooseAgain !== null && (
                  <p className="decided-again">
                    Would choose again: <strong>{decision.wouldChooseAgain ? 'Yes' : 'No'}</strong>
                  </p>
                )}
              </div>
            </WorkspaceSection>
          )}
        </div>
      )}
    </div>
  );
}

function WorkspaceSection({ title, children, mono }) {
  return (
    <div className="ws-section">
      <div className="ws-section-label label">{title}</div>
      <div className={`ws-section-content ${mono ? 'ws-section-mono' : ''}`}>{children}</div>
    </div>
  );
}
