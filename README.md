# StudyFlow

AI-powered interactive study assistant.

"Learn smarter. Not harder."

---

## Features
- **Free-form topic/notes input**: Enter any subject, exam topic, or paste raw study notes (up to 2,000 characters).
- **Structured AI output**: Generates a quick summary, 5–8 flashcards, and a 5-question multiple-choice quiz as structured JSON (never unstructured chat text).
- **Interactive Flashcards**: Single state-driven show/hide answer toggle and card-by-card navigation with auto-resetting answer visibility.
- **Self-Assessment Quiz**: Real-time feedback marking correct (✓) and incorrect (✕) choices with correct answer highlighting and disabled options once chosen.
- **Targeted Retest**: Automatically isolates missed questions and launches a fresh, independent quiz instance for wrong answers without mutating original quiz results.
- **Two-Layer Defense & Response Validation**: Layer 1 JSON parsing on backend proxy; Layer 2 strict schema validation on frontend before any content touches the DOM.
- **Defensive Error Handling & Recovery**: Dedicated loading, empty, and error states with mapped user-friendly error messages and a "Try Again" retry workflow that preserves user input.
- **Stale-Request Protection**: Request ID tracking guards against out-of-order async responses when the user submits in quick succession.
- **Responsive & Accessible Design**: Restrained, clean modern UI optimized for mobile (~375px), tablet (~768px), and desktop with accessible indicators and no horizontal overflow.

---

## Tech Stack
- **Frontend**: React 18 (functional components, `useState`, `useRef`), Vite, Plain CSS
- **Backend**: Node.js, Express (single proxy endpoint)
- **AI Provider**: Google Gemini API (`@google/generative-ai`)
- **Tooling**: Concurrently (npm workspaces support for unified root start)

---

## Architecture

```
User Input 
   │
   ▼
React Client (App.jsx)
   │ (POST /api/generate)
   ▼
Express Backend Proxy (server/index.js)
   │ 1. Validates input existence
   │ 2. Injects input into strict prompt
   │ 3. Enforces 28s server timeout
   │ 4. Invokes Gemini 1.5 Flash API
   ▼
Google Gemini API
   │ Returns raw text response
   ▼
Express Backend Proxy (Layer 1 Defense)
   │ 1. Strips markdown fences (```json / ```)
   │ 2. JSON.parse (returns 502 invalid_json on failure)
   │ 3. Returns parsed JS object to client
   ▼
React Client (Layer 2 Defense - validateResult.js)
   │ 1. Validates exact top-level keys {title, summary, flashcards, quiz}
   │ 2. Validates flashcards count (5-8) and item shape {question, answer}
   │ 3. Validates quiz count (5), 4 options each, and valid integer correctAnswer (0-3)
   │ 4. Rejects any unexpected or extra fields (no partial renders / no data fabrication)
   ▼
Interactive UI State Machine (Overview → Flashcards → Quiz → Retest)
```

---

## Setup

Run once from the project root to install dependencies across workspaces:
```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

> **Note**: The Gemini API key is kept exclusively on the server and is never exposed in client bundles or network traffic.

---

## Running Locally

Start both the Express server (port 5000) and the Vite frontend (port 5173) with a single command from the project root:
```bash
npm start
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

To run the schema validation test suite:
```bash
npm test
```

---

## Error Handling

StudyFlow implements a comprehensive failure-mode matrix:

| Failure Scenario | Root Cause / Trigger | Handling Mechanism & User-Facing Message |
|---|---|---|
| **Empty Input** | Blank or whitespace-only submission | Generate button is disabled; displays *"Please enter a topic or some notes."* without triggering any network call. |
| **Malformed JSON** | Model returns invalid JSON or prose | Backend strips fences and catches parse errors, returning `502 invalid_json`. UI shows: *"The AI returned an invalid response."* with a **Try Again** button. |
| **Wrong Shape / Missing Keys** | Missing/extra keys, wrong array length, missing options | Layer 2 `validateResult.js` returns `null`. UI shows: *"The generated study session was incomplete."* without partial rendering. |
| **Provider / API Error** | Invalid API key or upstream Gemini failure | Backend returns `502 provider_error`. UI shows: *"We couldn't generate your study session."* |
| **Request Timeout** | Gemini takes longer than 28 seconds | Backend returns `504 timeout`. UI shows: *"The request took too long. Please try again."* |
| **Network Failure** | Client cannot reach backend | Fetch throws network exception. UI shows: *"We couldn't connect to the server."* |
| **Stale Response** | User initiates a second request before the first finishes | `requestId.current` counter ensures older async resolutions are silently discarded without UI flicker. |

In all error cases, the user's input text in the textarea is retained so they do not lose their prompt upon clicking **Try Again**.

---

## AI Usage

Antigravity AI Assistant was used during development to:
1. Scaffold component structures, Vite config, and CSS tokens based on the specification.
2. Draft and verify the exact Layer 2 validation test suite (`validateResult.test.js`) against edge cases (Test A, B, C, extra keys, boundary lengths).
3. Test browser rendering, responsive viewports (375px/768px/desktop), and error state transitions.
4. All architectural choices, prompt grounding constraints, state boundaries, and defensive two-layer isolation rules were strictly authored to meet the specification requirements.

---

## Known Limitations
- **Session Persistence**: Sessions are kept in memory and reset upon full page refresh.
- **Provider Dependency**: Requires an active internet connection and a valid Google Gemini API key.
- **AI Hallucination Risk**: As with any LLM, generated factual statements should be cross-referenced with primary textbooks.

---

## Time Spent
Approximately 4.5 hours end-to-end (scaffolding, data contract freezing, backend integration, validation engine, UI components, error handling matrix, responsive styling, and testing).
