/**
 * Validates the raw parsed JSON response from the backend against the strict StudyResult contract.
 *
 * Requirements:
 * 1. `raw` is a non-null, non-array object.
 * 2. Top-level keys must be EXACTLY: 'title', 'summary', 'flashcards', 'quiz' (no extra, no missing).
 * 3. `title` is a non-empty string.
 * 4. `summary` is a non-empty string.
 * 5. `flashcards` is an array of length 5 to 8 (inclusive).
 * 6. Each flashcard is an object with EXACTLY keys 'question' and 'answer', both non-empty strings.
 * 7. `quiz` is an array of length exactly 5.
 * 8. Each quiz item is an object with EXACTLY keys 'question', 'options', 'correctAnswer':
 *    - `question`: non-empty string
 *    - `options`: array of exactly 4 non-empty strings
 *    - `correctAnswer`: integer between 0 and 3 inclusive
 *
 * @param {any} raw - Parsed JavaScript object
 * @returns {object|null} Returns raw unchanged if valid, or null if invalid
 */
export function validateResult(raw) {
  // 1. Must be a non-null, non-array object
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null;
  }

  // 2. Exactly keys: title, summary, flashcards, quiz
  const topKeys = Object.keys(raw);
  const expectedTopKeys = ['title', 'summary', 'flashcards', 'quiz'];
  if (
    topKeys.length !== 4 ||
    !expectedTopKeys.every((key) => Object.prototype.hasOwnProperty.call(raw, key))
  ) {
    return null;
  }

  // 3. title is a non-empty string
  if (typeof raw.title !== 'string' || raw.title.trim().length === 0) {
    return null;
  }

  // 4. summary is a non-empty string
  if (typeof raw.summary !== 'string' || raw.summary.trim().length === 0) {
    return null;
  }

  // 5. flashcards must be an array of length between 5 and 8 inclusive
  if (
    !Array.isArray(raw.flashcards) ||
    raw.flashcards.length < 5 ||
    raw.flashcards.length > 8
  ) {
    return null;
  }

  // 6. Each flashcard object checks
  for (const card of raw.flashcards) {
    if (!card || typeof card !== 'object' || Array.isArray(card)) {
      return null;
    }
    const cardKeys = Object.keys(card);
    if (
      cardKeys.length !== 2 ||
      !Object.prototype.hasOwnProperty.call(card, 'question') ||
      !Object.prototype.hasOwnProperty.call(card, 'answer')
    ) {
      return null;
    }
    if (typeof card.question !== 'string' || card.question.trim().length === 0) {
      return null;
    }
    if (typeof card.answer !== 'string' || card.answer.trim().length === 0) {
      return null;
    }
  }

  // 7. quiz must be an array of length exactly 5
  if (!Array.isArray(raw.quiz) || raw.quiz.length !== 5) {
    return null;
  }

  // 8. Each quiz item checks
  for (const item of raw.quiz) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      return null;
    }
    const itemKeys = Object.keys(item);
    if (
      itemKeys.length !== 3 ||
      !Object.prototype.hasOwnProperty.call(item, 'question') ||
      !Object.prototype.hasOwnProperty.call(item, 'options') ||
      !Object.prototype.hasOwnProperty.call(item, 'correctAnswer')
    ) {
      return null;
    }
    if (typeof item.question !== 'string' || item.question.trim().length === 0) {
      return null;
    }
    if (!Array.isArray(item.options) || item.options.length !== 4) {
      return null;
    }
    for (const opt of item.options) {
      if (typeof opt !== 'string' || opt.trim().length === 0) {
        return null;
      }
    }
    if (
      typeof item.correctAnswer !== 'number' ||
      !Number.isInteger(item.correctAnswer) ||
      item.correctAnswer < 0 ||
      item.correctAnswer > 3
    ) {
      return null;
    }
  }

  return raw;
}
