import React from 'react';

export default function FriendlyErrorState({ message, topic, onRetry, onEditTopic }) {
  return (
    <div className="friendly-error-card" role="alert">
      <div className="friendly-error-icon">✨</div>
      <h3>One small pause</h3>
      <p>
        {message ||
          'Our study assistant is taking a brief moment. Please try again — your notes and topic are safely preserved.'}
      </p>

      {topic && (
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px', textAlign: 'left' }}>
            Saved topic:
          </div>
          <div className="preserved-input-box">
            {topic}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={onRetry} id="error-retry-btn">
          🔄 Try Again
        </button>
        {onEditTopic && (
          <button className="btn btn-secondary" onClick={onEditTopic}>
            ✏️ Edit Topic
          </button>
        )}
      </div>

      <div style={{ marginTop: '18px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        Thanks for your patience 💙
      </div>
    </div>
  );
}
