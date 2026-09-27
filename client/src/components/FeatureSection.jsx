import React from 'react';

export default function FeatureSection({ onStartLearning }) {
  return (
    <div className="section-wrapper" id="how-it-works-section">
      <div className="section-header">
        <span className="badge badge-cyan" style={{ marginBottom: '14px' }}>
          HOW STUDYFLOW WORKS
        </span>
        <h2>Three Simple Steps to Mastery</h2>
        <p>No conversational noise. Strict structured interactive learning generated in seconds.</p>
      </div>

      <div className="steps-grid">
        <div className="step-card">
          <div className="step-number">01</div>
          <h3>Enter Topic or Paste Notes</h3>
          <p>
            Input any subject, lecture notes, textbook excerpt, or technical topic.
            StudyFlow safely analyzes the content server-side without leaking API keys.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">02</div>
          <h3>Configure Mode & Quantity</h3>
          <p>
            Choose between Flashcards or Quiz. Tailor question counts from 5 to 20
            and set quiz difficulty (Easy, Medium, Hard) to match your study goals.
          </p>
        </div>

        <div className="step-card">
          <div className="step-number">03</div>
          <h3>Revise & Retest Weak Areas</h3>
          <p>
            Flip through flashcards, test yourself with instant scoring, retest wrong answers,
            and seamlessly explore AI-generated related topics.
          </p>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="cta-banner" id="features-section">
        <span className="badge badge-emerald" style={{ marginBottom: '16px' }}>
          START YOUR FIRST SESSION
        </span>
        <h2>Ready to upgrade your revision?</h2>
        <p>
          Experience distraction-free, AI-assisted learning tailored to how you study best.
        </p>
        <button className="btn btn-primary btn-lg" onClick={onStartLearning}>
          Launch StudyFlow Workspace →
        </button>
      </div>
    </div>
  );
}
