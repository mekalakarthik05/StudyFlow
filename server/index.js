import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrompt } from './prompt.js';

// Load environment variables from .env file at project root or server dir
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

/**
 * Strips leading and trailing markdown code fences from model response text.
 * Only strips ```json / ``` fences and surrounding whitespace; does not alter content.
 */
function stripCodeFences(text) {
  if (typeof text !== 'string') return '';
  let cleaned = text.trim();
  // Remove starting ```json or ```
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '');
  }
  // Remove ending ```
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\n?```\s*$/i, '');
  }
  return cleaned.trim();
}

/**
 * Calls Gemini with prompt and returns raw text output, enforcing a timeout.
 * Primary model: gemini-3.7-flash, fallback: gemini-3.8-flash.
 */
async function callGemini(promptText, timeoutMs = 28000) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_key_here') {
    const err = new Error('GEMINI_API_KEY is not configured');
    err.code = 'MISSING_API_KEY';
    throw err;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ['gemini-3.7-flash', 'gemini-3.8-flash'];
  let lastError = null;

  try {
    for (const modelName of models) {
      if (controller.signal.aborted) break;

      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
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

        clearTimeout(timeoutId);
        return response.response.text();
      } catch (err) {
        lastError = err;
        if (err.name === 'TimeoutError') throw err;
        console.warn(`[Gemini ${modelName} fallback notice]:`, err.message || err);
      }
    }

    clearTimeout(timeoutId);
    throw lastError || new Error('Gemini generation failed');
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

app.post('/api/generate', async (req, res) => {
  const { input } = req.body || {};

  // 1. Validate non-empty input
  if (!input || typeof input !== 'string' || input.trim() === '') {
    return res.status(400).json({ error: 'missing_input' });
  }

  try {
    // 2. Build strict prompt
    const promptText = buildPrompt(input.trim());

    // 3. Call Gemini with timeout
    let rawText;
    try {
      rawText = await callGemini(promptText, 28000);
    } catch (apiErr) {
      console.error('[Gemini Call Failed]:', apiErr.message || apiErr);
      if (apiErr.name === 'TimeoutError' || apiErr.message?.includes('timed out')) {
        return res.status(504).json({ error: 'timeout' });
      }
      return res.status(502).json({ error: 'provider_error' });
    }

    // 4. Strip fences only
    const cleanedText = stripCodeFences(rawText);

    // 5. Layer 1: JSON.parse
    let parsedJson;
    try {
      parsedJson = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error('[JSON.parse Failed]:', parseErr.message, '\nRaw output was:\n', rawText);
      return res.status(502).json({ error: 'invalid_json' });
    }

    // Return parsed JSON object directly (Layer 2 validation happens on frontend)
    return res.status(200).json(parsedJson);
  } catch (err) {
    console.error('[Server Internal Error]:', err.message || err);
    return res.status(502).json({ error: 'provider_error' });
  }
});

app.listen(PORT, () => {
  console.log(`StudyFlow backend running on port ${PORT}`);
});
