/**
 * Local Development Server
 * Simply serves /api/generate by delegating to api/generate.js handler.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import handler from '../api/generate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.post('/api/generate', (req, res) => {
  return handler(req, res);
});

app.listen(PORT, () => {
  console.log(`StudyFlow local dev API running on http://localhost:${PORT}`);
});
