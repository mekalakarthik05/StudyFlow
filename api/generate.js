/**
 * StudyFlow — Serverless API Endpoint (/api/generate)
 *
 * Direct Vercel Serverless Function that proxies generation requests to Google Gemini.
 * Keeps GEMINI_API_KEY secure on the server.
 *
 * Validates inputs, generates strict mode-specific JSON prompts,
 * invokes Gemini with timeout & JSON mime-type, defensively parses output,
 * and returns structured JSON to the client.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Strips leading/trailing markdown code fences if present.
 */
function stripCodeFences(text) {
  if (typeof text !== 'string') return '';
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n?```\s*$/i, '');
  }
  return cleaned.trim();
}

/**
 * Constructs prompt based on requested mode (flashcards or quiz), count, and difficulty.
 */
function buildStudyPrompt({ input, mode, count, difficulty }) {
  const itemCount = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);
  const quizDiff = ['Easy', 'Medium', 'Hard'].includes(difficulty) ? difficulty : 'Medium';

  if (mode === 'quiz') {
    return `You are a study-content generator.
Create an interactive quiz from the user's topic or notes.

Return ONLY a valid JSON object. Do NOT wrap in markdown fences (\`\`\`json).
Do NOT include any commentary, explanations, or text outside the JSON object.

The JSON MUST match this exact schema:
{
  "title": "A concise title for this topic",
  "summary": "A 1-2 sentence core conceptual summary of the topic",
  "quiz": [
    {
      "question": "Clear question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ],
  "relatedTopics": ["Related Topic 1", "Related Topic 2", "Related Topic 3", "Related Topic 4"]
}

Strict Requirements:
1. "quiz" MUST contain EXACTLY ${itemCount} question objects.
2. The questions must be calibrated for ${quizDiff} difficulty level.
3. Each question MUST have EXACTLY 4 options in its "options" array.
4. "correctAnswer" MUST be an integer index (0, 1, 2, or 3) indicating the correct option in that options array.
5. "relatedTopics" MUST contain 3 to 5 logical next topics/concepts for further study.
6. Base all content accurately and factually on the topic/notes provided.

--- USER TOPIC / NOTES ---
${input}
--- END USER TOPIC / NOTES ---`;
  }

  // Default: flashcards mode
  return `You are a study-content generator.
Create interactive revision flashcards from the user's topic or notes.

Return ONLY a valid JSON object. Do NOT wrap in markdown fences (\`\`\`json).
Do NOT include any commentary, explanations, or text outside the JSON object.

The JSON MUST match this exact schema:
{
  "title": "A concise title for this topic",
  "summary": "A 1-2 sentence core conceptual summary of the topic",
  "flashcards": [
    {
      "question": "Key concept or question",
      "answer": "Concise, accurate explanation or answer"
    }
  ],
  "relatedTopics": ["Related Topic 1", "Related Topic 2", "Related Topic 3", "Related Topic 4"]
}

Strict Requirements:
1. "flashcards" MUST contain EXACTLY ${itemCount} flashcard objects.
2. Each flashcard MUST have non-empty "question" and "answer" strings.
3. "relatedTopics" MUST contain 3 to 5 logical next topics/concepts for further study.
4. Base all content accurately and factually on the topic/notes provided.

--- USER TOPIC / NOTES ---
${input}
--- END USER TOPIC / NOTES ---`;
}

/**
 * Calls Gemini with timeout and model fallback
 */
async function callGemini(promptText, timeoutMs = 25000) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_')) {
    const err = new Error('GEMINI_API_KEY is not configured on server');
    err.code = 'MISSING_API_KEY';
    throw err;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const genAI = new GoogleGenerativeAI(apiKey.trim());
  const models = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
  let lastError = null;

  try {
    for (const modelName of models) {
      if (controller.signal.aborted) break;
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        });

        const resultPromise = model.generateContent(promptText);
        const response = await Promise.race([
          resultPromise,
          new Promise((_, reject) => {
            controller.signal.addEventListener('abort', () => {
              const timeoutErr = new Error('Request timed out');
              timeoutErr.name = 'TimeoutError';
              reject(timeoutErr);
            });
          }),
        ]);

        clearTimeout(timer);
        const text = response.response.text();
        if (!text || text.trim() === '') {
          throw new Error('Empty response from model');
        }
        return text;
      } catch (err) {
        lastError = err;
        if (err.name === 'TimeoutError') throw err;
        console.warn(`[Gemini ${modelName} warning]:`, err.message || err);
      }
    }
    clearTimeout(timer);
    throw lastError || new Error('All Gemini models failed');
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

/**
 * Main serverless handler
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body if needed
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'invalid_json' });
    }
  }

  const { input, mode = 'flashcards', count = 5, difficulty = 'Medium' } = body || {};

  // Validate input
  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    return res.status(400).json({ error: 'missing_input' });
  }

  if (input.trim().length > 15000) {
    return res.status(400).json({ error: 'input_too_large' });
  }

  const parsedCount = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);

  try {
    const promptText = buildStudyPrompt({
      input: input.trim(),
      mode: mode === 'quiz' ? 'quiz' : 'flashcards',
      count: parsedCount,
      difficulty,
    });

    let rawText;
    try {
      rawText = await callGemini(promptText, 25000);
    } catch (apiErr) {
      console.error('[Gemini Error]:', apiErr.message || apiErr);
      if (apiErr.name === 'TimeoutError' || (apiErr.message && apiErr.message.includes('timed out'))) {
        return res.status(504).json({ error: 'timeout' });
      }
      if (apiErr.code === 'MISSING_API_KEY') {
        return res.status(500).json({ error: 'provider_error' });
      }
      return res.status(502).json({ error: 'provider_error' });
    }

    const cleanedText = stripCodeFences(rawText);
    if (!cleanedText) {
      return res.status(502).json({ error: 'invalid_json' });
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error('[JSON Parse Error]:', parseErr.message);
      return res.status(502).json({ error: 'invalid_json' });
    }

    return res.status(200).json(parsedJson);
  } catch (err) {
    console.error('[Unhandled Server Error]:', err.message || err);
    return res.status(500).json({ error: 'provider_error' });
  }
}
