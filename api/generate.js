/**
 * Vercel Serverless Function — /api/generate
 *
 * Vercel automatically routes HTTP requests to /api/generate to this file.
 * This module imports the Express app from server/index.js (which exports it
 * as default without calling app.listen()) and delegates the request to it.
 *
 * The Express app handles:
 *   - Input validation
 *   - Prompt construction
 *   - Gemini API call (server-side only — GEMINI_API_KEY never reaches browser)
 *   - JSON parsing (Layer 1)
 *   - Structured response to client
 *
 * Local development uses Vite's /api proxy → localhost:5000 instead.
 */
import app from '../server/index.js';

export default function handler(req, res) {
  // Normalise the URL so Express matches the /api/generate route correctly
  req.url = '/api/generate';
  // Delegate to Express — Express apps are valid Node http.RequestListener instances
  return app(req, res);
}
