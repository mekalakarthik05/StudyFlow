# StudyFlow — AI-Powered Interactive Learning Workspace

> Turn any topic or study notes into interactive flashcards, quizzes, and structured revision sessions with Google Gemini.

StudyFlow is an AI-powered learning workspace designed to make active revision faster and more interactive. Instead of using a chatbot-style interface, StudyFlow converts user-provided topics or notes into structured learning material that can be explored through flashcards, quizzes, results, retesting, and related topics.

Built as part of the **Flam Frontend Internship Assignment**.

---

## ✨ Features

### 🧠 AI-Powered Learning

Generate structured learning content from any topic or pasted study notes using Google Gemini.

### 🃏 Interactive Flashcards

- Generate 1–20 flashcards per session
- Presets: 5, 10, 15, 20
- Custom question count
- 3D flip interaction
- Previous/next navigation
- Keyboard navigation
  - `Space` — Flip card
  - `←` — Previous card
  - `→` — Next card

### 📝 Interactive Quizzes

- Generate 1–20 questions
- Presets: 5, 10, 15, 20
- Custom question count
- Easy / Medium / Hard difficulty
- Four multiple-choice options
- Interactive answer selection
- Automatic score calculation
- Detailed result breakdown

### 🔁 Smart Retesting

Retest incorrect quiz questions without making another AI request.

### 🔎 Related Topic Exploration

After completing a learning session, StudyFlow provides structured related-topic suggestions for continuing the learning journey.

Related topics start new structured learning sessions rather than creating a chatbot conversation.

### 🎨 Learning Workspace

A focused study workspace inspired by modern AI research and learning tools, including:

- Recent session history
- Topic-based learning
- Flashcard and quiz modes
- Session navigation
- Responsive sidebar
- Mobile-friendly layout

### 🛡️ Robust AI Output Handling

AI responses are parsed and validated before reaching the interactive UI.

The application handles:

- Malformed JSON
- Missing fields
- Incorrect data types
- Invalid quiz options
- Invalid answer indexes
- Empty AI responses
- API failures
- Network failures
- Request timeouts
- Stale or out-of-order responses

### 💬 Friendly Error Experience

Technical errors are never exposed directly to users.

Instead, StudyFlow provides friendly recovery messages while preserving the user's topic or notes.

### 📱 Responsive Design

Designed for:

- Desktop
- Laptop
- Tablet
- Mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 |
| Build Tool | Vite |
| Styling | Vanilla CSS |
| Backend | Vercel Serverless Functions |
| AI | Google Gemini API |
| AI Model | Gemini 3.8 Flash |
| State Management | React Hooks |
| Local Persistence | Browser localStorage |
| Validation | Custom schema validation |
| Deployment | Vercel |

---

## 🏗️ Architecture

### Production Architecture

```text
┌───────────────────────┐
│       User            │
│    Topic / Notes      │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│     React + Vite      │
│      StudyFlow UI     │
└───────────┬───────────┘
            │
            │ POST /api/generate
            │ { input, mode, count, difficulty }
            ▼
┌───────────────────────┐
│   Vercel Serverless   │
│    api/generate.js    │
└───────────┬───────────┘
            │
            │ GEMINI_API_KEY
            ▼
┌───────────────────────┐
│     Google Gemini     │
│   Structured Output   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Server-side parsing   │
│ + response handling   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Client-side schema    │
│      validation       │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Interactive Learning  │
│ Flashcards / Quiz     │
│ Results / Retesting   │
└───────────────────────┘
```

### API Key Security

The Gemini API key is **server-side only**.

The browser never receives or imports `GEMINI_API_KEY`.

```text
Browser
   │
   │ POST /api/generate
   ▼
Vercel Function
   │
   │ GEMINI_API_KEY
   ▼
Google Gemini
```

This prevents the API key from being exposed in the frontend bundle.

---

## 📦 Project Structure

```text
StudyFlow/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── FeatureSection.jsx
│   │   │   ├── Workspace.jsx
│   │   │   ├── TopicInput.jsx
│   │   │   ├── LearningModeCard.jsx
│   │   │   ├── ConfigureModal.jsx
│   │   │   ├── FlashcardDeck.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── QuizResult.jsx
│   │   │   ├── RelatedTopics.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── FriendlyErrorState.jsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   ├── validateResult.js
│   │   │   └── validateResult.test.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── api/
│   └── generate.js
│
├── server/
│   └── index.js
│
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

### Key Files

| File | Purpose |
|---|---|
| `client/src/App.jsx` | Application-level view flow |
| `client/src/components/Workspace.jsx` | Main learning workspace |
| `client/src/components/FlashcardDeck.jsx` | Interactive flashcards |
| `client/src/components/Quiz.jsx` | Quiz interaction and scoring |
| `client/src/components/QuizResult.jsx` | Score and answer review |
| `client/src/components/RelatedTopics.jsx` | Structured topic continuation |
| `client/src/lib/api.js` | API communication and timeout handling |
| `client/src/lib/validateResult.js` | AI response validation |
| `api/generate.js` | Production Gemini serverless endpoint |
| `server/index.js` | Local development API wrapper |
| `vercel.json` | Vercel deployment configuration |

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

- Node.js 18 or later
- npm
- A Google Gemini API key

You can create a Gemini API key through Google AI Studio:

https://aistudio.google.com/apikey

---

## 1. Clone the Repository

```bash
git clone https://github.com/mekalakarthik05/StudyFlow.git
cd StudyFlow
```

---

## 2. Install Dependencies

From the project root:

```bash
npm install
```

This installs the dependencies required for local development.

---

## 3. Configure Environment Variables

Create a local environment file:

```bash
cp .env.example .env
```

For Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then add your Gemini API key to `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> **Never commit `.env` or expose your Gemini API key in frontend code.**

---

## 4. Start Development

Run:

```bash
npm run dev
```

This starts the frontend and local API server.

Open:

```text
http://localhost:5173
```

The Vite development server handles the frontend while the local backend wrapper provides the `/api/generate` endpoint.

---

# 📚 How to Use

### 1. Start Learning

Open StudyFlow and select **Start Learning**.

### 2. Enter a Topic

Enter a topic or paste study notes.

Example:

```text
Object-Oriented Programming
```

You can also provide longer notes, for example:

```text
Explain TCP congestion control, slow start,
congestion avoidance, and fast retransmit.
```

### 3. Choose a Learning Mode

Choose between:

- **Flashcards**
- **Quiz**

### 4. Configure the Session

Choose the number of items:

```text
5
10
15
20
Custom
```

For quizzes, also select a difficulty:

```text
Easy
Medium
Hard
```

### 5. Learn Interactively

For flashcards:

- Flip cards
- Navigate between cards
- Track progress

For quizzes:

- Select an answer
- Move through questions
- Complete the quiz
- Review your score

### 6. Review Results

After a quiz, StudyFlow provides:

- Score
- Correct/incorrect breakdown
- Answer review
- Retesting for incorrect answers

### 7. Continue Learning

Explore AI-generated related topics or enter a new topic to begin another structured learning session.

---

# 🤖 AI Response Contract

StudyFlow uses structured JSON rather than free-form AI text.

The expected response contains:

```json
{
  "title": "string",
  "summary": "string",
  "flashcards": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "quiz": [
    {
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "correctAnswer": 0
    }
  ],
  "relatedTopics": [
    "string"
  ]
}
```

The response passes through the following flow:

1. Gemini generates structured output.
2. The server parses the response.
3. The server checks the response structure.
4. The response is returned to the frontend.
5. The client validates the response before rendering it.

This prevents malformed AI output from directly breaking the UI.

---

# 🛡️ Error Handling

StudyFlow is designed to handle unreliable AI and network responses gracefully.

| Scenario | Handling |
|---|---|
| Empty input | User is prompted to enter a topic |
| Malformed JSON | Server rejects the response |
| Invalid schema | Client validation rejects the result |
| Missing fields | Validation fails safely |
| Invalid quiz options | Result is rejected |
| Invalid answer index | Result is rejected |
| Gemini failure | Friendly retry state |
| Network failure | Friendly connection message |
| Request timeout | Request is aborted and user can retry |
| Stale response | Older response is discarded |
| Large input | Server rejects oversized input |
| Invalid API key | Technical details remain server-side |

Technical error details are not exposed directly to users.

Instead, the application presents a friendly recovery experience and preserves the user's topic or notes whenever possible.

---

# 🔄 Stale Response Protection

Multiple AI requests can complete in a different order from when they were started.

StudyFlow uses a request ID pattern with `useRef` to ensure that only the latest request can update the active learning session.

```text
Request 1 ─────────────────────┐
                               │
Request 2 ────────────┐        │
                      ▼        ▼
                  Response 2  Response 1

                  ↓
          Only Response 2
       updates the current UI
```

This prevents an older AI response from overwriting a newer session.

---

# 🧪 Testing

Run the validation test suite:

```bash
npm test
```

Build the production frontend:

```bash
npm run build
```

The tests focus on validating AI-generated responses and ensuring malformed or invalid data does not reach the interactive UI.

---

# 🏭 Production Build

Create a production build:

```bash
npm run build
```

The frontend production output is generated in:

```text
client/dist/
```

The production API endpoint is:

```text
/api/generate
```

---

# ☁️ Deployment on Vercel

StudyFlow is designed for deployment on Vercel.

## 1. Import the GitHub Repository

Connect the following repository to Vercel:

https://github.com/mekalakarthik05/StudyFlow

## 2. Configure the Environment Variable

In the Vercel project settings, add:

```text
GEMINI_API_KEY
```

Set the value to your real Gemini API key.

Enable the variable for the required deployment environments, including Production.

> Do not commit the real API key to GitHub.

## 3. Deploy

Vercel builds the React frontend from the `client/` directory and routes:

```text
/api/generate
```

to:

```text
api/generate.js
```

The production request flow is:

```text
User
  ↓
React frontend
  ↓
/api/generate
  ↓
Vercel Serverless Function
  ↓
Google Gemini API
  ↓
Validated JSON
  ↓
StudyFlow UI
```

No Gemini API key is stored in the repository.

---

# 🔐 Security Considerations

StudyFlow follows a server-side API key architecture.

### Protected API Key

```text
GEMINI_API_KEY
```

is accessed only by the serverless backend.

### Frontend Protection

The API key is not exposed through client-side environment variables such as:

```text
VITE_GEMINI_API_KEY
NEXT_PUBLIC_GEMINI_API_KEY
```

### Local Secrets

The real `.env` file is excluded from Git through `.gitignore`.

Only the template file is committed:

```text
.env.example
```

---

# ⚠️ Known Limitations

### No Authentication

StudyFlow does not currently require user authentication. This keeps the implementation focused on the assignment scope.

### Local Session History

Recent sessions are stored using browser `localStorage`.

Clearing browser data removes the stored history.

### Gemini API Limits

Gemini API usage is subject to the limits of the configured API plan.

Temporary provider failures are handled through the application's friendly error states.

### AI-Generated Content

Generated explanations and questions may contain factual inaccuracies because they are produced by an LLM.

Important academic information should be verified against authoritative sources.

### No Streaming

Responses are returned as complete structured JSON objects rather than progressively streamed.

---

# 🤝 AI Usage Disclosure

AI-assisted development tools were used during the implementation of StudyFlow for:

- Boilerplate generation
- UI and CSS iteration
- Debugging
- Prompt engineering
- Structured JSON design
- Development assistance

The resulting implementation was reviewed and tested during development.

The architecture, validation flow, error-handling strategy, stale-response protection, and application behavior were implemented and verified against the assignment requirements.

---

# 📋 Assignment Alignment

| Requirement | Implementation |
|---|---|
| React | React 18 + Vite |
| Functional Components | React functional components |
| React Hooks | `useState`, `useEffect`, `useRef` |
| Free-form Input | Topic/notes textarea |
| Real LLM | Google Gemini API |
| Protected API Key | Vercel serverless backend |
| Structured AI Output | JSON response contract |
| AI Validation | Server and client validation |
| Interactive UI | Flashcards and quizzes |
| Bad AI Output Handling | Schema validation and friendly errors |
| Loading State | Dedicated loading UI |
| Error Handling | User-friendly recovery states |
| Stale Response Protection | Request ID with `useRef` |
| Responsive Design | Desktop, tablet, and mobile |
| Deployment | Vercel |
| Documentation | README and environment template |

---

# ⏱️ Development Time

Approximately **8 hours** were spent on the project, including:

- Architecture and planning
- UI/UX implementation
- Responsive design
- Flashcard and quiz interactions
- Gemini integration
- Structured output validation
- Error handling
- Stale request protection
- Testing
- Documentation
- Deployment preparation

---

# 📄 License

This project was created for the **Flam Frontend Internship Assignment** and is intended primarily for evaluation and demonstration purposes.