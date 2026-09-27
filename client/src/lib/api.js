/**
 * StudyFlow — Frontend API Client
 *
 * Dispatches requests to /api/generate with timeout protection and returns parsed JSON.
 */

/**
 * Maps error codes to friendly, reassuring user messages.
 * Never displays developer jargon (500, JSON.parse, API key).
 */
export function mapErrorCodeToMessage(code) {
  switch (code) {
    case 'missing_input':
      return 'Please enter a topic or paste your notes to begin.';
    case 'input_too_large':
      return 'Your notes are a bit too long. Try summarizing or pasting a shorter section.';
    case 'timeout':
      return 'The study assistant took longer than expected. Please try again in a moment.';
    case 'network':
      return "We couldn't connect to the study service. Please check your internet connection.";
    case 'invalid_json':
    case 'incomplete_schema':
    case 'provider_error':
    default:
      return "Our study assistant is taking a little break right now. Please try again in a moment — your topic is saved.";
  }
}

/**
 * Sends topic, mode, count, and difficulty to the backend proxy.
 *
 * @param {object} params
 * @param {string} params.input - User topic or notes
 * @param {'flashcards' | 'quiz'} params.mode - Selected learning mode
 * @param {number} params.count - Number of items to generate
 * @param {'Easy' | 'Medium' | 'Hard'} [params.difficulty] - Quiz difficulty
 * @param {number} [timeoutMs=30000] - Request timeout in ms
 * @returns {Promise<object>} Parsed response data
 */
export async function generateStudySession({ input, mode = 'flashcards', count = 5, difficulty = 'Medium', timeoutMs = 30000 }) {
  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    throw 'missing_input';
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: input.trim(),
        mode,
        count,
        difficulty,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      try {
        const errorData = await response.json();
        if (errorData && typeof errorData.error === 'string') {
          throw errorData.error;
        }
      } catch (e) {
        if (typeof e === 'string') throw e;
      }
      throw 'provider_error';
    }

    const data = await response.json();
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw 'timeout';
    }
    if (typeof err === 'string') {
      throw err;
    }
    throw 'network';
  }
}
