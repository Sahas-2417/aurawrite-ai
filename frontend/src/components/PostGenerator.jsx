import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Copy, Check, Sparkles, Hash, Smile, Briefcase, Sun, FileText, Download, Edit2, BarChart2, Brain, Zap, Terminal, Award } from 'lucide-react';
import { generatePost } from '../services/api';
import { cn } from '../utils';
import { notify } from '../toastConfig';

const TONES = [
  { id: 'Professional', icon: Briefcase },
  { id: 'Inspirational', icon: Sun },
  { id: 'Casual', icon: Smile },
  { id: 'Informative', icon: FileText }
];

const LENGTHS = [
  { id: 'Short', desc: '~ 80 words' },
  { id: 'Medium', desc: '~ 120 words' },
  { id: 'Long', desc: '~ 200 words' }
];

const LOADING_MESSAGES = [
  { text: "Analyzing your ideas...", icon: Brain },
  { text: "Crafting engaging content...", icon: Edit2 },
  { text: "Optimizing for LinkedIn engagement...", icon: BarChart2 },
  { text: "Adding professional polish...", icon: Sparkles },
  { text: "Fine-tuning your post...", icon: Zap },
];

const PostGenerator = ({ seedIdea, clearSeedIdea }) => {
  const [bulletPoints, setBulletPoints] = useState('');
  const [tone, setTone] = useState('Professional');

  useEffect(() => {
    if (seedIdea) {
      setBulletPoints(seedIdea);
      clearSeedIdea();
    }
  }, [seedIdea, clearSeedIdea]);
  const [length, setLength] = useState('Medium');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPost, setGeneratedPost] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const loadingInterval = useRef(null);

  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    setCharCount(bulletPoints.length);
    setWordCount(bulletPoints.trim() === '' ? 0 : bulletPoints.trim().split(/\s+/).length);
  }, [bulletPoints]);

  // Rotate loading messages during generation
  useEffect(() => {
    if (isGenerating) {
      setLoadingMsgIndex(0);
      loadingInterval.current = setInterval(() => {
        setLoadingMsgIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    } else {
      clearInterval(loadingInterval.current);
    }
    return () => clearInterval(loadingInterval.current);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!bulletPoints.trim()) {
      notify.error('Missing input', 'Please enter some bullet points or ideas.');
      return;
    }
    setIsGenerating(true);
    setGeneratedPost('');
    setShowResult(false);

    try {
      const result = await generatePost({
        bullet_points: bulletPoints,
        tone,
        length,
        include_hashtags: includeHashtags,
        include_emojis: includeEmojis,
      });
      setGeneratedPost(result.post);
      // Trigger smooth reveal after a tiny delay
      setTimeout(() => setShowResult(true), 100);
      
      // Auto-save to history
      const savedPosts = JSON.parse(localStorage.getItem('saved_posts') || '[]');
      const newPost = {
        id: Date.now().toString(),
        text: result.post,
        bulletPoints,
        tone,
        length,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('saved_posts', JSON.stringify([newPost, ...savedPosts]));
      
      notify.generated();
    } catch (err) {
      notify.error('Generation failed', err.message || 'Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedPost) {
      navigator.clipboard.writeText(generatedPost);
      setCopied(true);
      notify.copy();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    setSaved(true);
    notify.success('Saved!', 'Post saved successfully to your library.');
    setTimeout(() => setSaved(false), 2000);
  };

  const generatedWordCount = generatedPost.trim() === '' ? 0 : generatedPost.trim().split(/\s+/).length;
  const generatedCharCount = generatedPost.length;

  return (
    <div className="flex flex-col relative text-slate-800 dark:text-slate-200 transition-colors duration-500">
      {/* Premium Hero Section */}
      <header className="relative px-4 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 shrink-0">
        {/* Animated Aurora Gradient Glow — contained to prevent corner bleed */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-t-[2.5rem] md:rounded-t-[2rem]">
          <div 
            className="absolute top-[-10%] left-[5%] w-[250px] md:w-[400px] h-[250px] rounded-full blur-[80px] md:blur-[100px] opacity-25 dark:opacity-15 animate-aurora"
            style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1, #8b5cf6, #c084fc)', backgroundSize: '300% 300%' }}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
          {/* Left — Branding & Typography */}
          <div className="group cursor-default max-w-2xl">
            {/* AuraWrite AI Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/15 border border-purple-300/30 dark:border-purple-500/20 mb-3 md:mb-4 backdrop-blur-sm group/badge hover:bg-purple-500/15 dark:hover:bg-purple-500/20 transition-all duration-500">
              <div className="relative">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></div>
              </div>
              <span className="text-[10px] md:text-[11px] font-black tracking-widest uppercase text-purple-600 dark:text-purple-300">AuraWrite AI</span>
            </div>

            {/* Main Heading with Animated Gradient Text */}
            <h2 className="text-[26px] md:text-[36px] font-extrabold tracking-tight leading-[1.2] mb-2 md:mb-3 transition-all duration-500">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-purple-900 to-slate-800 dark:from-white dark:via-purple-200 dark:to-slate-300 animate-text-shine" style={{ backgroundSize: '200% auto' }}>
                Create content that
              </span>
              <br className="hidden md:block" />
              <span className="relative inline-flex flex-wrap items-center gap-2 md:gap-3">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-500 to-violet-600 dark:from-purple-400 dark:via-indigo-400 dark:to-violet-400 animate-text-shine" style={{ backgroundSize: '200% auto' }}>
                  captivates & converts
                </span>
                <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-purple-500 dark:text-purple-400 fill-purple-500/10 group-hover:rotate-12 transition-all duration-700 ease-out" />
              </span>
            </h2>

            {/* Subtitle with premium feel */}
            <p className="text-[14px] md:text-[15px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed transition-all duration-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 max-w-lg">
              Transform your bullet points into powerful LinkedIn posts — 
              <span className="text-purple-600/80 dark:text-purple-400/80"> powered by AI</span>, crafted for engagement.
            </p>
          </div>


        </div>

        {/* Bottom fade-out line accent */}
        <div className="absolute bottom-0 left-4 md:left-8 right-4 md:right-8 h-px bg-gradient-to-r from-transparent via-purple-300/30 dark:via-purple-500/20 to-transparent"></div>
      </header>

      {/* Main Content Layout */}
      <div className="px-4 md:px-8 pb-8 flex flex-col mt-4">
        <div className="grid lg:grid-cols-12 gap-6 md:gap-8 flex-1 mb-8">
          
          {/* Left Column - Inputs */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Bullet Points */}
            <div className="group">
              <div className="flex items-center justify-between mb-3 px-1">
                <label className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 uppercase text-[12px] tracking-widest opacity-80">
                  <Edit2 className="w-3.5 h-3.5 text-purple-500 group-hover:rotate-12 transition-transform duration-300" />
                  Your Ideas
                </label>
                <button 
                  onClick={() => setBulletPoints('')}
                  className="text-[11px] font-bold text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-wider"
                >
                  Clear All
                </button>
              </div>
              <div className="relative">
                <textarea
                  value={bulletPoints}
                  onChange={(e) => setBulletPoints(e.target.value)}
                  placeholder="• Completed YOLOv8 internship project&#10;• Learned Roboflow and model training..."
                  className="w-full h-[220px] glass-card rounded-[1.5rem] p-6 text-slate-700 dark:text-slate-200 placeholder-slate-400/60 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400/50 transition-all duration-300 resize-none text-[15px] leading-relaxed shadow-sm hover:shadow-md"
                />
                <div className="absolute bottom-4 right-5 text-[10px] font-black text-slate-400/80 bg-white/50 dark:bg-slate-800/50 px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/10">
                  {bulletPoints.split('\n').filter(l => l.trim().length > 0).length} / 15 BULLETS
                </div>
              </div>
            </div>

            {/* Tone */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 mb-3 block uppercase text-[12px] tracking-widest opacity-80 px-1">Choose a Tone</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TONES.map(t => {
                  const active = tone === t.id;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={cn(
                        "flex flex-col items-center justify-center py-3.5 px-1 rounded-2xl border-2 transition-all duration-500 hover-lift",
                        active 
                          ? "bg-white dark:bg-slate-800 border-purple-500/50 shadow-xl shadow-purple-500/10 ring-4 ring-purple-500/5" 
                          : "bg-white/40 dark:bg-slate-800/40 border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400"
                      )}
                    >
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition-all duration-300",
                        active ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30 rotate-3" : "bg-white/80 dark:bg-slate-700/50 text-slate-400"
                      )}>
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider">{t.id}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Length */}
            <div>
              <label className="font-bold text-slate-800 dark:text-slate-200 mb-3 block uppercase text-[12px] tracking-widest opacity-80 px-1">Post Length</label>
              <div className="flex gap-3">
                {LENGTHS.map(l => {
                  const active = length === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setLength(l.id)}
                      className={cn(
                        "flex-1 flex flex-col items-center py-3 rounded-2xl border-2 transition-all duration-500 hover-lift",
                        active
                          ? "bg-white dark:bg-slate-800 border-purple-500/50 shadow-xl shadow-purple-500/10 ring-4 ring-purple-500/5"
                          : "bg-white/40 dark:bg-slate-800/40 border-slate-100 dark:border-white/5 text-slate-500 dark:text-slate-400"
                      )}
                    >
                      <span className="text-[13px] font-black tracking-tight">{l.id}</span>
                      <span className={cn("text-[10px] font-bold uppercase tracking-tighter opacity-60", active ? "text-purple-500" : "")}>{l.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Options */}
            <div className="glass-card rounded-[1.5rem] p-2 shadow-sm space-y-1">
              {/* Hashtags Toggle */}
              <label className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 rounded-xl transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                    includeHashtags ? "bg-purple-500/15 text-purple-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  )}>
                    <Hash className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Generate Hashtags</span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{includeHashtags ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeHashtags}
                  onClick={() => setIncludeHashtags(!includeHashtags)}
                  className={cn(
                    "relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
                    includeHashtags
                      ? "bg-purple-500 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_24px_rgba(168,85,247,0.15)]"
                      : "bg-slate-200 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    includeHashtags ? "translate-x-[26px] scale-105" : "translate-x-[3px] scale-100"
                  )} />
                </button>
              </label>

              {/* Thin separator */}
              <div className="mx-4 h-px bg-slate-100 dark:bg-white/5"></div>

              {/* Emojis Toggle */}
              <label className="flex items-center justify-between px-4 py-3.5 cursor-pointer hover:bg-white/50 dark:hover:bg-white/5 rounded-xl transition-all duration-300 group">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                    includeEmojis ? "bg-purple-500/15 text-purple-500" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  )}>
                    <Smile className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Add Emojis</span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{includeEmojis ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeEmojis}
                  onClick={() => setIncludeEmojis(!includeEmojis)}
                  className={cn(
                    "relative inline-flex h-7 w-[52px] shrink-0 items-center rounded-full border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
                    includeEmojis
                      ? "bg-purple-500 border-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.4),0_0_24px_rgba(168,85,247,0.15)]"
                      : "bg-slate-200 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    includeEmojis ? "translate-x-[26px] scale-105" : "translate-x-[3px] scale-100"
                  )} />
                </button>
              </label>
            </div>

            {/* Generate Button */}
            <div className="relative mt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !bulletPoints.trim()}
                className={cn(
                  "relative w-full text-white font-black py-4.5 rounded-[1.2rem] transition-all duration-500 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-2xl overflow-hidden",
                  isGenerating 
                    ? "bg-slate-900 dark:bg-white dark:text-slate-900"
                    : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] shadow-purple-500/25"
                )}
              >
                {/* Dynamic Shine */}
                {!isGenerating && (
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite]"></div>
                )}
                
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="animate-in fade-in slide-in-from-bottom-2" key={loadingMsgIndex}>
                      {LOADING_MESSAGES[loadingMsgIndex].text}
                    </span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Craft My Post
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Output */}
          <div className="lg:col-span-7 flex flex-col min-h-[500px]">
            <div className="glass-card rounded-[2rem] flex-1 flex flex-col shadow-2xl shadow-purple-500/5 relative overflow-hidden group/output">
              
              {/* Output Header */}
              <div className="px-8 py-6 flex items-center justify-between border-b border-white/5">
                <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2.5 text-[17px] tracking-tight">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  Output Console
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    disabled={!generatedPost}
                    className="flex items-center gap-2 text-[12px] font-black text-slate-600 dark:text-slate-200 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-30"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'COPIED' : 'COPY'}
                  </button>
                </div>
              </div>

              {/* Output Content */}
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col relative">
                {generatedPost || isGenerating ? (
                  <div className="flex-1 flex flex-col">
                    <div className="mb-8 flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-4 duration-500">
                      <div className="px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/10 text-[11px] font-black text-purple-600 dark:text-purple-300 uppercase tracking-widest">
                        {tone} TONE
                      </div>
                      <div className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/10 text-[11px] font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">
                        {length} FORMAT
                      </div>
                    </div>
                    {isGenerating ? (
                      <div className="flex-1 flex flex-col items-center justify-center relative py-12">
                        <div className="relative mb-10">
                          <div className="absolute -inset-8 rounded-full bg-purple-500/20 blur-[40px] animate-pulse"></div>
                          <div className="relative w-20 h-20 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center shadow-2xl border border-white/20">
                            <Brain className="w-10 h-10 text-purple-500 animate-float-slow" />
                          </div>
                        </div>
                        <div className="space-y-4 w-full max-w-sm">
                           {LOADING_MESSAGES.map((msg, idx) => (
                             <div 
                              key={idx} 
                              className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all duration-700",
                                idx === loadingMsgIndex ? "bg-white dark:bg-slate-800 border-purple-500/30 shadow-lg scale-[1.02]" : idx < loadingMsgIndex ? "bg-emerald-500/5 border-emerald-500/10 opacity-60" : "bg-transparent border-transparent opacity-20"
                              )}>
                               <div className={cn("w-6 h-6 rounded-full flex items-center justify-center", idx <= loadingMsgIndex ? "bg-purple-500/20" : "")}>
                                  {idx < loadingMsgIndex ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>}
                               </div>
                               <span className="text-[13px] font-bold tracking-tight">{msg.text}</span>
                             </div>
                           ))}
                        </div>
                      </div>
                    ) : (
                      <div className={cn(
                        "flex-1 text-[16px] text-slate-700 dark:text-slate-200 leading-[1.8] whitespace-pre-wrap font-medium transition-all duration-1000",
                        showResult ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      )}>
                        {generatedPost}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-6">
                    <div className="relative mb-8 group-hover/output:scale-110 transition-transform duration-700">
                      <div className="absolute -inset-10 bg-purple-500/10 rounded-full blur-[50px] animate-pulse-slow"></div>
                      <div className="relative w-24 h-24 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center shadow-xl border border-white/10">
                        <Terminal className="w-10 h-10 text-slate-200 dark:text-slate-700" />
                      </div>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 dark:text-white mb-2 tracking-tight">System Ready</h4>
                    <p className="text-slate-400 dark:text-slate-500 text-[14px] font-medium leading-relaxed max-w-xs">
                      Awaiting content triggers. Input your bullet points to begin the neural generation process.
                    </p>
                  </div>
                )}
              </div>

              {/* Output Footer */}
              <div className="px-8 py-6 bg-white/30 dark:bg-black/10 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4 text-[12px] font-bold text-slate-400 tracking-wider">
                  <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {generatedWordCount} WORDS</span>
                  <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> {generatedCharCount} CHARS</span>
                </div>
                {generatedWordCount > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Optimal Length</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Features Row */}
        <div className="glass-card rounded-[2rem] p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shrink-0 shadow-lg relative overflow-hidden">
           {/* Background accents */}
           <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
           <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
           <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>

          {[
            { title: "Neural Engine", desc: "Advanced AI models", icon: Sparkles, color: "text-purple-500" },
            { title: "Network Growth", desc: "Maximized engagement", icon: BarChart2, color: "text-indigo-500" },
            { title: "Speed Core", desc: "Instant generation", icon: Zap, color: "text-amber-500" },
            { title: "Master Class", desc: "Professional polish", icon: Award, color: "text-emerald-500" }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div key={idx} className="flex items-center gap-4 group hover-lift p-2 rounded-2xl transition-all">
                <div className={cn(
                  "w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-white/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:rotate-3",
                  feat.color.replace('text', 'bg') + '/10'
                )}>
                  <Icon className={cn("w-6 h-6", feat.color)} />
                </div>
                <div>
                  <h4 className="text-[14px] font-black text-slate-800 dark:text-white tracking-tight">{feat.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter opacity-60 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default PostGenerator;
