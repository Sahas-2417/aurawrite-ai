import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import PostGenerator from './components/PostGenerator';
import MyPosts from './components/MyPosts';
import AIIdeas from './components/AIIdeas';
import PostEnhancer from './components/PostEnhancer';
import ErrorBoundary from './components/ErrorBoundary';
import IntroAnimation from './components/IntroAnimation';
import AuthScreen from './components/AuthScreen';
import { useAuth } from './contexts/AuthContext';
import { migrateLocalPosts } from './services/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Edit3, SunMedium, Moon, Loader2, LogOut, ChevronDown } from 'lucide-react';
import { cn } from './utils';
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
  const [showProfileMenu, setShowProfileMenu] = useState(false);

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

  // ── Auth & Migration ────────────────────────────────────────
  const { isAuthenticated, loading, user, logout } = useAuth();

  useEffect(() => {
    // Only migrate if user is authenticated and intro is done
    if (isAuthenticated && user && !showIntro) {
      migrateLocalPosts(user.uid).then((count) => {
        if (count > 0) {
          console.log(`Migrated ${count} local posts to Firestore.`);
        }
      });
    }
  }, [isAuthenticated, user, showIntro]);

  // ── Render Logic ────────────────────────────────────────────

  console.log(`[App Render] showIntro: ${showIntro}, loading: ${loading}, isAuthenticated: ${isAuthenticated}`);

  // 1. Show cinematic intro first (if first session)
  if (showIntro) {
    return (
      <ErrorBoundary>
        <IntroAnimation onComplete={handleIntroComplete} />
      </ErrorBoundary>
    );
  }

  // 2. Wait for Firebase auth state to resolve
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500 mb-4" />
        <div className="text-purple-400/80 font-bold tracking-wider uppercase text-[11px] animate-pulse">
          Initializing AuraWrite AI...
        </div>
      </div>
    );
  }

  // 3. Show auth screen if not logged in
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <AuthScreen isDarkMode={isDarkMode} />
      </ErrorBoundary>
    );
  }

  // 4. Show main application
  return (
    <ErrorBoundary>
      <motion.div
        className="flex min-h-screen bg-slate-50 dark:bg-navy-900 font-sans selection:bg-purple-200 selection:text-purple-900 dark:selection:bg-purple-900 dark:selection:text-purple-200 transition-colors duration-500 relative"
        initial={showIntro ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
      
      {/* Premium Background Orbs & Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/[0.08] dark:bg-purple-600/[0.12] rounded-full blur-[140px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/[0.06] dark:bg-indigo-600/[0.08] rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-blue-600/[0.05] dark:bg-blue-600/[0.06] rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
        
        {/* Global Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }}
        />

        {/* Subtle Vignette */}
        <div 
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, rgba(5,5,7,0.15) 100%)' }}
        />
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-navy-950/40 backdrop-blur-md z-[40] md:hidden transition-opacity duration-500"
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
      <div className="flex-1 flex flex-col min-h-screen md:py-6 md:pr-6 relative z-10">
        
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
              onClick={() => setSidebarOpen(true)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 active:scale-90 transition-all border border-slate-200 dark:border-white/5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </header>

        {/* ── Unified Top Header (Desktop & Mobile Profile + Theme) ── */}
        <div className="absolute top-0 right-0 p-4 md:p-0 z-[60] flex items-center gap-3 justify-end pointer-events-none md:relative md:w-full md:pb-4 md:flex-row">
          <div className="pointer-events-auto flex items-center gap-3 glass-card bg-white/40 dark:bg-navy-800/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-1.5 rounded-[1.25rem] shadow-lg shadow-purple-500/5">
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="group relative flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-300"
            >
              <div className={cn(
                "relative w-9 h-5 rounded-full transition-all duration-500 overflow-hidden shadow-inner",
                isDarkMode 
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-[0_0_10px_rgba(168,85,247,0.4)]" 
                  : "bg-slate-200"
              )}>
                <div className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full transition-all duration-500 shadow-md flex items-center justify-center",
                  isDarkMode ? "left-[18px] bg-white text-purple-600" : "left-0.5 bg-white text-amber-500"
                )}>
                  {isDarkMode ? <Moon className="w-2.5 h-2.5 fill-purple-600/10" /> : <SunMedium className="w-2.5 h-2.5 fill-amber-500/10" />}
                </div>
              </div>
            </button>

            <div className="w-px h-6 bg-slate-200 dark:bg-white/10"></div>

            {/* User Profile */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=a855f7&color=fff`} 
                    alt="Avatar" 
                    className="w-7 h-7 rounded-full border border-slate-200 dark:border-white/10 object-cover" 
                  />
                  <ChevronDown className={cn("w-3.5 h-3.5 text-slate-500 transition-transform", showProfileMenu ? "rotate-180" : "")} />
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div className="absolute top-[120%] right-0 min-w-[200px] p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-2xl rounded-2xl z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1 flex flex-col">
                      <span className="text-[13px] font-bold text-slate-900 dark:text-slate-200 truncate">
                        {user.displayName || 'Creator'}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-[13px] font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <main className="flex-1 custom-scrollbar bg-white/40 dark:bg-navy-900/40 backdrop-blur-3xl rounded-t-[2.5rem] md:rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-all duration-700 ease-in-out relative border border-white/20 dark:border-white/[0.08] md:ml-6 overflow-hidden z-20">
          {/* Content Transition Wrapper */}
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-1000 min-h-full flex flex-col" key={activeTab}>
            <ErrorBoundary>
              {activeTab === 'Dashboard' && (
                <PostGenerator 
                  seedIdea={seedIdea} 
                  clearSeedIdea={() => setSeedIdea('')} 
                />
              )}
              {activeTab === 'My Posts' && <MyPosts setActiveTab={setActiveTab} />}
              {activeTab === 'AI Ideas' && (
                <AIIdeas 
                  onUseIdea={handleUseIdea} 
                />
              )}
              {activeTab === 'Post Enhancer' && <PostEnhancer />}
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
    </ErrorBoundary>
  );
}

export default App;
