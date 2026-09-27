import React, { useState } from 'react';

export default function RelatedTopics({ title, summary, relatedTopics = [], onSelectRelatedTopic, onNewTopic }) {
  const [customInput, setCustomInput] = useState('');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customInput.trim().length > 0) {
      onNewTopic(customInput.trim());
    }
  };

  return (
    <div className="continue-learning-section">
      <div className="continue-header">
        <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>
          SESSION COMPLETE
        </span>
        <h2>You've completed your study session!</h2>
        <p style={{ marginTop: '8px' }}>
          Great job revising <strong>{title}</strong>. {summary}
        </p>
      </div>

      {/* Structured Related Topic Suggestions */}
      {relatedTopics && relatedTopics.length > 0 && (
        <div style={{ marginTop: '28px' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: '12px' }}>
            Recommended Next Topics to Explore
          </h3>
          <div className="topic-chips-group">
            {relatedTopics.map((topic, idx) => (
              <button
                key={idx}
                className="topic-chip"
                onClick={() => onSelectRelatedTopic(topic)}
                style={{
                  padding: '10px 18px',
                  fontSize: '0.95rem',
                  borderColor: 'rgba(99, 102, 241, 0.3)',
                }}
              >
                ✨ {topic} →
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Start New Custom Topic */}
      <div style={{ marginTop: '36px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--text-white)', marginBottom: '12px' }}>
          Or Explore Another Topic
        </h3>
        <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="custom-count-input"
            style={{ flex: 1, minWidth: '240px' }}
            placeholder="Type any new topic or question..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={customInput.trim().length === 0}
          >
            Start Learning →
          </button>
        </form>
      </div>
    </div>
  );
}
