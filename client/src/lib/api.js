/**
 * Maps short error codes to human-readable error messages.
 * Exact mapping required by Section 7.1.
 *
 * @param {string} code - Error code
 * @returns {string} User-facing error message
 */
export function mapErrorCodeToMessage(code) {
  switch (code) {
    case 'missing_input':
      return 'Please enter a topic or some notes.';
    case 'invalid_json':
      return 'The AI returned an invalid response.';
    case 'incomplete_schema':
      return 'The generated study session was incomplete.';
    case 'provider_error':
      return "We couldn't generate your study session.";
    case 'timeout':
      return 'The request took too long. Please try again.';
    case 'network':
      return "We couldn't connect to the server.";
    default:
      return 'Something went wrong. Please try again.';
  }
}

/**
 * Sends the user input to the backend to generate a structured study session.
 *
 * @param {string} input - User topic or notes
 * @returns {Promise<object>} Parsed JS object from server response
 * @throws {string} Rejects with a short error code (e.g., 'missing_input', 'invalid_json', 'provider_error', 'timeout', 'network')
 */
export async function generateStudySession(input) {
  let response;
  try {
    response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input }),
    });
  } catch (networkErr) {
    // Network failure (e.g. server down or offline)
    throw 'network';
  }

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

  try {
    const data = await response.json();
    return data;
  } catch (parseErr) {
    throw 'invalid_json';
  }
}
