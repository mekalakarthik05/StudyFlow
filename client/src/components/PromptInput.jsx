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
      {/* Hero Header */}
      <div className="hero-section">
        <div className="hero-pill-tag">
          <span className="hero-sparkle" aria-hidden="true">✦</span>
          <span>Intelligent Study Generation</span>
        </div>
        <h2 className="hero-title">Learn smarter. Not harder.</h2>
        <p className="hero-subtitle">
          Turn any topic or notes into an interactive study session in seconds.
        </p>
      </div>

      {/* Main Product Card */}
      <div className="card prompt-card">
        <form onSubmit={handleSubmit} className="prompt-form">
          <div className="textarea-wrapper">
            <textarea
              id="prompt-input"
              className="prompt-textarea"
              placeholder="Paste your topic or study notes here..."
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
              </button>

              <div className="product-highlights">
                <span className="highlight-item">AI-generated</span>
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
                  "Explain DBMS normalization with examples."
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
