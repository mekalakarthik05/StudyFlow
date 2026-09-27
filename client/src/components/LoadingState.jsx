import React from 'react';

export default function LoadingState({ mode = 'flashcards' }) {
  const message =
    mode === 'quiz'
      ? 'Generating your interactive quiz...'
      : 'Preparing your revision flashcards...';

  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-spinner-ring" />
      <div className="loading-title">{message}</div>
      <div className="loading-subtext">
        Structuring concepts and factually verifying learning items with Gemini...
      </div>
    </div>
  );
}
