import React from 'react';

export default function Hero({ onStartLearning, onSeeHowItWorks }) {
  return (
    <header className="hero-section">
      <div className="hero-eyebrow">
        <span className="badge">
          ✨ AI-POWERED INTERACTIVE LEARNING WORKSPACE
        </span>
      </div>

      <h1 className="hero-title">
        Learn anything. <br />
        <span className="text-gradient">Revise smarter.</span> Master it.
      </h1>

      <p className="hero-subtitle">
        Turn any topic, complex concept, or messy notes into interactive flashcards, 
        quizzes, and structured revision sessions powered by Gemini.
      </p>

      <div className="hero-cta-group">
        <button
          className="btn btn-primary btn-lg"
          onClick={onStartLearning}
          id="hero-start-btn"
        >
          Start Learning Now →
        </button>
        <button
          className="btn btn-secondary btn-lg"
          onClick={onSeeHowItWorks}
        >
          See How It Works
        </button>
      </div>

      {/* Hero Feature Preview Pills */}
      <div className="hero-feature-grid">
        <div className="feature-pill-card">
          <div className="feature-icon-wrapper">⚡</div>
          <h3>Interactive Flashcards</h3>
          <p>Active recall cards with smooth 3D flips and keyboard navigation.</p>
        </div>

        <div className="feature-pill-card">
          <div className="feature-icon-wrapper cyan">🧠</div>
          <h3>Adaptive Quizzes</h3>
          <p>Instant scored multiple-choice challenges across difficulty levels.</p>
        </div>

        <div className="feature-pill-card">
          <div className="feature-icon-wrapper emerald">🎯</div>
          <h3>Smart Targeted Review</h3>
          <p>Retest only your wrong answers and explore structured next topics.</p>
        </div>
      </div>
    </header>
  );
}
