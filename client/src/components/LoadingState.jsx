import React from 'react';

export default function LoadingState() {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="spinner-container">
        <div className="spinner" aria-hidden="true" />
      </div>
      <h3 className="loading-title">Creating your study session...</h3>
      <p className="loading-subtitle">
        Turning your topic into flashcards and quiz questions...
      </p>
    </div>
  );
}
