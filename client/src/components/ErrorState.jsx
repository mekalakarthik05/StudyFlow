import React from 'react';

export default function ErrorState({ message, onRetry }) {
  if (!message) return null;

  return (
    <div className="error-card" role="alert">
      <div className="error-card-header">
        <span className="error-icon" aria-hidden="true">⚠️</span>
        <span className="error-title">Something went wrong</span>
      </div>
      <p className="error-description">{message}</p>
      {onRetry && (
        <button
          type="button"
          className="btn btn-secondary btn-sm error-retry-btn"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
