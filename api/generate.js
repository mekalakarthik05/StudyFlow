/**
 * Vercel serverless function — wraps the Express app for the /api/generate route.
 * The Express app is imported from server/index.js which exports `app` as default.
 * Vercel invokes this handler for requests to /api/generate.
 */
import app from '../server/index.js';

export default function handler(req, res) {
  // Simulate the /api/generate route on the Express app
  req.url = '/api/generate';
  app(req, res);
}
