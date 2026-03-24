import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDecisions } from '../hooks/useDecisions';
import { useSubscription } from '../hooks/useSubscription';
import Button from '../components/Button';
import { toDateInputValue } from '../utils/helpers';
import './DecisionWorkspace.css';

const EMPTY_OPTION = { name: '', sixMonths: '', worst: '', best: '' };

export default function NewDecision() {
  const { create } = useDecisions();
  const { isFree, canAdd, activeCount, limit } = useSubscription();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('active');
  const [problem, setProblem] = useState('');
  const [options, setOptions] = useState([{ ...EMPTY_OPTION }, { ...EMPTY_OPTION }]);
  const [tradeoffs, setTradeoffs] = useState('');
  const [deadline, setDeadline] = useState('');
  const [regretAnswer, setRegretAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Free users at limit can't create new decisions
  if (isFree && !canAdd) {
    return (
      <div className="page workspace-page">
        <div className="workspace-header">
          <button className="back-btn btn-ghost" onClick={() => navigate('/app')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>
        </div>
        <div className="workspace-limit-block">
          <div className="workspace-limit-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5"/>
              <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
          <h2 className="workspace-limit-title">Decision limit reached</h2>
          <p className="workspace-limit-desc">
            Your Free plan allows {limit} active decisions.
            You've reached that limit with {activeCount} decisions.
          </p>
          <p className="workspace-limit-desc">
            Mark one of your existing decisions as decided, or{' '}
            <Link to="/pricing" style={{ color: 'var(--color-accent)' }}>upgrade to Pro</Link>{' '}
            for unlimited decisions.
          </p>
          <div className="workspace-limit-actions">
            <Button variant="secondary" onClick={() => navigate('/app')}>
              View my decisions
            </Button>
            <Link to="/pricing">
              <Button>Upgrade to Pro</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function validate() {
    const errs = {};
    if (!title.trim()) errs.title = 'State the decision you\'re facing.';
    if (!problem.trim()) errs.problem = 'Describe the problem driving this decision.';
    const validOpts = options.filter(o => o.name.trim());
    if (validOpts.length < 2) errs.options = 'Add at least 2 options.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const decision = {
      title: title.trim(),
      status,
      problem: problem.trim(),
      options: options.filter(o => o.name.trim()),
      tradeoffs: tradeoffs.trim(),
      deadline: deadline || null,
      regretAnswer: regretAnswer.trim() || null,
      decidedAt: null,
      chosenOption: null,
      decisionWhy: null,
      wouldChooseAgain: null,
      reflectionAt30Days: null,
    };
    const saved = create(decision);
    navigate(`/app/decisions/${saved.id}`);
  }

  function updateOption(idx, field, value) {
    setOptions(opts => opts.map((o, i) => i === idx ? { ...o, [field]: value } : o));
  }

  function addOption() {
    if (options.length < 4) setOptions(opts => [...opts, { ...EMPTY_OPTION }]);
  }

  function removeOption(idx) {
    if (options.length > 2) setOptions(opts => opts.filter((_, i) => i !== idx));
  }

  return (
    <div className="page workspace-page">
      <div className="workspace-header">
        <button className="back-btn btn-ghost" onClick={() => navigate('/app')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1 className="workspace-title">New Decision</h1>
      </div>

      <form onSubmit={handleSubmit} className="workspace-form" noValidate>
        {/* Status toggle */}
        <div className="field">
          <label className="label">Status</label>
          <div className="radio-group" style={{ flexDirection: 'row', gap: 'var(--space-3)' }}>
            <label className={`radio-option ${status === 'active' ? 'selected' : ''}`} style={{ flex: 1 }}>
              <input
                type="radio"
                name="status"
                value="active"
                checked={status === 'active'}
                onChange={() => setStatus('active')}
                style={{ display: 'none' }}
              />
              <div className="radio-dot" />
              <div className="radio-text">
                <div className="radio-title">Active</div>
                <div className="radio-desc">Still deciding</div>
              </div>
            </label>
            <label className={`radio-option ${status === 'decided' ? 'selected' : ''}`} style={{ flex: 1 }}>
              <input
                type="radio"
                name="status"
                value="decided"
                checked={status === 'decided'}
                onChange={() => setStatus('decided')}
                style={{ display: 'none' }}
              />
              <div className="radio-dot" />
              <div className="radio-text">
                <div className="radio-title">Decided</div>
                <div className="radio-desc">Already made this call</div>
              </div>
            </label>
          </div>
        </div>

        {/* A. The Decision */}
        <div className="field">
          <label className="label" htmlFor="title">The Decision</label>
          <input
            id="title"
            type="text"
            className={`input ${errors.title ? 'input-error' : ''}`}
            placeholder="Accept the job offer at Stripe or stay at the startup?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={200}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
          <span className="field-hint">One sentence. The actual decision, stated plainly.</span>
        </div>

        {/* B. The Problem */}
        <div className="field">
          <label className="label" htmlFor="problem">The Problem</label>
          <textarea
            id="problem"
            className={`textarea ${errors.problem ? 'input-error' : ''}`}
            placeholder="Why does this matter? What happens if you don't make this decision? What's driving this choice?"
            value={problem}
            onChange={e => setProblem(e.target.value)}
            rows={4}
          />
          {errors.problem && <span className="field-error">{errors.problem}</span>}
          <span className="field-hint">2–4 sentences. Be honest about what's actually at stake.</span>
        </div>

        {/* C. Options */}
        <div className="field">
          <label className="label">Options</label>
          {errors.options && <span className="field-error" style={{ marginBottom: '8px' }}>{errors.options}</span>}
          <div className="options-list">
            {options.map((opt, idx) => (
              <div key={idx} className="option-block">
                <div className="option-block-header">
                  <span className="option-number">Option {idx + 1}</span>
                  {options.length > 2 && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => removeOption(idx)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="option-block-fields">
                  <div className="field">
                    <label className="label-sm" htmlFor={`opt-name-${idx}`}>Name this option</label>
                    <input
                      id={`opt-name-${idx}`}
                      type="text"
                      className="input"
                      placeholder="e.g. Accept the offer"
                      value={opt.name}
                      onChange={e => updateOption(idx, 'name', e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div className="field">
                    <label className="label-sm" htmlFor={`opt-6m-${idx}`}>What does this look like in 6 months? 2 years?</label>
                    <textarea
                      id={`opt-6m-${idx}`}
                      className="textarea textarea-sm"
                      placeholder="Paint the picture of this path…"
                      value={opt.sixMonths}
                      onChange={e => updateOption(idx, 'sixMonths', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="field">
                    <label className="label-sm" htmlFor={`opt-worst-${idx}`}>What's the worst thing about this?</label>
                    <textarea
                      id={`opt-worst-${idx}`}
                      className="textarea textarea-sm"
                      placeholder="Be honest about the downside…"
                      value={opt.worst}
                      onChange={e => updateOption(idx, 'worst', e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="field">
                    <label className="label-sm" htmlFor={`opt-best-${idx}`}>What's the best-case scenario?</label>
                    <textarea
                      id={`opt-best-${idx}`}
                      className="textarea textarea-sm"
                      placeholder="What's possible if everything goes right?"
                      value={opt.best}
                      onChange={e => updateOption(idx, 'best', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {options.length < 4 && (
            <button type="button" className="btn btn-ghost btn-sm add-option-btn" onClick={addOption}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add option
            </button>
          )}
        </div>

        {/* D. Tradeoffs */}
        <div className="field">
          <label className="label" htmlFor="tradeoffs">Tradeoffs</label>
          <textarea
            id="tradeoffs"
            className="textarea"
            placeholder="What are you giving up with each option? What does choosing one cost you?"
            value={tradeoffs}
            onChange={e => setTradeoffs(e.target.value)}
            rows={3}
          />
          <span className="field-hint">What does choosing each option cost you?</span>
        </div>

        {/* E. Timeline */}
        <div className="field">
          <label className="label" htmlFor="deadline">Decision Deadline</label>
          <input
            id="deadline"
            type="date"
            className="input"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <span className="field-hint">Pick a date. Urgency clarifies thinking.</span>
        </div>

        {/* F. Regret Check */}
        <div className="field">
          <label className="label" htmlFor="regret">Regret Check</label>
          <textarea
            id="regret"
            className="textarea"
            placeholder="Which would you regret more: doing X and it going wrong, or NOT doing X and never knowing?"
            value={regretAnswer}
            onChange={e => setRegretAnswer(e.target.value)}
            rows={3}
          />
          <span className="field-hint">This surfaces what actually matters to you.</span>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={() => navigate('/app')}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Save Decision
          </Button>
        </div>
      </form>
    </div>
  );
}
