import React, { useState, useEffect, useRef } from 'react';
import TopicInput from './TopicInput.jsx';
import LearningModeCard from './LearningModeCard.jsx';
import ConfigureModal from './ConfigureModal.jsx';
import FlashcardDeck from './FlashcardDeck.jsx';
import Quiz from './Quiz.jsx';
import QuizResult from './QuizResult.jsx';
import RelatedTopics from './RelatedTopics.jsx';
import LoadingState from './LoadingState.jsx';
import FriendlyErrorState from './FriendlyErrorState.jsx';
import { generateStudySession, mapErrorCodeToMessage } from '../lib/api.js';
import { validateResult } from '../lib/validateResult.js';

const SESSIONS_STORAGE_KEY = 'studyflow_recent_sessions';

export default function Workspace({ initialTopic, sidebarOpen, setSidebarOpen }) {
  // Session / Topic State
  const [topicInput, setTopicInput] = useState(initialTopic || '');
  const [activeTopic, setActiveTopic] = useState(initialTopic || null);
  const [recentSessions, setRecentSessions] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [
        'Object Oriented Programming',
        'DBMS Indexing & ACID',
        'Operating Systems Concurrency'
      ];
    } catch {
      return ['Object Oriented Programming', 'DBMS Indexing & ACID'];
    }
  });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState('flashcards'); // 'flashcards' | 'quiz'

  // Async & AI State
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [studyData, setStudyData] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('input'); // 'input' | 'modes' | 'flashcards' | 'quiz' | 'result' | 'continue'
  
  // Scoped Quiz / Retest State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState([]);
  const [activeQuizAnswers, setActiveQuizAnswers] = useState([]);
  const [isRetestMode, setIsRetestMode] = useState(false);

  // Stale Response Protection Pattern (useRef)
  const activeRequestId = useRef(0);
  const lastConfig = useRef({ mode: 'flashcards', count: 5, difficulty: 'Medium' });

  // Sync recent sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(recentSessions));
    } catch (e) {
      console.warn('Failed to save recent sessions to localStorage', e);
    }
  }, [recentSessions]);

  const saveToRecent = (topicName) => {
    if (!topicName || topicName.trim().length === 0) return;
    const clean = topicName.trim();
    setRecentSessions((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== clean.toLowerCase());
      return [clean, ...filtered].slice(0, 8);
    });
  };

  const handleDeleteSession = (e, topicToDelete) => {
    e.stopPropagation();
    setRecentSessions((prev) => prev.filter((t) => t !== topicToDelete));
  };

  const handleSelectRecentSession = (topic) => {
    setSidebarOpen(false);
    setTopicInput(topic);
    setActiveTopic(topic);
    setCurrentScreen('modes');
    setStatus('idle');
    setErrorMessage(null);
  };

  const handleStartNewTopic = () => {
    setSidebarOpen(false);
    setTopicInput('');
    setActiveTopic(null);
    setStudyData(null);
    setCurrentScreen('input');
    setStatus('idle');
    setErrorMessage(null);
  };

  const handleSubmitTopic = (submittedTopic) => {
    setActiveTopic(submittedTopic);
    saveToRecent(submittedTopic);
    setCurrentScreen('modes');
    setStatus('idle');
    setErrorMessage(null);
  };

  const handleOpenConfigure = (mode) => {
    setSelectedMode(mode);
    setModalOpen(true);
  };

  // Main Generation Flow with Validation and Stale-Response Protection
  const handleGenerate = async ({ mode, count, difficulty }) => {
    setModalOpen(false);
    lastConfig.current = { mode, count, difficulty };

    const reqId = ++activeRequestId.current;
    setStatus('loading');
    setErrorMessage(null);

    try {
      const rawData = await generateStudySession({
        input: activeTopic,
        mode,
        count,
        difficulty,
      });

      // Discard stale response if a newer request was dispatched
      if (reqId !== activeRequestId.current) {
        return;
      }

      // Strict Layer-2 Schema Validation
      const validated = validateResult(rawData, mode, count);
      if (!validated) {
        setStatus('error');
        setErrorMessage(
          'The AI generated an unexpected format. Please try again to generate a clean session.'
        );
        return;
      }

      setStudyData(validated);
      setStatus('success');

      if (mode === 'flashcards') {
        setCurrentScreen('flashcards');
      } else {
        setActiveQuizQuestions(validated.quiz);
        setActiveQuizAnswers([]);
        setIsRetestMode(false);
        setCurrentScreen('quiz');
      }
    } catch (errCode) {
      if (reqId !== activeRequestId.current) return;
      setStatus('error');
      setErrorMessage(mapErrorCodeToMessage(errCode));
    }
  };

  const handleRetry = () => {
    if (activeTopic && lastConfig.current) {
      handleGenerate(lastConfig.current);
    } else {
      setStatus('idle');
      setCurrentScreen('input');
    }
  };

  const handleQuizComplete = (answers) => {
    setActiveQuizAnswers(answers);
    setCurrentScreen('result');
  };

  const handleRetestWrong = (wrongQuestions) => {
    // Retest only the wrong questions locally without redundant Gemini call
    setActiveQuizQuestions(wrongQuestions);
    setActiveQuizAnswers([]);
    setIsRetestMode(true);
    setCurrentScreen('quiz');
  };

  const handleRestartFullQuiz = () => {
    if (studyData?.quiz) {
      setActiveQuizQuestions(studyData.quiz);
      setActiveQuizAnswers([]);
      setIsRetestMode(false);
      setCurrentScreen('quiz');
    }
  };

  return (
    <div className="workspace-shell">
      {/* Left Sidebar (NotebookLM Style) */}
      <aside className={`workspace-sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Session history">
        <div className="sidebar-header">
          <div className="sidebar-title">MY SESSIONS</div>
          <button className="btn btn-primary btn-sm" onClick={handleStartNewTopic}>
            + New Topic
          </button>
        </div>

        <div className="sidebar-content">
          {recentSessions.map((sessionTopic, idx) => (
            <button
              key={idx}
              className={`session-item ${activeTopic === sessionTopic ? 'active' : ''}`}
              onClick={() => handleSelectRecentSession(sessionTopic)}
            >
              <span className="session-item-text">{sessionTopic}</span>
              <span
                className="session-delete-btn"
                onClick={(e) => handleDeleteSession(e, sessionTopic)}
                title="Remove from recents"
              >
                ✕
              </span>
            </button>
          ))}
          {recentSessions.length === 0 && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '12px' }}>
              No recent sessions. Start by entering a topic!
            </div>
          )}
        </div>
      </aside>

      {/* Main Learning Workspace Content Area */}
      <main className="workspace-main">
        <div className="workspace-container">
          {/* Loading State */}
          {status === 'loading' && <LoadingState mode={selectedMode} />}

          {/* Friendly Error State */}
          {status === 'error' && (
            <FriendlyErrorState
              message={errorMessage}
              topic={activeTopic}
              onRetry={handleRetry}
              onEditTopic={() => {
                setStatus('idle');
                setCurrentScreen('input');
              }}
            />
          )}

          {/* Step 1: Topic / Notes Input */}
          {status !== 'loading' && status !== 'error' && currentScreen === 'input' && (
            <TopicInput
              input={topicInput}
              setInput={setTopicInput}
              onSubmitTopic={handleSubmitTopic}
              isLoading={status === 'loading'}
            />
          )}

          {/* Step 2: Learning Mode Selection */}
          {status !== 'loading' && status !== 'error' && currentScreen === 'modes' && (
            <LearningModeCard
              topic={activeTopic}
              onSelectMode={handleOpenConfigure}
              onChangeTopic={() => setCurrentScreen('input')}
            />
          )}

          {/* Step 3: Interactive Flashcards */}
          {status !== 'loading' && status !== 'error' && currentScreen === 'flashcards' && studyData && (
            <FlashcardDeck
              title={studyData.title || activeTopic}
              flashcards={studyData.flashcards}
              onFinish={() => setCurrentScreen('continue')}
              onSwitchToQuiz={() => handleOpenConfigure('quiz')}
              onBackToWorkspace={() => setCurrentScreen('modes')}
            />
          )}

          {/* Step 4: Interactive Quiz */}
          {status !== 'loading' && status !== 'error' && currentScreen === 'quiz' && (
            <Quiz
              title={studyData?.title || activeTopic}
              questions={activeQuizQuestions}
              isRetest={isRetestMode}
              onComplete={handleQuizComplete}
              onBackToWorkspace={() => setCurrentScreen('modes')}
            />
          )}

          {/* Step 5: Quiz Results */}
          {status !== 'loading' && status !== 'error' && currentScreen === 'result' && (
            <QuizResult
              title={studyData?.title || activeTopic}
              questions={activeQuizQuestions}
              userAnswers={activeQuizAnswers}
              isRetest={isRetestMode}
              onRetestWrong={handleRetestWrong}
              onRestartFullQuiz={handleRestartFullQuiz}
              onContinueLearning={() => setCurrentScreen('continue')}
            />
          )}

          {/* Step 6: Session Complete & Structured Continuation */}
          {status !== 'loading' && status !== 'error' && currentScreen === 'continue' && (
            <RelatedTopics
              title={studyData?.title || activeTopic}
              summary={studyData?.summary || ''}
              relatedTopics={studyData?.relatedTopics || []}
              onSelectRelatedTopic={(newTopic) => {
                setTopicInput(newTopic);
                handleSubmitTopic(newTopic);
              }}
              onNewTopic={(newTopic) => {
                setTopicInput(newTopic);
                handleSubmitTopic(newTopic);
              }}
            />
          )}
        </div>
      </main>

      {/* Configuration Modal */}
      <ConfigureModal
        isOpen={modalOpen}
        mode={selectedMode}
        topic={activeTopic || ''}
        onClose={() => setModalOpen(false)}
        onStart={handleGenerate}
        isLoading={status === 'loading'}
      />
    </div>
  );
}
