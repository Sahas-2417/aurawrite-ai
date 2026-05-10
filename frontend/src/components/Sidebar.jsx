import React, { useState, useEffect } from 'react';
import { Edit3, Folder, Lightbulb, Wand2, Sparkles, Heart, X, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import logoImg from '../assets/logo.png';

const AI_TIPS = [
  "Strong hooks increase engagement by up to 40%.",
  "Short paragraphs improve readability on mobile devices.",
  "Storytelling boosts audience retention and trust.",
  "Use specific data points to establish authority.",
  "Engage with comments within the first hour of posting.",
  "End posts with a clear question to spark discussion.",
  "White space is your best friend. Use line breaks.",
  "Consistency beats virality in the long run.",
  "Authenticity resonates more than corporate jargon."
];

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3.5 w-full px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-[14px] group relative overflow-hidden",
      active
        ? "bg-gradient-to-r from-purple-600/15 to-indigo-600/15 text-white shadow-[0_0_20px_rgba(147,51,234,0.1)] border border-purple-500/20"
        : "text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-[0.98]"
    )}
  >
    {/* Active Indicator Glow */}
    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full shadow-[0_0_15px_#a855f7]" />}
    
    {/* Hover Shimmer */}
    {!active && (
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
    )}

    <div className={cn(
      "p-2 rounded-xl transition-all duration-300",
      active ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30" : "bg-white/5 text-slate-500 group-hover:bg-white/10 group-hover:text-slate-300 group-hover:scale-110"
    )}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="transition-transform duration-300 group-hover:translate-x-1">{label}</span>
  </button>
);

const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose, user, onLogout }) => {
  const [dailyTip, setDailyTip] = useState('');

  useEffect(() => {
    setDailyTip(AI_TIPS[Math.floor(Math.random() * AI_TIPS.length)]);
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }
    },
    closed: {
      x: '-100%',
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }
    }
  };

  return (
    <>
      {/* Sidebar aside - Motion for mobile, static for desktop */}
      <motion.aside 
        initial={window.innerWidth < 768 ? "closed" : false}
        animate={window.innerWidth < 768 ? (isOpen ? "open" : "closed") : false}
        variants={sidebarVariants}
        className={cn(
          "fixed md:sticky md:top-0 w-[280px] bg-navy-900/90 backdrop-blur-3xl flex flex-col h-full md:h-screen text-slate-300 border-r border-white/5 z-[50] md:translate-x-0 transition-shadow duration-500 md:shadow-none",
          isOpen ? "shadow-[20px_0_60px_rgba(0,0,0,0.4)]" : ""
        )}
      >
        <button 
          onClick={onClose}
          className="md:hidden absolute top-6 right-6 p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all active:scale-90 border border-white/5"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo Area */}
        <div className="h-28 flex items-center px-5 mt-4 shrink-0">
          <div className="flex items-center gap-3.5 group cursor-pointer w-full">
            <div className="relative shrink-0">
              <div className="absolute -inset-2 bg-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105 active:scale-95">
                <img src={logoImg} alt="AuraWrite" className="w-full h-full object-cover rounded-2xl drop-shadow-[0_0_10px_rgba(168,85,247,0.25)]" />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-[22px] leading-tight font-black text-white tracking-tight flex items-center gap-1.5 font-display">
                AuraWrite
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">AI</span>
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]"></div>
                <span className="text-[10px] font-medium text-slate-400/80 italic tracking-wide">Turn Ideas Into Influence</span>
              </div>
            </div>
          </div>
        </div>


      {/* Navigation */}
      <nav className="flex-1 px-5 py-4 overflow-y-auto custom-scrollbar flex flex-col gap-8">
        <div>
          <div className="text-[10px] font-black text-slate-500/70 tracking-[0.2em] uppercase px-3 mb-3">Workspace</div>
          <div className="space-y-1.5">
            <SidebarItem icon={Edit3} label="Generate Post" active={activeTab === 'Dashboard'} onClick={() => handleTabClick('Dashboard')} />
            <SidebarItem icon={Wand2} label="Post Enhancer" active={activeTab === 'Post Enhancer'} onClick={() => handleTabClick('Post Enhancer')} />
          </div>
        </div>

        <div>
          <div className="text-[10px] font-black text-slate-500/70 tracking-[0.2em] uppercase px-3 mb-3">Vault</div>
          <div className="space-y-1.5">
            <SidebarItem icon={Folder} label="My Posts" active={activeTab === 'My Posts'} onClick={() => handleTabClick('My Posts')} />
            <SidebarItem icon={Lightbulb} label="AI Ideas" active={activeTab === 'AI Ideas'} onClick={() => handleTabClick('AI Ideas')} />
          </div>
        </div>

        {/* Profile Section for Mobile */}
        {user && (
          <div className="mt-auto pt-6 border-t border-white/5 md:hidden">
            <div className="px-3 mb-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'User'}&background=a855f7&color=fff`} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-xl border border-white/10 object-cover" 
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[13px] font-bold text-white truncate">{user.displayName || 'Creator'}</span>
                  <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-3 w-full px-6 py-3 text-red-400 hover:bg-red-500/10 transition-colors text-[13px] font-bold rounded-xl"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </nav>

      {/* Bottom Area: Daily Tip & Footer */}
      <div className="px-5 pb-8 mt-auto flex flex-col gap-5">
        {/* Daily Tip Card */}
        <div className="relative group rounded-2xl p-[1px] shrink-0 transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.1)]">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-transparent to-transparent rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative bg-navy-800/80 border border-white/5 shadow-lg rounded-2xl p-4 flex flex-col gap-2 backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:animate-pulse" />
              <span className="text-[10px] font-bold text-purple-200/80 tracking-widest uppercase">Daily Tip</span>
            </div>
            <p className="text-[12px] text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors duration-300">
              {dailyTip}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-center text-center opacity-40 hover:opacity-100 transition-opacity duration-500 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            Made with <Heart className="w-3 h-3 text-purple-400 fill-purple-400/30" />
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 tracking-wide">
            for creators & professionals
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
