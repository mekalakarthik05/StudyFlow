/**
 * StudyFlow — Express backend proxy.
 * Receives user input, calls Gemini, and returns raw parsed JSON to the client.
 * Layer 2 schema validation is performed on the client side (validateResult.js).
 *
 * Vercel deployment: export the Express app so api/generate.js can re-use it.
 * Local development: app.listen() is called when run directly via `node index.js`.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrompt } from './prompt.js';

// Load environment variables from project root .env (local dev) or process.env (Vercel)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config(); // fallback: load from server/ dir if present

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

/**
 * Strips leading/trailing markdown code fences from model output.
 * Handles ```json, ```, and surrounding whitespace.
 * Does NOT modify content between fences.
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
 * Calls Gemini with a timeout. Tries models in order, falls back on recoverable errors.
 * Model list: gemini-2.0-flash-lite (fast/cheap) → gemini-2.0-flash → gemini-1.5-flash.
 *
 * @param {string} promptText
 * @param {number} timeoutMs
 * @returns {Promise<string>} Raw text response
 */
async function callGemini(promptText, timeoutMs = 28000) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here' || apiKey === 'your_key_here') {
    const err = new Error('GEMINI_API_KEY is not configured');
    err.code = 'MISSING_API_KEY';
    throw err;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const genAI = new GoogleGenerativeAI(apiKey);
  // Ordered by preference: fastest available → stable fallback
  const models = ['gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-flash'];
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

        // Race the model call against the shared AbortController timeout
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
        const text = response.response.text();
        if (!text || text.trim() === '') {
          throw new Error('Empty response from model');
        }
        return text;
      } catch (err) {
        lastError = err;
        // Do not fall back on timeout — propagate immediately
        if (err.name === 'TimeoutError') throw err;
        console.warn(`[Gemini ${modelName} fallback]:`, err.message || err);
      }
    }

    clearTimeout(timeoutId);
    throw lastError || new Error('All Gemini models failed');
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ── Main API route ────────────────────────────────────────────────────────────
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
      if (apiErr.name === 'TimeoutError' || (apiErr.message && apiErr.message.includes('timed out'))) {
        return res.status(504).json({ error: 'timeout' });
      }
      if (apiErr.code === 'MISSING_API_KEY') {
        return res.status(500).json({ error: 'provider_error' });
      }
      return res.status(502).json({ error: 'provider_error' });
    }

    // 4. Strip markdown code fences (defensive only — prompt requests JSON)
    const cleanedText = stripCodeFences(rawText);

    if (!cleanedText || cleanedText.length === 0) {
      console.error('[Empty Response After Strip]');
      return res.status(502).json({ error: 'invalid_json' });
    }

    // 5. Layer 1: Parse JSON — return 502 on failure (Layer 2 validation on client)
    let parsedJson;
    try {
      parsedJson = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error('[JSON.parse Failed]:', parseErr.message);
      return res.status(502).json({ error: 'invalid_json' });
    }

    // Return parsed object; client performs strict schema validation
    return res.status(200).json(parsedJson);
  } catch (err) {
    console.error('[Server Internal Error]:', err.message || err);
    return res.status(502).json({ error: 'provider_error' });
  }
});

// ── Local dev server ──────────────────────────────────────────────────────────
// Only call listen() when run directly (not when imported as a Vercel handler)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`StudyFlow backend running on http://localhost:${PORT}`);
  });
}

export default app;
