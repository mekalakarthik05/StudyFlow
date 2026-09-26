# StudyFlow

**AI-Powered Interactive Study Assistant**

> "Learn smarter. Not harder."

Turn any topic or study notes into a structured, interactive study session — complete with a quick summary, flashcards, and a multiple-choice quiz — powered by Google Gemini.

---

## Features

- **Free-form input** — Paste notes, describe a topic, or dump raw text (up to 2,000 characters)
- **Structured AI output** — Gemini returns strict JSON (never free-form chat text), validated before any content touches the DOM
- **Quick summary** — Concise overview of the generated study session
- **Interactive Flashcards** — Card-by-card navigation with show/hide answer toggle; answer state auto-resets on navigation
- **Self-assessment Quiz** — One question at a time, real-time correct/incorrect feedback, progress tracking, final score
- **Targeted Retest** — Isolates missed questions and launches an independent fresh quiz session (original score is never overwritten)
- **Two-layer defense** — Layer 1: JSON parsing on the backend proxy; Layer 2: strict schema validation on the frontend before rendering
- **Full failure-mode coverage** — Malformed JSON, wrong schema, empty response, timeout, network failure, and stale responses all handled explicitly
- **Responsive design** — Optimized for mobile (375px), tablet (768px), and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (functional components, `useState`, `useRef`), Vite, Plain CSS |
| Backend | Node.js, Express (single `/api/generate` proxy endpoint) |
| AI Provider | Google Gemini API (`@google/generative-ai`) |
| Tooling | npm workspaces, Concurrently |
| Deployment | Vercel (frontend + serverless function) |

---

## Architecture

```
User Input (free-form text)
    │
    ▼
React Client — App.jsx state machine
    │  POST /api/generate
    ▼
Express Backend Proxy — server/index.js
    │  1. Validates non-empty input
    │  2. Builds strict JSON-only prompt
    │  3. Enforces 28 s server-side timeout
    │  4. Calls Gemini API (gemini-2.0-flash-lite → gemini-2.0-flash → gemini-1.5-flash)
    │  5. Strips markdown fences from response
    │  6. Layer 1: JSON.parse — returns 502 invalid_json on failure
    │  7. Returns parsed object to client
    ▼
React Client — validateResult.js (Layer 2 defense)
    │  Validates: exact top-level keys, string types, flashcard count (5–8),
    │  quiz count (5), 4 options each, integer correctAnswer (0–3), no extra keys
    │  → null on any violation (routes to error state, never partial render)
    ▼
Interactive UI State Machine
    Home → Overview → Flashcards → Quiz → Result → Retest
```

The **API key lives only on the server**. The browser never calls Gemini directly and never sees `GEMINI_API_KEY`.

---

## Setup

```bash
# Clone the repository
git clone https://github.com/mekalakarthik05/flam-frontend-assignment.git
cd flam-frontend-assignment

# Install all workspace dependencies
npm install
```

---

## Environment Variables

Create a `.env` file in the **project root** (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env`:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
```

> ⚠️ `.env` is git-ignored. **Never commit your real API key.** The `.env.example` file contains only placeholder values and is safe to commit.

Obtain a free Gemini API key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).

---

## Running Locally

Start both the Express server (port 5000) and the Vite dev server (port 5173) with one command from the project root:

```bash
npm start
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

To run the schema validation test suite:

```bash
npm test
```

---

## Usage

1. Enter a topic, exam subject, or paste raw study notes into the input field
2. Click **✦ Generate Study Session →**
3. Review the AI-generated **Quick Summary** on the Study Overview screen
4. Click **Start →** on **Flashcards** to flip through question/answer cards
5. Click **Start →** on **Quiz** to take the multiple-choice quiz
6. View your score on the Results screen
7. Click **Retest Wrong Answers** to retake only the questions you missed

---

## Error Handling

StudyFlow implements a comprehensive failure-mode matrix:

| Failure | Trigger | User-Facing Behaviour |
|---|---|---|
| **Empty input** | Blank/whitespace submission | Button disabled; no network call |
| **Malformed JSON** | Model returns prose or invalid JSON | Backend returns `502 invalid_json`; "The AI returned an invalid response." + Retry |
| **Wrong schema** | Missing/extra keys, wrong lengths | `validateResult` returns `null`; "The generated study session was incomplete." + Retry |
| **Provider / API error** | Invalid key or Gemini failure | `502 provider_error`; "We couldn't generate your study session." + Retry |
| **Timeout** | Gemini takes > 28 s | `504 timeout`; "The request took too long. Please try again." + Retry |
| **Network failure** | Client cannot reach backend | Fetch exception caught; "We couldn't connect to the server." + Retry |
| **Stale response** | Second request fires before first resolves | `requestId.current` counter discards the older result silently |

User input is always retained across retries so the prompt is never lost.

---

## AI Usage

[Antigravity AI](https://antigravity.dev) (Google DeepMind) was used during development to:

1. Scaffold component structures, Vite config, and CSS design tokens from the specification
2. Draft and iterate on the two-layer validation architecture and test suite edge cases
3. Assist with dark SaaS UI design system, responsive layout, and micro-interaction CSS
4. Iterate on Gemini prompt wording to improve JSON compliance

All architectural choices — the state machine design, two-layer validation boundary, stale-request guard, retest isolation, and error code mapping — were authored to meet the Flam assignment specification. The final implementation was reviewed, tested, and understood end-to-end.

---

## Deployment (Vercel)

The project is structured for zero-config Vercel deployment:

1. Push the repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. In **Project Settings → Environment Variables**, add:
   ```
   GEMINI_API_KEY = your_actual_gemini_api_key_here
   ```
4. Deploy — Vercel automatically runs `npm run build --workspace=client` and deploys `client/dist` as the static frontend, with `api/generate.js` as a serverless function

> **Note**: Do **not** use a `VITE_GEMINI_API_KEY` or any `VITE_`/`NEXT_PUBLIC_` prefix — those would expose the key in the browser bundle.

---

## Known Limitations

- **No session persistence** — Sessions are memory-only and reset on page refresh
- **Provider dependency** — Requires an active internet connection and a valid Gemini API key
- **AI consistency** — Gemini occasionally returns slightly malformed JSON under high load; the two-layer defense routes these gracefully to the error state rather than crashing
- **Gemini availability** — The API may experience transient 503 errors; the server implements model fallback (`gemini-2.0-flash-lite → gemini-2.0-flash → gemini-1.5-flash`)

---

## Time Spent

Approximately **6–7 hours** end-to-end: data contract design, backend proxy, Gemini integration, two-layer validation, error handling matrix, interactive UI components, dark SaaS design system, responsive layout, test suite, Vercel adapter, and documentation.
