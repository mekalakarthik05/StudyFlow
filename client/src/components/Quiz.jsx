import React, { useState } from 'react';

export default function Quiz({
  questions = [],
  onComplete,
  headerLabel = 'QUIZ',
  onBackToOverview,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);

  const total = questions.length;
  const current = questions[currentQuestion] || {
    question: '',
    options: [],
    correctAnswer: 0,
  };

  const isOptionSelected = selectedOption !== null;
  const isLastQuestion = currentQuestion === total - 1;

  const handleSelectOption = (index) => {
    if (isOptionSelected) return; // Locked once chosen

    setSelectedOption(index);
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = index;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (!isOptionSelected) return;

    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-nav-bar">
        <button
          type="button"
          className="btn-back-nav"
          onClick={onBackToOverview}
        >
          <span className="nav-arrow" aria-hidden="true">←</span>
          <span>Study Session</span>
        </button>
      </div>

      <div className="quiz-header-row">
        <div className="quiz-badge-tag">{headerLabel}</div>
        <div className="quiz-progress-text">
          Question <span className="quiz-counter-current">{currentQuestion + 1}</span> of {total}
        </div>
      </div>

      {/* Progress Dots Indicator */}
      <div className="quiz-progress-track" aria-hidden="true">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`progress-step-dot ${
              idx < currentQuestion
                ? 'step-completed'
                : idx === currentQuestion
                ? 'step-current'
                : 'step-pending'
            }`}
          />
        ))}
      </div>

      <div className="card quiz-surface-card">
        <h3 className="quiz-question-heading">{current.question}</h3>

        <div className="quiz-options-group" role="radiogroup" aria-label="Quiz options">
          {current.options.map((optionText, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === current.correctAnswer;
            const isIncorrectSelection = isSelected && !isCorrect;

            let optionClass = 'quiz-option-card';
            let feedbackTag = null;

            if (isOptionSelected) {
              if (isCorrect) {
                optionClass += ' option-state-correct';
                feedbackTag = '✓ Correct';
              } else if (isIncorrectSelection) {
                optionClass += ' option-state-incorrect';
                feedbackTag = '✕ Incorrect';
              } else {
                optionClass += ' option-state-dimmed';
              }
            }

            return (
              <button
                key={index}
                type="button"
                className={optionClass}
                onClick={() => handleSelectOption(index)}
                disabled={isOptionSelected}
                aria-checked={isSelected}
              >
                <div className="option-badge-circle">
                  <span className="option-letter-char">
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                <span className="option-label-text">{optionText}</span>
                {feedbackTag && (
                  <span className="option-status-tag" aria-live="polite">
                    {feedbackTag}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="quiz-action-footer">
          <button
            type="button"
            className="btn btn-primary btn-block quiz-submit-step-btn"
            onClick={handleNext}
            disabled={!isOptionSelected}
          >
            {isLastQuestion ? 'See Results' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
}
