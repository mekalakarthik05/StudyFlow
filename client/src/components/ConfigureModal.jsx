import React, { useState, useEffect } from 'react';

const PRESET_COUNTS = [5, 10, 15, 20];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function ConfigureModal({ isOpen, mode, topic, onClose, onStart, isLoading }) {
  const [count, setCount] = useState(5);
  const [customCount, setCustomCount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [difficulty, setDifficulty] = useState('Medium');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setCount(5);
      setCustomCount('');
      setIsCustom(false);
      setDifficulty('Medium');
      setError(null);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handlePresetClick = (preset) => {
    setIsCustom(false);
    setCustomCount('');
    setCount(preset);
    setError(null);
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomCount(val);
    setIsCustom(true);

    if (val === '') {
      setError('Please enter a number between 1 and 20.');
      return;
    }

    const num = parseInt(val, 10);
    if (isNaN(num) || num < 1 || num > 20) {
      setError('Please enter a valid count between 1 and 20.');
    } else {
      setError(null);
      setCount(num);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCount = isCustom ? parseInt(customCount, 10) : count;
    if (isNaN(finalCount) || finalCount < 1 || finalCount > 20) {
      setError('Please choose a count between 1 and 20 items.');
      return;
    }
    onStart({
      mode,
      count: finalCount,
      difficulty,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="badge" style={{ marginBottom: '8px' }}>
              CONFIGURATION
            </span>
            <h3>{mode === 'quiz' ? 'Configure Quiz' : 'Configure Flashcards'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-topic-preview">
          📖 {topic.length > 50 ? `${topic.slice(0, 47)}...` : topic}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Difficulty selector for Quiz */}
          {mode === 'quiz' && (
            <div className="modal-form-group">
              <label className="modal-form-label">Difficulty Level</label>
              <div className="pill-selector-group" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {DIFFICULTIES.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    className={`pill-btn ${difficulty === diff ? 'active' : ''}`}
                    onClick={() => setDifficulty(diff)}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Number of Items */}
          <div className="modal-form-group">
            <label className="modal-form-label">
              {mode === 'quiz' ? 'Number of Questions' : 'Number of Flashcards'}
            </label>
            <div className="pill-selector-group">
              {PRESET_COUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`pill-btn ${!isCustom && count === preset ? 'active' : ''}`}
                  onClick={() => handlePresetClick(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '12px' }}>
              <label
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Or custom quantity (1–20):
              </label>
              <input
                type="number"
                min="1"
                max="20"
                className="custom-count-input"
                placeholder="e.g. 8"
                value={customCount}
                onChange={handleCustomChange}
              />
            </div>

            {error && (
              <div style={{ color: 'var(--accent-rose)', fontSize: '0.85rem', marginTop: '8px' }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || !!error}
              id="modal-start-btn"
            >
              {isLoading
                ? 'Generating...'
                : mode === 'quiz'
                ? 'Start Quiz →'
                : 'Start Revision →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
