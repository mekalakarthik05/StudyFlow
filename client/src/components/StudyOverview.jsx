import React from 'react';

export default function StudyOverview({ studyData, onStartFlashcards, onStartQuiz, onNewStudy }) {
  if (!studyData) return null;

  const flashcardCount = studyData.flashcards?.length || 0;
  const quizCount = studyData.quiz?.length || 0;

  return (
    <div className="overview-container">
      <div className="overview-nav">
        <button
          type="button"
          className="btn-back-nav"
          onClick={onNewStudy}
        >
          <span className="nav-arrow" aria-hidden="true">←</span>
          <span>New Study</span>
        </button>
      </div>

      <div className="overview-header">
        <h2 className="overview-title">{studyData.title}</h2>
        <p className="overview-subtitle">Your personalized study session</p>
      </div>

      {/* Quick Summary Card */}
      <section className="card summary-card">
        <div className="section-badge-tag">
          <span className="badge-bullet" aria-hidden="true">●</span>
          <span>QUICK SUMMARY</span>
        </div>
        <p className="summary-text">{studyData.summary}</p>
      </section>

      {/* Action Cards Grid */}
      <div className="overview-action-grid">
        {/* Flashcards Card */}
        <div className="card product-action-card">
          <div className="action-card-top">
            <span className="action-tag">FLASHCARDS</span>
            <span className="action-count-pill">{flashcardCount} cards</span>
          </div>
          <div className="action-card-body">
            <h3 className="action-card-heading">Review concepts</h3>
            <p className="action-card-sub">
              Test your recall with question and answer cards.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block action-start-btn"
            onClick={onStartFlashcards}
          >
            Start Flashcards
          </button>
        </div>

        {/* Quiz Card */}
        <div className="card product-action-card">
          <div className="action-card-top">
            <span className="action-tag">QUIZ</span>
            <span className="action-count-pill">{quizCount} questions</span>
          </div>
          <div className="action-card-body">
            <h3 className="action-card-heading">Test yourself</h3>
            <p className="action-card-sub">
              Check your understanding with {quizCount} multiple-choice questions.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block action-start-btn"
            onClick={onStartQuiz}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
