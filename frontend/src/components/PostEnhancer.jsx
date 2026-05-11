import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Loader2, Copy, Check, Sparkles, Scissors, Briefcase, Zap, Smile } from 'lucide-react';
import { notify } from '../toastConfig';
import { enhancePost } from '../services/api';
import { cn } from '../utils';

const TOGGLES = [
  { id: 'make_shorter', label: 'Make Shorter', icon: Scissors, color: 'text-red-500', activeBg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400', inactiveBg: 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' },
  { id: 'make_professional', label: 'More Professional', icon: Briefcase, color: 'text-blue-500', activeBg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400', inactiveBg: 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' },
  { id: 'make_engaging', label: 'More Engaging', icon: Zap, color: 'text-amber-500', activeBg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-400', inactiveBg: 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' },
  { id: 'add_emojis', label: 'Add Emojis', icon: Smile, color: 'text-emerald-500', activeBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400', inactiveBg: 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' }
];

const PostEnhancer = () => {
  const [originalPost, setOriginalPost] = useState('');
  const [modifiers, setModifiers] = useState({
    make_shorter: false,
    make_professional: false,
    make_engaging: false,
    add_emojis: false
  });
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPost, setEnhancedPost] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [originalPost]);

  const toggleModifier = (id) => {
    setModifiers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEnhance = async () => {
    if (!originalPost.trim()) {
      notify.error('Missing input', 'Please paste a post to enhance.');
      return;
    }
    
    setIsEnhancing(true);
    setEnhancedPost('');

    try {
      const result = await enhancePost({
        original_post: originalPost,
        ...modifiers
      });
      setEnhancedPost(result.post);
      
      // Auto-save to history
      const savedPosts = JSON.parse(localStorage.getItem('saved_posts') || '[]');
      const newPost = {
        id: Date.now().toString(),
        text: result.post,
        bulletPoints: `Original Post snippet: ${originalPost.substring(0, 50)}...`,
        tone: 'Enhanced',
        length: modifiers.make_shorter ? 'Short' : 'Optimized',
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('saved_posts', JSON.stringify([newPost, ...savedPosts]));

      notify.enhanced();
    } catch (err) {
      notify.error('Enhancement failed', err.message || 'Failed to enhance post.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopy = () => {
    if (enhancedPost) {
      navigator.clipboard.writeText(enhancedPost);
      setCopied(true);
      notify.copy();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col relative text-slate-800 dark:text-slate-200 transition-colors duration-500">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="relative px-4 md:px-8 pt-6 md:pt-8 pb-6 md:pb-10 shrink-0 z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] md:text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 w-fit">
              <Wand2 className="w-3 h-3" />
              Strategist Hub
            </div>
          </div>
          <h2 className="text-[26px] md:text-[34px] font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight transition-colors duration-500">
            Post Enhancer
            <Sparkles className="w-6 h-6 text-indigo-500 animate-pulse" />
          </h2>
          <p className="text-[14px] md:text-[15px] text-slate-500 dark:text-slate-400 font-bold transition-colors duration-500 max-w-lg opacity-80">
            Refine, format, and optimize your existing content for peak performance.
          </p>
        </div>


      </header>

      <div className="grid lg:grid-cols-2 gap-0 relative z-10 pb-8">
        {/* Left Column - Input */}
        <div className="flex flex-col px-4 md:px-8 py-4 md:py-8 transition-colors duration-500">
          <div className="space-y-8 max-w-2xl">
            
            {/* Input Textarea */}
            <div className="group">
              <div className="flex items-center justify-between mb-3 px-1">
                <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 uppercase text-[12px] tracking-widest opacity-80">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  Original Content
                </label>
                <button 
                  onClick={() => setOriginalPost('')}
                  className="text-[11px] font-bold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-wider"
                >
                  Clear All
                </button>
              </div>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={originalPost}
                  onChange={(e) => setOriginalPost(e.target.value)}
                  placeholder="Paste your draft or underperforming post here..."
                  className="w-full min-h-[140px] md:min-h-[280px] glass-card rounded-[2rem] p-8 text-[15px] font-bold leading-relaxed text-slate-700 dark:text-slate-200 placeholder-slate-400/60 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 transition-all duration-300 resize-none shadow-xl overflow-hidden"
                />
                <div className="absolute bottom-5 right-6 text-[10px] font-black text-slate-400/80 bg-white/50 dark:bg-slate-800/50 px-2.5 py-1.5 rounded-lg backdrop-blur-md border border-white/10">
                  {originalPost.length} CHARACTERS
                </div>
              </div>
            </div>

            {/* Modifiers */}
            <div>
              <h3 className="text-[12px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase mb-4 px-1 opacity-80">Enhancement Protocol</h3>
              <div className="grid grid-cols-2 gap-4">
                {TOGGLES.map(toggle => {
                  const Icon = toggle.icon;
                  const isActive = modifiers[toggle.id];
                  return (
                    <button
                      key={toggle.id}
                      onClick={() => toggleModifier(toggle.id)}
                      className={cn(
                        "group flex items-center gap-3 p-4 rounded-[1.5rem] border-2 transition-all duration-500 font-black text-[13px] hover-lift",
                        isActive 
                          ? "bg-white dark:bg-slate-800 border-indigo-500/50 shadow-xl shadow-indigo-500/10 ring-4 ring-indigo-500/5" 
                          : "bg-white/40 dark:bg-slate-800/40 border-slate-100 dark:border-white/5 text-slate-500"
                      )}
                    >
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                        isActive ? "bg-indigo-500 text-white shadow-lg" : "bg-white/80 dark:bg-slate-700/50 text-slate-400"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={cn("transition-colors", isActive ? "text-slate-900 dark:text-white" : "text-slate-400")}>
                        {toggle.label.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enhance Button */}
            <div className="relative group pt-2">
              <button
                onClick={handleEnhance}
                disabled={isEnhancing || !originalPost.trim()}
                className={cn(
                  "relative w-full text-white font-black py-5 rounded-[1.5rem] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl overflow-hidden",
                  isEnhancing 
                    ? "bg-slate-900 dark:bg-white dark:text-slate-900" 
                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-[1.02] active:scale-[0.98] shadow-indigo-500/25"
                )}
              >
                {!isEnhancing && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite]"></div>}
                
                {isEnhancing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>SYNTHESIZING...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    ENHANCE MY POST
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="flex flex-col bg-slate-50/30 dark:bg-black/10 px-4 md:px-8 py-4 md:py-8 transition-colors duration-500">
          <div className="max-w-2xl w-full mx-auto h-full flex flex-col">
            
            <div className="glass-card rounded-[2.5rem] flex-1 flex flex-col shadow-2xl shadow-indigo-500/5 relative overflow-hidden group/output">
              
              {/* Output Header */}
              <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
                <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2.5 text-[17px] tracking-tight uppercase">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  Optimized Output
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    disabled={!enhancedPost}
                    className="flex items-center gap-2 text-[12px] font-black text-slate-600 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-30"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col relative overflow-hidden">
                
                {!isEnhancing && !enhancedPost && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                     <div className="relative mb-8 group-hover/output:scale-110 transition-transform duration-700">
                        <div className="absolute -inset-10 bg-indigo-500/10 rounded-full blur-[50px] animate-pulse-slow"></div>
                        <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-xl border border-white/10">
                          <Wand2 className="w-12 h-12 text-slate-200 dark:text-slate-700" />
                        </div>
                     </div>
                     <h4 className="text-xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Synthesizer Standby</h4>
                     <p className="text-slate-400 dark:text-slate-500 text-[14px] font-bold max-w-xs opacity-70">
                       Input your content and activate enhancement protocol to see the magic.
                     </p>
                   </div>
                )}

                {isEnhancing && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-20 bg-indigo-500 animate-pulse"></div>
                     <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/10 mb-8">
                        <Sparkles className="w-10 h-10 text-indigo-500 animate-float" />
                     </div>
                     <div className="space-y-4 w-full max-w-xs">
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-full animate-pulse"></div>
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-4/5 animate-pulse delay-75"></div>
                        <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-3/4 animate-pulse delay-150"></div>
                     </div>
                   </div>
                )}

                {enhancedPost && !isEnhancing && (
                   <div className="p-8 flex-1 overflow-y-auto custom-scrollbar text-[16px] text-slate-700 dark:text-slate-200 leading-[1.8] whitespace-pre-wrap font-bold opacity-90 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                     {enhancedPost}
                   </div>
                )}
              </div>

              {/* Output Footer */}
              <div className="px-8 py-6 bg-white/30 dark:bg-black/10 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[12px] font-black text-slate-400 tracking-widest">
                  <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {enhancedPost.split(/\s+/).filter(w => w.length > 0).length} WORDS</span>
                  <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> {enhancedPost.length} CHARS</span>
                </div>
                {enhancedPost.length > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Optimized</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEnhancer;
