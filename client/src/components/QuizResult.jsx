import React, { useState } from 'react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizResult({ title, questions, userAnswers, isRetest = false, onRetestWrong, onRestartFullQuiz, onContinueLearning }) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Calculate scores locally on the client
  const results = questions.map((q, idx) => {
    const selected = userAnswers[idx];
    const isCorrect = selected === q.correctAnswer;
    return {
      ...q,
      selected,
      isCorrect,
      questionIndex: idx,
    };
  });

  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalCount = questions.length;
  const percentage = Math.round((correctCount / totalCount) * 100);
  const wrongQuestions = results.filter((r) => !r.isCorrect);

  const isPerfect = correctCount === totalCount;

  return (
    <div className="quiz-result-card">
      <div
        className="result-score-circle"
        style={{
          borderColor: isPerfect ? 'var(--accent-emerald)' : percentage >= 70 ? 'var(--primary)' : 'var(--accent-rose)',
        }}
      >
        <span className="score-number">
          {correctCount}/{totalCount}
        </span>
        <span className="score-percent">{percentage}%</span>
      </div>

      <h2 className="result-heading">
        {isRetest ? 'Retest Complete!' : isPerfect ? 'Perfect Score! 🎉' : 'Quiz Complete!'}
      </h2>

      <p className="result-message">
        {isPerfect
          ? `Flawless mastery of ${title}. You answered every question correctly!`
          : `${wrongQuestions.length} concept${wrongQuestions.length > 1 ? 's' : ''} need another look. Keep strengthening your understanding.`}
      </p>

      {/* Action Buttons */}
      <div className="result-actions" style={{ marginBottom: '24px' }}>
        {!isPerfect && wrongQuestions.length > 0 && (
          <button
            className="btn btn-primary"
            onClick={() => onRetestWrong(wrongQuestions)}
            id="retest-wrong-btn"
          >
            🎯 Retest Wrong Answers ({wrongQuestions.length})
          </button>
        )}

        <button className="btn btn-secondary" onClick={onRestartFullQuiz}>
          🔄 Try Full Quiz Again
        </button>

        <button className="btn btn-ghost" onClick={() => setShowBreakdown(!showBreakdown)}>
          {showBreakdown ? 'Hide Detailed Breakdown' : 'View Detailed Breakdown'}
        </button>

        <button className="btn btn-primary" onClick={onContinueLearning}>
          Continue Learning →
        </button>
      </div>

      {/* Expandable detailed breakdown */}
      {showBreakdown && (
        <div style={{ textAlign: 'left', marginTop: '30px', borderTop: '1px solid var(--border-subtle)', paddingTop: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Question Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-surface)',
                  border: `1px solid ${r.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-white)' }}>
                    Question {i + 1}
                  </span>
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: r.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                      color: r.isCorrect ? '#6EE7B7' : '#FDA4AF',
                    }}
                  >
                    {r.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>

                <div style={{ fontSize: '0.95rem', color: '#E2E8F0', marginBottom: '12px' }}>
                  {r.question}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Your answer: </span>
                    <span style={{ color: r.isCorrect ? '#6EE7B7' : '#FDA4AF', fontWeight: 600 }}>
                      {r.selected !== undefined
                        ? `${OPTION_LETTERS[r.selected]}. ${r.options[r.selected]}`
                        : 'None'}
                    </span>
                  </div>
                  {!r.isCorrect && (
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Correct answer: </span>
                      <span style={{ color: '#6EE7B7', fontWeight: 600 }}>
                        {OPTION_LETTERS[r.correctAnswer]}. {r.options[r.correctAnswer]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
