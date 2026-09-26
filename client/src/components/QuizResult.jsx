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

  // SVG ring math
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="quiz-result-wrapper">
      <div className="card result-surface-card">
        <h2 className="result-headline">
          {isRetest ? 'Retest Complete' : 'Quiz Complete'}
        </h2>

        {/* SVG score ring */}
        <div className="score-ring-container">
          <div className="score-ring">
            <svg className="score-ring-svg" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
              <circle
                className="score-ring-track"
                cx="60" cy="60" r={radius}
              />
              <circle
                className="score-ring-fill"
                cx="60" cy="60" r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="score-ring-center">
              <span className="score-ring-percent">{percent}%</span>
              <span className="score-ring-label">Correct</span>
            </div>
          </div>
        </div>

        <div className="result-score-fraction">
          <span className="score-fraction-highlight">{score}</span>
          {' / '}
          <span className="score-fraction-highlight">{total}</span>
          {' questions correct'}
        </div>

        <div className="result-insight-message">
          {missedCount === 0 ? (
            <p className="insight-perfect">✦ Perfect score! Excellent understanding.</p>
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
              Retest Wrong Answers ({missedCount}) →
            </button>
          )}
          <button
            type="button"
            className={`btn ${!isRetest && hasWrongAnswers ? 'btn-secondary' : 'btn-primary'} btn-block return-overview-btn`}
            onClick={onBackToOverview}
          >
            ← Back to Study Session
          </button>
        </div>
      </div>
    </div>
  );
}
