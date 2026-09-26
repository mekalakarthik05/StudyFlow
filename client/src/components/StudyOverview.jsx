import React from 'react';

export default function StudyOverview({ studyData, onStartFlashcards, onStartQuiz, onNewStudy }) {
  if (!studyData) return null;

  const flashcardCount = studyData.flashcards?.length || 0;
  const quizCount = studyData.quiz?.length || 0;

  return (
    <div className="overview-container">
      <div className="overview-nav">
        <button type="button" className="btn-back-nav" onClick={onNewStudy}>
          <span className="nav-arrow" aria-hidden="true">←</span>
          <span>New Study</span>
        </button>
      </div>

      <div className="overview-header">
        <h2 className="overview-title">{studyData.title}</h2>
        <p className="overview-subtitle">Your personalized study session</p>
      </div>

      {/* Quick Summary */}
      <section className="card summary-card">
        <div className="section-badge-tag">
          <span className="badge-bullet" aria-hidden="true">●</span>
          Quick Summary
        </div>
        <p className="summary-text">{studyData.summary}</p>
      </section>

      {/* Action Cards */}
      <div className="overview-action-grid">
        {/* Flashcards Card */}
        <div className="card product-action-card card-flashcards">
          <div className="action-card-top">
            <div className="action-icon-circle icon-purple" aria-hidden="true">✦</div>
            <span className="action-count-pill count-pill-purple">{flashcardCount} cards</span>
          </div>
          <div className="action-card-body">
            <h3 className="action-card-heading">Flashcards</h3>
            <p className="action-card-sub">Review concepts with question and answer cards.</p>
          </div>
          <button
            type="button"
            className="action-start-btn-purple"
            onClick={onStartFlashcards}
          >
            Start →
          </button>
        </div>

        {/* Quiz Card */}
        <div className="card product-action-card card-quiz">
          <div className="action-card-top">
            <div className="action-icon-circle icon-cyan" aria-hidden="true">?</div>
            <span className="action-count-pill count-pill-cyan">{quizCount} questions</span>
          </div>
          <div className="action-card-body">
            <h3 className="action-card-heading">Quiz</h3>
            <p className="action-card-sub">Test your understanding with multiple-choice questions.</p>
          </div>
          <button
            type="button"
            className="action-start-btn-cyan"
            onClick={onStartQuiz}
          >
            Start →
          </button>
        </div>
      </div>
    </div>
  );
}
