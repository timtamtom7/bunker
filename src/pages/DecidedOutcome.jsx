import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDecisions } from '../hooks/useDecisions';
import Button from '../components/Button';
import './DecidedOutcome.css';

export default function DecidedOutcome() {
  const { id } = useParams();
  const { get, update } = useDecisions();
  const navigate = useNavigate();
  const decision = get(id);

  const [chosenOption, setChosenOption] = useState(
    decision?.chosenOption !== null && decision?.chosenOption !== undefined
      ? decision.chosenOption
      : ''
  );
  const [decisionWhy, setDecisionWhy] = useState(decision?.decisionWhy || '');
  const [wouldChooseAgain, setWouldChooseAgain] = useState(
    decision?.wouldChooseAgain !== null && decision?.wouldChooseAgain !== undefined
      ? decision.wouldChooseAgain
      : ''
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  if (!decision) {
    return (
      <div className="page outcome-page">
        <div className="outcome-not-found">
          <h2>Decision not found</h2>
          <Link to="/app"><Button>Back to Decisions</Button></Link>
        </div>
      </div>
    );
  }

  function validate() {
    const errs = {};
    if (chosenOption === '' || chosenOption === null) errs.option = 'Select the option you chose.';
    if (wouldChooseAgain === '' || wouldChooseAgain === null) errs.again = 'Answer the reflection question.';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    update({
      ...decision,
      status: 'decided',
      chosenOption: Number(chosenOption),
      decisionWhy: decisionWhy.trim() || null,
      wouldChooseAgain: wouldChooseAgain === true || wouldChooseAgain === 'true',
      decidedAt: decision.decidedAt || new Date().toISOString(),
    });
    navigate(`/app/decisions/${id}`);
  }

  const opts = decision.options || [];

  return (
    <div className="page outcome-page">
      <div className="workspace-header">
        <button className="back-btn btn-ghost" onClick={() => navigate(`/app/decisions/${id}`)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>

      <div className="outcome-intro">
        <h1 className="outcome-title">What did you decide?</h1>
        <p className="outcome-subtitle">
          <strong>{decision.title}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="outcome-form" noValidate>
        {/* Which option */}
        <div className="field">
          <label className="label">Which option did you choose?</label>
          {opts.length === 0 ? (
            <p className="field-hint">No options were recorded for this decision.</p>
          ) : (
            <div className="radio-group">
              {opts.map((opt, idx) => (
                <label
                  key={idx}
                  className={`radio-option ${Number(chosenOption) === idx ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="chosen-option"
                    value={idx}
                    checked={Number(chosenOption) === idx}
                    onChange={() => setChosenOption(idx)}
                    style={{ display: 'none' }}
                  />
                  <div className="radio-dot" />
                  <div className="radio-text">
                    <div className="radio-title">{opt.name}</div>
                    {opt.sixMonths && (
                      <div className="radio-desc">{opt.sixMonths.slice(0, 80)}{opt.sixMonths.length > 80 ? '…' : ''}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
          {errors.option && <span className="field-error">{errors.option}</span>}
        </div>

        {/* Why */}
        <div className="field">
          <label className="label" htmlFor="decision-why">Why did you make this choice?</label>
          <textarea
            id="decision-why"
            className="textarea"
            placeholder="In 2 sentences: what made this the right call for you?"
            value={decisionWhy}
            onChange={e => setDecisionWhy(e.target.value)}
            rows={3}
          />
          <span className="field-hint">Optional, but worth writing down.</span>
        </div>

        {/* Would choose again */}
        <div className="field">
          <label className="label">Would you make the same decision again?</label>
          {errors.again && <span className="field-error">{errors.again}</span>}
          <div className="radio-group" style={{ flexDirection: 'row' }}>
            {[true, false].map(val => (
              <label
                key={String(val)}
                className={`radio-option ${wouldChooseAgain === val ? 'selected' : ''}`}
                style={{ flex: 1 }}
              >
                <input
                  type="radio"
                  name="would-again"
                  value={String(val)}
                  checked={wouldChooseAgain === val}
                  onChange={() => setWouldChooseAgain(val)}
                  style={{ display: 'none' }}
                />
                <div className="radio-dot" />
                <div className="radio-text">
                  <div className="radio-title">{val ? 'Yes, absolutely' : 'Not sure / would reconsider'}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="ghost" onClick={() => navigate(`/app/decisions/${id}`)}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Record Decision
          </Button>
        </div>
      </form>
    </div>
  );
}
