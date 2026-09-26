import React, { useState } from 'react';

export default function FlashcardDeck({ flashcards = [], onBackToOverview }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const total = flashcards.length;
  const current = flashcards[currentCard] || { question: '', answer: '' };
  const progressPercent = total > 0 ? ((currentCard + 1) / total) * 100 : 0;

  const handleToggleAnswer = () => {
    setShowAnswer((prev) => !prev);
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
      setShowAnswer(false);
    }
  };

  const handleNext = () => {
    if (currentCard < total - 1) {
      setCurrentCard((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="flashcards-container">
      <div className="deck-nav-bar">
        <button type="button" className="btn-back-nav" onClick={onBackToOverview}>
          <span className="nav-arrow" aria-hidden="true">←</span>
          <span>Study Session</span>
        </button>
      </div>

      <div className="deck-header-row">
        <div className="deck-badge-pill">Flashcards</div>
        <div className="deck-progress-text">
          Card <span className="deck-counter-current">{currentCard + 1}</span> of {total}
        </div>
      </div>

      {/* Progress bar */}
      <div className="sf-progress-bar" role="progressbar" aria-valuenow={currentCard + 1} aria-valuemin={1} aria-valuemax={total}>
        <div
          className="sf-progress-fill progress-fill-purple"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="card flashcard-surface">
        <div className="flashcard-status-badge">
          {showAnswer ? 'Answer' : 'Question'}
        </div>

        <div className="flashcard-main-content">
          {showAnswer ? (
            <div className="flashcard-answer-revealed">
              <div className="revealed-question-context">
                <span className="context-label">Q:</span> {current.question}
              </div>
              <div className="revealed-divider" />
              <div className="revealed-answer-text">{current.answer}</div>
            </div>
          ) : (
            <div className="flashcard-question-text">{current.question}</div>
          )}
        </div>

        <div className="flashcard-toggle-area">
          <button
            type="button"
            className="btn btn-secondary toggle-answer-btn"
            onClick={handleToggleAnswer}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flashcard-step-controls">
        <button
          type="button"
          className="btn btn-outline flashcard-nav-btn"
          onClick={handlePrevious}
          disabled={currentCard === 0}
        >
          ← Previous
        </button>
        <button
          type="button"
          className="btn btn-primary flashcard-nav-btn"
          onClick={handleNext}
          disabled={currentCard === total - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
