import React, { useState } from 'react';

const SUGGESTED_TOPICS = [
  'Object Oriented Programming',
  'DBMS Indexing & ACID Transactions',
  'Transformers in NLP',
  'System Design & Caching',
  'Operating Systems Concurrency',
];

export default function TopicInput({ input, setInput, onSubmitTopic, isLoading }) {
  const [validationError, setValidationError] = useState(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input || input.trim().length === 0) {
      setValidationError('Please enter a topic or paste your notes to continue.');
      return;
    }
    setValidationError(null);
    onSubmitTopic(input.trim());
  };

  const handleSelectSuggested = (topic) => {
    setInput(topic);
    setValidationError(null);
    onSubmitTopic(topic);
  };

  return (
    <div className="topic-input-card">
      <div className="topic-input-header">
        <span className="badge" style={{ marginBottom: '12px' }}>
          ✦ STUDYFLOW WORKSPACE
        </span>
        <h2>What do you want to learn?</h2>
        <p>Enter any concept, topic name, or paste your raw notes below.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="topic-textarea"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (validationError) setValidationError(null);
          }}
          placeholder="e.g. Explain Object Oriented Programming with inheritance, polymorphism, and abstraction... or paste lecture notes here"
          rows={6}
          disabled={isLoading}
          aria-label="Study topic or notes"
        />

        {validationError && (
          <div
            style={{
              color: 'var(--accent-rose)',
              fontSize: '0.9rem',
              marginTop: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        <div className="topic-input-footer">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {input.trim().length > 0 ? `${input.trim().length} characters` : 'Ready when you are'}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading || input.trim().length === 0}
            id="generate-plan-btn"
          >
            {isLoading ? 'Preparing...' : 'Continue to Study Modes →'}
          </button>
        </div>
      </form>

      <div className="topic-suggestions">
        <span className="topic-suggestions-label">Popular Topics to Try</span>
        <div className="topic-chips-group">
          {SUGGESTED_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              className="topic-chip"
              onClick={() => handleSelectSuggested(topic)}
              disabled={isLoading}
            >
              + {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
