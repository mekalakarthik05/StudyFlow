import React, { useState, useRef } from 'react';
import Header from './components/Header.jsx';
import PromptInput from './components/PromptInput.jsx';
import LoadingState from './components/LoadingState.jsx';
import ErrorState from './components/ErrorState.jsx';
import StudyOverview from './components/StudyOverview.jsx';
import FlashcardDeck from './components/FlashcardDeck.jsx';
import Quiz from './components/Quiz.jsx';
import QuizResult from './components/QuizResult.jsx';
import { generateStudySession, mapErrorCodeToMessage } from './lib/api.js';
import { validateResult } from './lib/validateResult.js';

export default function App() {
  // Application-level state (Section 6.1)
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [studyData, setStudyData] = useState(null); // validated StudyResult
  const [view, setView] = useState('home'); // 'home' | 'overview' | 'flashcards' | 'quiz' | 'result' | 'retest'
  const requestId = useRef(0);

  // Scoped result / retest state
  const [activeQuizState, setActiveQuizState] = useState({
    questions: [],
    answers: [],
    isRetest: false,
  });
  const [retestQuestions, setRetestQuestions] = useState([]);

  // Stale-response protected generator (Section 6.4)
  const handleGenerate = async () => {
    if (!input || input.trim().length === 0) {
      setStatus('error');
      setErrorMessage('Please enter a topic or some notes.');
      return;
    }

    const id = ++requestId.current;
    setStatus('loading');
    setErrorMessage(null);

    try {
      const raw = await generateStudySession(input);
      if (id !== requestId.current) return; // Discard stale response

      const validated = validateResult(raw);
      if (!validated) {
        setStatus('error');
        setErrorMessage('The AI returned an invalid response.');
        return;
      }

      setStudyData(validated);
      setStatus('success');
      setView('overview');
    } catch (errCode) {
      if (id !== requestId.current) return; // Discard stale error
      setStatus('error');
      setErrorMessage(mapErrorCodeToMessage(errCode));
    }
  };

  const handleNewStudy = () => {
    setInput('');
    setStatus('idle');
    setErrorMessage(null);
    setStudyData(null);
    setActiveQuizState({ questions: [], answers: [], isRetest: false });
    setRetestQuestions([]);
    setView('home');
  };

  const handleBackToOverview = () => {
    setView('overview');
  };

  const handleOriginalQuizComplete = (answers) => {
    setActiveQuizState({
      questions: studyData.quiz,
      answers,
      isRetest: false,
    });
    setView('result');
  };

  const handleRetestTrigger = (wrongQuestions) => {
    setRetestQuestions(wrongQuestions);
    setView('retest');
  };

  const handleRetestComplete = (answers) => {
    setActiveQuizState({
      questions: retestQuestions,
      answers,
      isRetest: true,
    });
    setView('result');
  };

  return (
    <div className="app-shell">
      <Header />

      <main className="main-content">
        {view === 'home' && (
          <PromptInput
            input={input}
            setInput={setInput}
            onSubmit={handleGenerate}
            status={status}
            loadingComponent={<LoadingState />}
            errorComponent={
              status === 'error' && errorMessage ? (
                <ErrorState message={errorMessage} onRetry={handleGenerate} />
              ) : null
            }
          />
        )}

        {view === 'overview' && studyData && (
          <StudyOverview
            studyData={studyData}
            onStartFlashcards={() => setView('flashcards')}
            onStartQuiz={() => setView('quiz')}
            onNewStudy={handleNewStudy}
          />
        )}

        {view === 'flashcards' && studyData && (
          <FlashcardDeck
            flashcards={studyData.flashcards}
            onBackToOverview={handleBackToOverview}
          />
        )}

        {view === 'quiz' && studyData && (
          <Quiz
            key="original-quiz"
            questions={studyData.quiz}
            headerLabel="QUIZ"
            onComplete={handleOriginalQuizComplete}
            onBackToOverview={handleBackToOverview}
          />
        )}

        {view === 'retest' && retestQuestions.length > 0 && (
          <Quiz
            key="retest-quiz"
            questions={retestQuestions}
            headerLabel="RETEST"
            onComplete={handleRetestComplete}
            onBackToOverview={handleBackToOverview}
          />
        )}

        {view === 'result' && (
          <QuizResult
            questions={activeQuizState.questions}
            answers={activeQuizState.answers}
            isRetest={activeQuizState.isRetest}
            onRetest={handleRetestTrigger}
            onBackToOverview={handleBackToOverview}
          />
        )}
      </main>
    </div>
  );
}
