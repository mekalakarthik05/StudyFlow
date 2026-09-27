/**
 * StudyFlow — Schema Validation Module
 *
 * Validates untrusted AI responses against strict contracts before any data
 * reaches the interactive UI.
 *
 * Contract requirements:
 * 1. `raw` must be a non-null, non-array object.
 * 2. Must contain non-empty string `title` and `summary`.
 * 3. `relatedTopics` (if present) must be an array of non-empty strings.
 * 4. In 'flashcards' mode:
 *    - `flashcards` must be an array of objects with `question` and `answer` non-empty strings.
 *    - Array length must match expectedCount or be within reasonable range [1, 20].
 * 5. In 'quiz' mode:
 *    - `quiz` must be an array of objects with `question` (string), `options` (array of exactly 4 strings),
 *      and `correctAnswer` (integer 0..3).
 *    - Array length must match expectedCount or be within reasonable range [1, 20].
 *
 * Returns cleaned, validated object or throws a descriptive error / returns null.
 */

export function validateResult(raw, expectedMode = 'flashcards', expectedCount = null) {
  // 1. Must be a non-null object
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    console.warn('[validateResult] Root must be a non-null object');
    return null;
  }

  // 2. Title and Summary checks
  if (typeof raw.title !== 'string' || raw.title.trim().length === 0) {
    console.warn('[validateResult] Missing or invalid title');
    return null;
  }

  if (typeof raw.summary !== 'string' || raw.summary.trim().length === 0) {
    console.warn('[validateResult] Missing or invalid summary');
    return null;
  }

  // 3. Related topics (optional in AI prompt, but if present must be string[])
  let relatedTopics = [];
  if (Array.isArray(raw.relatedTopics)) {
    relatedTopics = raw.relatedTopics
      .filter((t) => typeof t === 'string' && t.trim().length > 0)
      .map((t) => t.trim());
  }

  // 4. Mode-specific checks
  if (expectedMode === 'flashcards') {
    if (!Array.isArray(raw.flashcards) || raw.flashcards.length === 0) {
      console.warn('[validateResult] flashcards must be a non-empty array');
      return null;
    }

    // Check count boundary (at least 1, at most 25)
    if (raw.flashcards.length > 25) {
      console.warn('[validateResult] flashcards array exceeds maximum bound');
      return null;
    }

    const validatedCards = [];
    for (let i = 0; i < raw.flashcards.length; i++) {
      const card = raw.flashcards[i];
      if (!card || typeof card !== 'object' || Array.isArray(card)) {
        console.warn(`[validateResult] flashcard[${i}] is not an object`);
        return null;
      }
      if (typeof card.question !== 'string' || card.question.trim().length === 0) {
        console.warn(`[validateResult] flashcard[${i}].question is empty or not string`);
        return null;
      }
      if (typeof card.answer !== 'string' || card.answer.trim().length === 0) {
        console.warn(`[validateResult] flashcard[${i}].answer is empty or not string`);
        return null;
      }
      validatedCards.push({
        question: card.question.trim(),
        answer: card.answer.trim(),
      });
    }

    return {
      title: raw.title.trim(),
      summary: raw.summary.trim(),
      flashcards: validatedCards,
      relatedTopics,
    };
  }

  if (expectedMode === 'quiz') {
    if (!Array.isArray(raw.quiz) || raw.quiz.length === 0) {
      console.warn('[validateResult] quiz must be a non-empty array');
      return null;
    }

    if (raw.quiz.length > 25) {
      console.warn('[validateResult] quiz array exceeds maximum bound');
      return null;
    }

    const validatedQuiz = [];
    for (let i = 0; i < raw.quiz.length; i++) {
      const item = raw.quiz[i];
      if (!item || typeof item !== 'object' || Array.isArray(item)) {
        console.warn(`[validateResult] quiz[${i}] is not an object`);
        return null;
      }
      if (typeof item.question !== 'string' || item.question.trim().length === 0) {
        console.warn(`[validateResult] quiz[${i}].question is empty or not string`);
        return null;
      }
      if (!Array.isArray(item.options) || item.options.length !== 4) {
        console.warn(`[validateResult] quiz[${i}].options must be an array of exactly 4 options`);
        return null;
      }
      const validatedOptions = [];
      for (let j = 0; j < item.options.length; j++) {
        const opt = item.options[j];
        if (typeof opt !== 'string' || opt.trim().length === 0) {
          console.warn(`[validateResult] quiz[${i}].options[${j}] is empty or not string`);
          return null;
        }
        validatedOptions.push(opt.trim());
      }

      const ans = Number(item.correctAnswer);
      if (!Number.isInteger(ans) || ans < 0 || ans > 3) {
        console.warn(`[validateResult] quiz[${i}].correctAnswer must be integer 0..3, got: ${item.correctAnswer}`);
        return null;
      }

      validatedQuiz.push({
        question: item.question.trim(),
        options: validatedOptions,
        correctAnswer: ans,
      });
    }

    return {
      title: raw.title.trim(),
      summary: raw.summary.trim(),
      quiz: validatedQuiz,
      relatedTopics,
    };
  }

  return null;
}
