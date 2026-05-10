import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PostGenerator from './components/PostGenerator';
import MyPosts from './components/MyPosts';
import AIIdeas from './components/AIIdeas';
import PostEnhancer from './components/PostEnhancer';
import ErrorBoundary from './components/ErrorBoundary';
import IntroAnimation from './components/IntroAnimation';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Edit3, SunMedium, Moon } from 'lucide-react';
import logoImg from './assets/logo.png';

function App() {
  // ── Intro animation (once per session) ──────────────────
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('aurawrite_intro_played');
  });

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem('aurawrite_intro_played', 'true');
    setShowIntro(false);
  }, []);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [seedIdea, setSeedIdea] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUseIdea = (idea) => {
    setSeedIdea(idea);
    setActiveTab('Dashboard');
    setSidebarOpen(false); // Close sidebar on mobile after choosing an idea
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <>
      {/* ── Cinematic Intro (once per session) ────────────── */}
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      {/* ── Main Application ──────────────────────────────── */}
      <motion.div
        className="flex min-h-screen bg-slate-50 dark:bg-navy-900 font-sans selection:bg-purple-200 selection:text-purple-900 dark:selection:bg-purple-900 dark:selection:text-purple-200 transition-colors duration-500 relative"
        initial={showIntro ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
      
      {/* Premium Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 dark:bg-purple-600/15 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-indigo-600/10 dark:bg-indigo-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[30%] h-[30%] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[80px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-navy-950/60 backdrop-blur-sm z-[40] md:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <Sidebar 
        isDarkMode={isDarkMode} 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSidebarOpen(false);
        }} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Floating Card Container */}
      <div className="flex-1 flex flex-col min-h-screen md:py-4 md:pr-4 relative z-10">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between px-6 py-5 bg-white/50 dark:bg-navy-900/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 z-30 transition-colors duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logoImg} alt="AuraWrite" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
            </div>
            <h1 className="text-[18px] font-black text-slate-900 dark:text-white tracking-tight">AuraWrite <span className="text-purple-500">AI</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 active:scale-90 transition-all border border-slate-200 dark:border-white/5"
            >
              {isDarkMode ? <SunMedium className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 active:scale-90 transition-all border border-slate-200 dark:border-white/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </header>

        <main className="flex-1 custom-scrollbar bg-gradient-to-br from-white via-slate-50 to-purple-50/40 dark:from-slate-900 dark:via-slate-900/95 dark:to-purple-900/10 rounded-t-[2.5rem] md:rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] transition-all duration-500 ease-in-out relative border border-transparent dark:border-white/5 ring-1 ring-slate-900/5 dark:ring-white/10 md:ml-4">
          {/* Content Transition Wrapper */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 min-h-full flex flex-col" key={activeTab}>
            <ErrorBoundary>
              {activeTab === 'Dashboard' && (
                <PostGenerator 
                  isDarkMode={isDarkMode} 
                  toggleDarkMode={toggleDarkMode} 
                  seedIdea={seedIdea} 
                  clearSeedIdea={() => setSeedIdea('')} 
                />
              )}
              {activeTab === 'My Posts' && <MyPosts isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} setActiveTab={setActiveTab} />}
              {activeTab === 'AI Ideas' && (
                <AIIdeas 
                  isDarkMode={isDarkMode} 
                  toggleDarkMode={toggleDarkMode} 
                  onUseIdea={handleUseIdea} 
                />
              )}
              {activeTab === 'Post Enhancer' && <PostEnhancer isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
            </ErrorBoundary>
          </div>
        </main>
      </div>
      <Toaster
        position="top-right"
        gutter={10}
        containerStyle={{ top: 20, right: 20 }}
        toastOptions={{
          duration: 3500,
          style: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 0,
            margin: 0,
            maxWidth: '360px',
          },
        }}
      />
      </motion.div>
    </>
  );
}

export default App;
