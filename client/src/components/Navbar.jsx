import React, { useState } from 'react';

export default function Navbar({ currentView, onNavigate, onStartLearning, onToggleSidebar, showSidebarToggle }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (viewId) => {
    setMobileMenuOpen(false);
    onNavigate(viewId);
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="navbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showSidebarToggle && (
            <button
              className="btn-ghost btn-sm"
              onClick={onToggleSidebar}
              aria-label="Toggle sessions sidebar"
              style={{ padding: '8px' }}
            >
              ☰
            </button>
          )}

          <a
            href="#home"
            className="brand-logo"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('landing');
            }}
          >
            <div className="brand-icon">✦</div>
            <span>STUDYFLOW</span>
          </a>
        </div>

        <ul className="nav-links">
          <li>
            <button
              className={`nav-link ${currentView === 'landing' ? 'active' : ''}`}
              onClick={() => handleNavClick('landing')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={() => handleNavClick('how-it-works')}
            >
              How It Works
            </button>
          </li>
          <li>
            <button
              className="nav-link"
              onClick={() => handleNavClick('features')}
            >
              Features
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentView === 'workspace' ? 'active' : ''}`}
              onClick={() => handleNavClick('workspace')}
            >
              Workspace
            </button>
          </li>
        </ul>

        <div className="nav-actions">
          {currentView !== 'workspace' ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={onStartLearning}
              id="navbar-start-learning-btn"
            >
              Start Learning →
            </button>
          ) : (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleNavClick('landing')}
            >
              Exit to Home
            </button>
          )}

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <button
          className="nav-link"
          style={{ textAlign: 'left' }}
          onClick={() => handleNavClick('landing')}
        >
          Home
        </button>
        <button
          className="nav-link"
          style={{ textAlign: 'left' }}
          onClick={() => handleNavClick('how-it-works')}
        >
          How It Works
        </button>
        <button
          className="nav-link"
          style={{ textAlign: 'left' }}
          onClick={() => handleNavClick('features')}
        >
          Features
        </button>
        <button
          className="nav-link"
          style={{ textAlign: 'left' }}
          onClick={() => handleNavClick('workspace')}
        >
          Workspace
        </button>
        <button
          className="btn btn-primary"
          style={{ marginTop: '8px', width: '100%' }}
          onClick={() => {
            setMobileMenuOpen(false);
            onStartLearning();
          }}
        >
          Start Learning →
        </button>
      </div>
    </nav>
  );
}
