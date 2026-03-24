import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getComments, addComment, deleteComment } from '../utils/storage';
import Button from './Button';
import './CommentsThread.css';

const AVATAR_COLORS = ['#5b8def', '#30a46c', '#f5a623', '#e5484d', '#9b5de5', '#00d4aa'];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function CommentAvatar({ name }) {
  const initial = name ? name[0].toUpperCase() : '?';
  return (
    <div
      className="comment-avatar"
      style={{ background: getAvatarColor(name) }}
      title={name}
    >
      {initial}
    </div>
  );
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function CommentsThread({ decisionId, options, currentUser = 'You' }) {
  const [comments, setComments] = useState([]);
  const [showAddForOption, setShowAddForOption] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [filterOption, setFilterOption] = useState('all');
  const textareaRef = useRef(null);

  const load = useCallback(() => {
    const loaded = getComments(decisionId);
    setComments(loaded);
  }, [decisionId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (showAddForOption !== null && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [showAddForOption]);

  const filteredComments = filterOption === 'all'
    ? comments
    : comments.filter(c => c.optionIdx === filterOption);

  const commentsPerOption = options
    ? options.map((_, idx) => comments.filter(c => c.optionIdx === idx).length)
    : [];

  function handleSubmit(e, optionIdx) {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = addComment(decisionId, {
      text: newComment.trim(),
      optionIdx,
      author: currentUser,
    });
    setComments(prev => [...prev, comment]);
    setNewComment('');
    setShowAddForOption(null);
  }

  function handleDelete(commentId) {
    deleteComment(decisionId, commentId);
    setComments(prev => prev.filter(c => c.id !== commentId));
  }

  const activeOptionComments = showAddForOption !== null
    ? comments.filter(c => c.optionIdx === showAddForOption)
    : [];

  return (
    <div className="comments-thread">
      <div className="comments-header">
        <div className="comments-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Comments</span>
          <span className="comments-count">{comments.length}</span>
        </div>
        <div className="comments-filter">
          <button
            className={`comment-filter-btn ${filterOption === 'all' ? 'active' : ''}`}
            onClick={() => setFilterOption('all')}
          >
            All
          </button>
          {options && options.map((opt, idx) => (
            <button
              key={idx}
              className={`comment-filter-btn ${filterOption === idx ? 'active' : ''} ${commentsPerOption[idx] > 0 ? 'has-comments' : ''}`}
              onClick={() => setFilterOption(idx === filterOption ? 'all' : idx)}
              title={`${opt.name || 'Option ' + (idx + 1)}: ${commentsPerOption[idx]} comment${commentsPerOption[idx] !== 1 ? 's' : ''}`}
            >
              {commentsPerOption[idx] > 0 && (
                <span className="comment-filter-dot" />
              )}
              {opt.name ? opt.name.substring(0, 10) : `Opt ${idx + 1}`}
            </button>
          ))}
        </div>
      </div>

      {filteredComments.length === 0 && (
        <div className="comments-empty">
          No comments yet. Add thoughts on specific options below.
        </div>
      )}

      {filteredComments.length > 0 && (
        <div className="comments-list">
          {filteredComments.map(comment => (
            <div key={comment.id} className="comment-item">
              <CommentAvatar name={comment.author} />
              <div className="comment-body">
                <div className="comment-meta">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-time">{timeAgo(comment.createdAt)}</span>
                  {comment.optionIdx != null && options && (
                    <span className="comment-option-tag">
                      {options[comment.optionIdx]?.name || `Option ${comment.optionIdx + 1}`}
                    </span>
                  )}
                  {comment.author === currentUser && (
                    <button
                      className="comment-delete"
                      onClick={() => handleDelete(comment.id)}
                      title="Delete comment"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForOption !== null && (
        <div className="comment-compose-area">
          <div className="comment-compose-header">
            <CommentAvatar name={currentUser} />
            <span className="comment-compose-label">
              Commenting on <strong>{options?.[showAddForOption]?.name || `Option ${showAddForOption + 1}`}</strong>
            </span>
          </div>
          <form
            className="comment-compose-form"
            onSubmit={(e) => handleSubmit(e, showAddForOption)}
          >
            <textarea
              ref={textareaRef}
              className="textarea comment-textarea"
              placeholder="Share your thoughts on this option…"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={3}
            />
            <div className="comment-compose-actions">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => { setShowAddForOption(null); setNewComment(''); }}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>
          </form>
          {activeOptionComments.length > 0 && (
            <div className="comment-compose-preview">
              <span className="comment-preview-label">Other comments on this option:</span>
              {activeOptionComments.slice(-2).map(c => (
                <div key={c.id} className="comment-preview-item">
                  <CommentAvatar name={c.author} />
                  <span className="comment-preview-text">{c.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showAddForOption === null && (
        <div className="comments-add-btns">
          {options && options.map((opt, idx) => (
            <button
              key={idx}
              className="comment-add-btn"
              onClick={() => setShowAddForOption(idx)}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {opt.name ? `${opt.name.substring(0, 12)}${opt.name.length > 12 ? '…' : ''}` : `Option ${idx + 1}`}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
