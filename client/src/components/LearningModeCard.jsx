import React from 'react';

export default function LearningModeCard({ topic, onSelectMode, onChangeTopic }) {
  return (
    <div style={{ width: '100%' }}>
      <div className="topic-banner">
        <div className="topic-banner-eyebrow">
          <span className="badge">SELECTED TOPIC</span>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onChangeTopic}
            style={{ fontSize: '0.85rem' }}
          >
            ✏️ Change Topic
          </button>
        </div>
        <h1>{topic}</h1>
        <p>Choose your preferred interactive revision format to begin learning.</p>
      </div>

      <div className="mode-selection-grid">
        <div
          className="mode-card"
          onClick={() => onSelectMode('flashcards')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectMode('flashcards')}
          id="select-flashcards-mode-card"
        >
          <div className="mode-card-icon">📚</div>
          <div>
            <h3>Interactive Flashcards</h3>
            <p style={{ marginTop: '6px' }}>
              Master key terms and definitions through active recall. Flip cards to test your memory.
            </p>
          </div>
          <div className="mode-card-action">
            Configure Flashcards <span>→</span>
          </div>
        </div>

        <div
          className="mode-card"
          onClick={() => onSelectMode('quiz')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectMode('quiz')}
          id="select-quiz-mode-card"
        >
          <div className="mode-card-icon quiz">🧠</div>
          <div>
            <h3>Interactive Quiz</h3>
            <p style={{ marginTop: '6px' }}>
              Evaluate your understanding with multiple-choice questions, instant scoring, and retesting.
            </p>
          </div>
          <div className="mode-card-action" style={{ color: 'var(--accent-cyan)' }}>
            Configure Quiz <span>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}
