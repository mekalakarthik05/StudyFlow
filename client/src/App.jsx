import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import FeatureSection from './components/FeatureSection.jsx';
import Workspace from './components/Workspace.jsx';

export default function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'workspace'
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [initialTopic, setInitialTopic] = useState('');

  const handleStartLearning = (topic = '') => {
    if (topic) setInitialTopic(topic);
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (viewId) => {
    if (viewId === 'workspace') {
      setCurrentView('workspace');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewId === 'landing') {
      setCurrentView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (viewId === 'how-it-works') {
      if (currentView !== 'landing') {
        setCurrentView('landing');
        setTimeout(() => {
          document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (viewId === 'features') {
      if (currentView !== 'landing') {
        setCurrentView('landing');
        setTimeout(() => {
          document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="landing-shell">
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onStartLearning={() => handleStartLearning()}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        showSidebarToggle={currentView === 'workspace'}
      />

      {currentView === 'landing' ? (
        <>
          <main>
            <Hero
              onStartLearning={() => handleStartLearning()}
              onSeeHowItWorks={() => handleNavigate('how-it-works')}
            />
            <FeatureSection onStartLearning={() => handleStartLearning()} />
          </main>

          <footer className="app-footer">
            <div className="footer-content">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="brand-icon" style={{ width: '24px', height: '24px', fontSize: '0.8rem' }}>
                  ✦
                </span>
                <strong style={{ color: 'var(--text-white)' }}>STUDYFLOW</strong>
                <span>— AI-Powered Interactive Learning Workspace</span>
              </div>
              <div>Built with React, Gemini LLM & Serverless Architecture</div>
            </div>
          </footer>
        </>
      ) : (
        <Workspace
          initialTopic={initialTopic}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      )}
    </div>
  );
}
