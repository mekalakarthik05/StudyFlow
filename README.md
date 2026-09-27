# StudyFlow — AI-Powered Interactive Learning Workspace

> **Flam Frontend Internship Assignment**
> Turn any topic or notes into interactive flashcards, quizzes, and structured revision sessions — powered by Google Gemini.

---

## Features

- **Interactive Flashcards** — 3D flip cards with keyboard navigation (Space to flip, ← → to navigate)
- **Adaptive Quizzes** — Multiple-choice questions with Easy / Medium / Hard difficulty levels
- **Configurable Counts** — Generate 1–20 flashcards or quiz questions per session (presets: 5, 10, 15, 20, or custom)
- **Smart Retesting** — Retest only incorrect answers without calling the AI again
- **Related Topic Exploration** — AI-generated structured topic suggestions for continuous learning
- **Polished Landing Page** — Scrollable premium hero, feature cards, and how-it-works section
- **Workspace UI** — NotebookLM-style sidebar with recent session history (localStorage)
- **Friendly Error Handling** — Never exposes technical errors; preserves user input on failure
- **Stale Response Protection** — useRef-based request ID pattern prevents out-of-order responses
- **Responsive Design** — Intentionally designed for desktop (1440px), laptop (1024px), tablet (768px), and mobile (390px)

---

## Tech Stack

| Layer       | Technology                        |
|-------------|-----------------------------------|
| Frontend    | React 18 + Vite                   |
| Styling     | Vanilla CSS (custom design system)|
| LLM Backend | Google Gemini API (gemini-3.8-flash) |
| Serverless  | Vercel Serverless Functions       |
| Fonts       | Outfit, Plus Jakarta Sans, JetBrains Mono (Google Fonts) |

---

## Architecture

```
User Input
    ↓
React Frontend (Vite)
    ↓
POST /api/generate  { input, mode, count, difficulty }
    ↓
Vercel Serverless Function  (api/generate.js)
    ↓
Google Gemini API  (GEMINI_API_KEY — server-side only)
    ↓
Structured JSON Response
    ↓
Client-side Schema Validation  (lib/validateResult.js)
    ↓
Interactive UI  (Flashcards / Quiz / Results / Related Topics)
```

The API key **never** reaches the browser. The frontend sends `{ input, mode, count, difficulty }` to `/api/generate`, which constructs a strict JSON-only prompt, calls Gemini, parses the response, and returns clean JSON. The client then performs Layer 2 schema validation before rendering anything.

---

## Project Structure

```
studyflow/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx              — Top navigation (desktop + mobile drawer)
│   │   │   ├── Hero.jsx                — Landing page hero section
│   │   │   ├── FeatureSection.jsx      — How-it-works + CTA banner
│   │   │   ├── Workspace.jsx           — Main learning workspace (state orchestrator)
│   │   │   ├── TopicInput.jsx          — Topic/notes textarea with validation
│   │   │   ├── LearningModeCard.jsx    — Flashcard vs Quiz mode selection
│   │   │   ├── ConfigureModal.jsx      — Count/difficulty configuration modal
│   │   │   ├── FlashcardDeck.jsx       — Interactive 3D flip flashcards
│   │   │   ├── Quiz.jsx                — Step-through quiz with option selection
│   │   │   ├── QuizResult.jsx          — Score display, breakdown, retest trigger
│   │   │   ├── RelatedTopics.jsx       — Structured continuation (not chatbot)
│   │   │   ├── LoadingState.jsx        — Animated loading with contextual message
│   │   │   └── FriendlyErrorState.jsx  — User-facing error with preserved input
│   │   ├── lib/
│   │   │   ├── api.js                  — Fetch wrapper with AbortController timeout
│   │   │   ├── validateResult.js       — Strict schema validation for AI output
│   │   │   └── validateResult.test.js  — Automated validation test suite
│   │   ├── App.jsx                     — Landing ↔ Workspace view router
│   │   ├── index.css                   — Complete design system
│   │   └── main.jsx                    — React entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── api/
│   └── generate.js         — Vercel serverless function (Gemini proxy)
├── server/
│   └── index.js             — Local dev Express wrapper for api/generate.js
├── .env.example
├── .gitignore
├── vercel.json
├── package.json
└── README.md
```

---

## Setup

### Prerequisites

- Node.js ≥ 18
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
git clone https://github.com/mekalakarthik05/flam-frontend-assignment.git
cd flam-frontend-assignment

# Install all dependencies (root + client + server workspaces)
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your real GEMINI_API_KEY
```

### Development

```bash
npm run dev
```

This starts both the backend API server (port 5000) and the Vite dev server (port 5173) concurrently. The Vite config proxies `/api` requests to the local backend.

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

### Run Validation Tests

```bash
npm test
```

---

## Usage

1. **Landing Page** — Explore the product overview, then click **Start Learning Now →**
2. **Enter a Topic** — Type any subject or paste lecture notes in the workspace
3. **Choose Mode** — Select **Flashcards** or **Quiz**
4. **Configure** — Pick question count (5 / 10 / 15 / 20 / custom) and quiz difficulty
5. **Learn Interactively** — Flip flashcards or answer quiz questions
6. **Review Results** — See your score, view detailed breakdown, retest wrong answers
7. **Continue Learning** — Click a related topic or enter a new one for another session

---

## AI Usage Disclosure

AI tools (GitHub Copilot, Google Gemini) were used during development for:

- Accelerating boilerplate code generation
- CSS design system iteration
- Debugging Vercel serverless configuration
- Prompt engineering for structured JSON output

All code was reviewed, understood, and can be explained in detail during an interview. The architectural decisions, validation logic, stale-response pattern, and error handling strategy were designed intentionally.

---

## Error Handling

The application handles every failure mode required by the assignment:

| Scenario              | Backend Behavior                     | User Experience                                    |
|-----------------------|--------------------------------------|---------------------------------------------------|
| Malformed JSON        | `JSON.parse` fails → 502            | Friendly retry UI, topic preserved                |
| Wrong JSON schema     | Client `validateResult()` returns null | Friendly retry UI, topic preserved                |
| Empty AI response     | Detected server-side → 502          | Friendly retry UI                                 |
| Gemini API failure    | Caught & logged → 502               | "Study assistant taking a break" message          |
| Invalid API key       | Detected server-side → 500          | Generic friendly error (no key leak)              |
| Network failure       | `fetch` throws → caught client-side | "Couldn't connect" message                        |
| Timeout (30s client)  | `AbortController` fires             | "Took longer than expected" message               |
| Stale response        | `useRef` request ID check           | Silently discarded; only latest response renders  |
| Input too large       | Server rejects > 15,000 chars       | "Notes a bit too long" message                    |

Technical error details are **never** shown to the user. They appear only in server/developer logs.

---

## Known Limitations

- **No persistent storage** — Sessions are stored in localStorage only; clearing browser data removes history
- **No authentication** — Any user can access the application (by design — scope freeze)
- **Rate limiting** — Gemini API free tier has rate limits; high-traffic use may hit 503 errors (handled gracefully with fallback models)
- **LLM accuracy** — Generated content depends on Gemini's knowledge; factual errors are possible
- **No streaming** — Responses arrive as complete JSON; no progressive rendering during generation

---

## Time Spent

Approximately **8 hours** total:

- ~1.5 hours: Architecture planning, project audit, cleanup
- ~2.5 hours: Landing page, workspace UI, responsive design, CSS design system
- ~2 hours: Flashcard/Quiz/Result/Retest/RelatedTopics interactive components
- ~1 hour: Gemini integration, prompt engineering, model fallback
- ~0.5 hours: Validation module, error handling, stale-response protection
- ~0.5 hours: Testing, README, deployment configuration

---

## Deployment

Deployed on **Vercel**:

1. Connect the GitHub repository to Vercel
2. Add `GEMINI_API_KEY` as an environment variable in Vercel project settings
3. Deploy — Vercel automatically:
   - Builds the React app from `client/`
   - Serves static files from `client/dist/`
   - Routes `/api/generate` to the serverless function in `api/generate.js`

No special runtime configuration is needed.
