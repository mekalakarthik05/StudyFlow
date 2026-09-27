import React, { useState, useEffect, useCallback } from 'react';

export default function FlashcardDeck({ title, flashcards, onFinish, onSwitchToQuiz, onBackToWorkspace }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const total = flashcards?.length || 0;
  const currentCard = flashcards[currentIndex];

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, total]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isComplete) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, isComplete]);

  if (!flashcards || flashcards.length === 0) {
    return null;
  }

  if (isComplete) {
    return (
      <div className="quiz-result-card">
        <div className="result-score-circle" style={{ borderColor: 'var(--accent-emerald)' }}>
          <span className="score-number">🎉</span>
          <span className="score-percent" style={{ color: '#6EE7B7' }}>Complete</span>
        </div>
        <h2 className="result-heading">Flashcard Revision Complete!</h2>
        <p className="result-message">
          You've reviewed all {total} flashcards for <strong>{title}</strong>.
        </p>

        <div className="result-actions">
          <button className="btn btn-secondary" onClick={handleRestart}>
            🔄 Revise Again
          </button>
          <button className="btn btn-primary" onClick={onSwitchToQuiz}>
            🧠 Test with Quiz →
          </button>
          <button className="btn btn-ghost" onClick={onFinish}>
            Continue Exploring Related Topics →
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="flashcard-session-container">
      {/* Session Progress Header */}
      <div className="session-progress-header">
        <div className="session-meta-row">
          <div>
            <span className="badge" style={{ marginRight: '8px' }}>FLASHCARDS</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{title}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 600 }}>
            {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>

        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* 3D Flip Card */}
      <div
        className="flashcard-stage"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label={`Flashcard ${currentIndex + 1} of ${total}. Click or press space to flip.`}
      >
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front Face (Question) */}
          <div className="flashcard-face front">
            <div className="flashcard-tag">Question</div>
            <div className="flashcard-text">{currentCard.question}</div>
            <div className="flashcard-hint">💡 Click or press Space to reveal answer</div>
          </div>

          {/* Back Face (Answer) */}
          <div className="flashcard-face back">
            <div className="flashcard-tag answer">Answer</div>
            <div className="flashcard-text" style={{ fontSize: '1.25rem', fontWeight: 500 }}>
              {currentCard.answer}
            </div>
            <div className="flashcard-hint">💡 Click or press Space to flip back</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flashcard-controls">
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>

        <button className="btn btn-ghost btn-sm" onClick={handleFlip}>
          {isFlipped ? 'Show Question' : 'Reveal Answer'}
        </button>

        <button className="btn btn-primary" onClick={handleNext}>
          {currentIndex === total - 1 ? 'Finish Revision →' : 'Next Card →'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '8px' }}>
        <button className="btn btn-ghost btn-sm" onClick={onBackToWorkspace}>
          ← Back to Topic
        </button>
      </div>
    </div>
  );
}
