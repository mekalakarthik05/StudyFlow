import React from 'react';

export default function QuizResult({
  questions = [],
  answers = [],
  onRetest,
  onBackToOverview,
  isRetest = false,
}) {
  const total = questions.length;
  const score = answers.filter(
    (a, i) => questions[i] && a === questions[i].correctAnswer
  ).length;
  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  const wrongIndexes = questions
    .map((_, i) => i)
    .filter((i) => questions[i] && answers[i] !== questions[i].correctAnswer);

  const missedCount = wrongIndexes.length;
  const hasWrongAnswers = missedCount > 0;

  const handleRetestClick = () => {
    const wrongQuestions = wrongIndexes.map((i) => questions[i]);
    onRetest(wrongQuestions);
  };

  return (
    <div className="quiz-result-wrapper">
      <div className="card result-surface-card">
        <div className="result-badge-icon" aria-hidden="true">
          {missedCount === 0 ? '✦' : '✓'}
        </div>

        <h2 className="result-headline">
          {isRetest ? 'Retest Complete' : 'Quiz Complete'}
        </h2>

        <div className="result-score-box">
          <div className="score-primary-metric">
            <span className="score-obtained">{score}</span>
            <span className="score-slash">/</span>
            <span className="score-total-count">{total}</span>
          </div>
          <div className="score-pct-label">{percent}% Correct</div>
        </div>

        <div className="result-insight-message">
          {missedCount === 0 ? (
            <p className="insight-perfect">Perfect score! Excellent understanding.</p>
          ) : (
            <p className="insight-missed">
              You missed {missedCount} {missedCount === 1 ? 'question' : 'questions'}.
            </p>
          )}
        </div>

        <div className="result-action-stack">
          {!isRetest && hasWrongAnswers && (
            <button
              type="button"
              className="btn btn-primary btn-block retest-cta-btn"
              onClick={handleRetestClick}
            >
              Retest Wrong Answers ({missedCount})
            </button>
          )}

          <button
            type="button"
            className={`btn ${!isRetest && hasWrongAnswers ? 'btn-secondary' : 'btn-primary'} btn-block return-overview-btn`}
            onClick={onBackToOverview}
          >
            Back to Study Session
          </button>
        </div>
      </div>
    </div>
  );
}
