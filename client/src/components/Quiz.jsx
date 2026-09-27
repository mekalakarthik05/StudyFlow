import React, { useState, useEffect } from 'react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function Quiz({ title, questions, isRetest = false, onComplete, onBackToWorkspace }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const total = questions?.length || 0;
  const currentQ = questions[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];

  const handleSelectOption = (optIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Calculate final array of answers ordered by question index
      const finalAnswers = questions.map((_, i) => selectedAnswers[i]);
      onComplete(finalAnswers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Keyboard shortcut support (1-4 for options)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const idx = parseInt(key, 10) - 1;
        if (idx < currentQ.options.length) {
          handleSelectOption(idx);
        }
      } else if (e.key === 'Enter' && selectedOption !== undefined) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQ, selectedOption]);

  if (!questions || questions.length === 0) return null;

  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div className="quiz-session-container">
      {/* Progress Header */}
      <div className="session-progress-header">
        <div className="session-meta-row">
          <div>
            <span className={`badge ${isRetest ? 'badge-cyan' : ''}`} style={{ marginRight: '8px' }}>
              {isRetest ? 'RETEST' : 'QUIZ'}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{title}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 600 }}>
            Question {currentIndex + 1} of {total}
          </div>
        </div>

        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="quiz-card">
        <div className="quiz-question-text">{currentQ.question}</div>

        <div className="quiz-options-list" role="radiogroup" aria-label="Question options">
          {currentQ.options.map((optText, optIndex) => {
            const isSelected = selectedOption === optIndex;
            return (
              <button
                key={optIndex}
                className={`quiz-option-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectOption(optIndex)}
                role="radio"
                aria-checked={isSelected}
              >
                <div className="quiz-option-letter">{OPTION_LETTERS[optIndex]}</div>
                <div style={{ flex: 1 }}>{optText}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flashcard-controls">
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>

        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={selectedOption === undefined}
          id="quiz-next-btn"
        >
          {currentIndex === total - 1
            ? isRetest
              ? 'Submit Retest →'
              : 'Submit Quiz →'
            : 'Next Question →'}
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
