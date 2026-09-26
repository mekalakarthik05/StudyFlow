import React from 'react';

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-logo-icon" aria-hidden="true">✦</span>
          <span className="brand-name">StudyFlow</span>
        </div>
        <div className="brand-badge-pill">
          <span className="badge-dot" aria-hidden="true" />
          <span>AI Study Assistant</span>
        </div>
      </div>
    </header>
  );
}
