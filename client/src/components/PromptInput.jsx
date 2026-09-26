import React from 'react';

export default function PromptInput({
  input,
  setInput,
  onSubmit,
  status,
  loadingComponent,
  errorComponent,
}) {
  const maxLength = 2000;
  const isInputEmpty = !input || input.trim().length === 0;
  const isLoading = status === 'loading';

  const handleExampleClick = () => {
    if (isLoading) return;
    setInput('Explain DBMS normalization with examples. I have an exam tomorrow.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isInputEmpty || isLoading) return;
    onSubmit();
  };

  return (
    <div className="home-container">
      {/* Hero */}
      <div className="hero-section">
        <div className="hero-pill-tag">
          <span className="hero-sparkle" aria-hidden="true">✦</span>
          <span>AI-Powered Study Assistant</span>
        </div>
        <h2 className="hero-title">
          Learn smarter.<br />Not harder.
        </h2>
        <p className="hero-subtitle">
          Turn any topic or notes into an interactive study session in seconds.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="card prompt-card">
        <form onSubmit={handleSubmit} className="prompt-form">
          <p className="prompt-card-label">What do you want to learn?</p>

          <div className="textarea-wrapper">
            <textarea
              id="prompt-input"
              className="prompt-textarea"
              placeholder="Paste your notes or describe a topic..."
              value={input}
              maxLength={maxLength}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              rows={5}
            />
            <div className="textarea-footer">
              <span className="char-counter">
                {input ? input.length : 0} / {maxLength}
              </span>
            </div>
          </div>

          <div className="prompt-card-divider" />

          <div className="prompt-card-actions">
            {isLoading ? (
              loadingComponent
            ) : (
              <>
                {errorComponent}

                <button
                  type="submit"
                  id="generate-button"
                  className="btn btn-primary btn-block generate-btn"
                  disabled={isInputEmpty || isLoading}
                >
                  <span className="btn-icon" aria-hidden="true">✦</span>
                  <span>Generate Study Session</span>
                  <span aria-hidden="true">→</span>
                </button>

                <div className="product-highlights">
                  <span className="highlight-item">AI Generated</span>
                  <span className="highlight-dot">•</span>
                  <span className="highlight-item">Structured</span>
                  <span className="highlight-dot">•</span>
                  <span className="highlight-item">Interactive</span>
                </div>

                <div className="example-prompt-wrapper">
                  <span className="example-prompt-label">Try:</span>
                  <button
                    type="button"
                    className="example-prompt-pill"
                    onClick={handleExampleClick}
                    disabled={isLoading}
                  >
                    "Explain DBMS normalization with examples. I have an exam tomorrow."
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
