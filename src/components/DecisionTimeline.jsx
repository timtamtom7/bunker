import React, { useMemo } from 'react';
import './DecisionTimeline.css';

export default function DecisionTimeline({ decision }) {
  const events = useMemo(() => {
    const items = [];
    if (decision.createdAt) {
      items.push({
        type: 'created',
        label: 'Decision started',
        date: new Date(decision.createdAt),
      });
    }
    if (decision.deadline) {
      items.push({
        type: 'deadline',
        label: 'Deadline set',
        date: new Date(decision.deadline),
        isDeadline: true,
      });
    }
    if (decision.decidedAt) {
      items.push({
        type: 'decided',
        label: 'Decision made',
        date: new Date(decision.decidedAt),
        isDecided: true,
      });
    }
    if (decision.reflectionAt30Days) {
      items.push({
        type: 'reflection',
        label: '30-day reflection',
        date: new Date(decision.reflectionAt30Days),
        isReflection: true,
      });
    }
    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [decision]);

  const now = new Date();
  const totalSpan = useMemo(() => {
    if (events.length < 2) return null;
    const start = events[0].date;
    const end = events[events.length - 1].date;
    return { start, end, duration: end.getTime() - start.getTime() };
  }, [events]);

  if (events.length === 0) {
    return (
      <div className="timeline-empty">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Timeline will appear once you set a deadline
      </div>
    );
  }

  return (
    <div className="decision-timeline">
      <div className="timeline-header">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>Decision Timeline</span>
      </div>
      <div className="timeline-track">
        <div className="timeline-line" />
        {events.map((event, idx) => {
          const position = totalSpan
            ? Math.max(0, Math.min(100, ((event.date.getTime() - totalSpan.start.getTime()) / totalSpan.duration) * 100))
            : idx * 33;
          return (
            <div
              key={idx}
              className={`timeline-event ${event.isDeadline ? 'event-deadline' : ''} ${event.isDecided ? 'event-decided' : ''} ${event.isReflection ? 'event-reflection' : ''}`}
              style={{ left: `${position}%` }}
              title={`${event.label}: ${event.date.toLocaleDateString()}`}
            >
              <div className="timeline-dot" />
              <div className="timeline-event-info">
                <span className="timeline-event-label">{event.label}</span>
                <span className="timeline-event-date">
                  {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          );
        })}
        {decision.status === 'active' && decision.deadline && (
          <div className="timeline-now-marker" title="Today">
            <div className="timeline-now-dot" />
            <span className="timeline-now-label">Today</span>
          </div>
        )}
      </div>
    </div>
  );
}
