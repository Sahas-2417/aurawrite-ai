import React, { useState } from 'react';
import { Lightbulb, Sparkles, Copy, Check, TrendingUp, Target, Loader2, Cpu, Briefcase, Rocket, Clock, Laptop, Zap, ArrowRight, Brain, Search, Terminal, Globe, Award } from 'lucide-react';
import { notify } from '../toastConfig';
import { generateIdeas } from '../services/api';
import { cn } from '../utils';

const CATEGORIES = [
  { id: 'AI', icon: Cpu, desc: 'Trends & thoughts', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'Career', icon: Rocket, desc: 'Advice & growth', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 'Tech', icon: Laptop, desc: 'Dev & engineering', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'Leadership', icon: Award, desc: 'Management tips', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'Productivity', icon: Zap, desc: 'Hacks & routines', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
];

const LOADING_STEPS = [
  "Scanning global trends...",
  "Identifying viral patterns...",
  "Extracting high-engagement hooks...",
  "Finalizing content concepts..."
];

const AIIdeas = ({ onUseIdea }) => {
  const [selectedCategory, setSelectedCategory] = useState('AI');
  const [isGenerating, setIsGenerating] = useState(false);
  const [ideasData, setIdeasData] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIdeasData(null);
    setLoadingStep(0);
    
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const result = await generateIdeas(selectedCategory);
      setIdeasData(result);
      notify.ideas();
    } catch (error) {
      notify.error('Generation failed', error.message || 'Failed to generate ideas.');
    } finally {
      clearInterval(stepInterval);
      setIsGenerating(false);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    notify.copy();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col relative text-slate-800 dark:text-slate-200 transition-colors duration-500">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-amber-500/10 dark:bg-amber-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="relative px-4 md:px-8 pt-6 md:pt-8 pb-6 md:pb-10 shrink-0 z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] md:text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 w-fit">
              <Brain className="w-3 h-3" />
              Strategic Console
            </div>
          </div>
          <h2 className="text-[26px] md:text-[34px] font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight transition-colors duration-500">
            Intelligence Hub
            <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
          </h2>
          <p className="text-[14px] md:text-[15px] text-slate-500 dark:text-slate-400 font-bold transition-colors duration-500 max-w-lg opacity-80">
            Scanning the digital landscape for high-velocity trends and viral hooks.
          </p>
        </div>


      </header>

      <div className="px-4 md:px-8 pb-12 relative z-10">
        <div className="flex flex-col gap-8 md:gap-12">
          
          {/* Category Selection */}
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-[12px] font-black text-slate-400 dark:text-slate-500 mb-5 flex items-center gap-2 uppercase tracking-widest opacity-80 px-1">
              <Search className="w-3.5 h-3.5 text-amber-500" />
              Vertical Exploration
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
              {CATEGORIES.map((cat, i) => {
                const active = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "group glass-card hover-lift relative flex flex-col items-center text-center p-6 md:p-8 rounded-[2rem] border-2 transition-all duration-500 overflow-hidden shadow-lg",
                      active 
                        ? "bg-white dark:bg-slate-800 border-amber-500/50 shadow-xl shadow-amber-500/10 ring-4 ring-amber-500/5" 
                        : "bg-white/40 dark:bg-slate-800/40 border-slate-100 dark:border-white/5"
                    )}
                  >
                    {active && <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent animate-pulse"></div>}
                    <div className={cn(
                      "w-12 h-12 rounded-[1.2rem] flex items-center justify-center mb-4 transition-all duration-500",
                      active ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30 rotate-3" : cn(cat.bg, cat.color, "group-hover:scale-110")
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={cn("text-[14px] md:text-[15px] font-black tracking-tight mb-1 transition-colors", active ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300")}>{cat.id}</span>
                    <span className="text-[10px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-tight uppercase tracking-tighter">{cat.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center py-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="group relative w-full sm:w-auto px-10 md:px-14 py-4.5 md:py-5.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-base md:text-lg rounded-[1.5rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-500 disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {/* Shimmer */}
              {!isGenerating && <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_infinite]"></div>}
              
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> SCANNING ENGINE...</>
                ) : (
                  <><Zap className="w-5 h-5 md:w-6 md:h-6" /> INITIATE INTELLIGENCE</>
                )}
              </span>
            </button>
          </div>

          {/* Results Grid */}
          <div className="min-h-[400px]">
            {isGenerating ? (
              <div className="py-12 md:py-24 flex flex-col items-center justify-center relative">
                {/* Background aurora */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] opacity-20 dark:opacity-30 bg-gradient-to-tr from-amber-500 to-orange-500 animate-pulse-slow"></div>
                
                <div className="relative mb-12">
                   <div className="w-24 h-24 md:w-32 md:h-32 glass-card rounded-[2.5rem] border-2 border-amber-500/30 flex items-center justify-center relative shadow-2xl">
                     <Brain className="w-10 h-10 md:w-14 md:h-14 text-amber-500 animate-float" />
                   </div>
                   <div className="absolute -inset-4 rounded-full border-2 border-amber-500/10 animate-pulse-ring"></div>
                </div>
                
                <div className="space-y-4 w-full max-w-sm relative z-10">
                   {LOADING_STEPS.map((step, idx) => (
                     <div 
                      key={idx} 
                      className={cn(
                        "flex items-center gap-4 px-5 py-3.5 rounded-2xl border-2 transition-all duration-700",
                        idx === loadingStep ? "bg-white dark:bg-slate-800 border-amber-500/30 shadow-lg scale-[1.02]" : idx < loadingStep ? "bg-emerald-500/5 border-emerald-500/10 opacity-60" : "bg-transparent border-transparent opacity-20"
                      )}>
                       <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", idx <= loadingStep ? "bg-amber-500/20" : "")}>
                          {idx < loadingStep ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>}
                       </div>
                       <span className="text-[14px] font-black tracking-tight uppercase tracking-widest">{step}</span>
                     </div>
                   ))}
                </div>
              </div>
            ) : ideasData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                
                {/* Concepts Column */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-purple-500/5 border border-purple-500/10 w-fit">
                    <Lightbulb className="w-4 h-4 text-purple-500" />
                    <h3 className="font-black text-[13px] tracking-widest uppercase text-purple-600 dark:text-purple-400">Strategy Concepts</h3>
                  </div>
                  <div className="space-y-6">
                    {ideasData.post_ideas?.map((idea, idx) => (
                      <div key={idx} className="group glass-card hover-lift rounded-[2rem] p-7 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/5 to-transparent"></div>
                        <h4 className="font-black text-[16px] text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">{idea.title}</h4>
                        <p className="text-[13px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-8 opacity-80">{idea.description}</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => onUseIdea(`${idea.title}\n\n${idea.description}`)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[12px] font-black rounded-xl transition-all duration-300 uppercase tracking-widest hover:scale-[1.02] shadow-lg"
                          >
                            Use Idea <ArrowRight className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleCopy(`idea-${idx}`, `${idea.title}\n\n${idea.description}`)}
                            className="p-3 bg-white/50 dark:bg-slate-700/50 text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 rounded-xl transition-all duration-300 border border-slate-100 dark:border-white/5 shadow-sm"
                          >
                            {copiedId === `idea-${idx}` ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Viral Hooks Column */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 w-fit">
                    <Target className="w-4 h-4 text-indigo-500" />
                    <h3 className="font-black text-[13px] tracking-widest uppercase text-indigo-600 dark:text-indigo-400">Viral Entry Hooks</h3>
                  </div>
                  <div className="space-y-6">
                    {ideasData.hooks?.map((hook, idx) => (
                      <div key={idx} className="group glass-card hover-lift rounded-[2rem] p-7 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent"></div>
                        <p className="text-[15px] font-black text-slate-800 dark:text-slate-200 leading-relaxed italic mb-8 tracking-tight">"{hook}"</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => onUseIdea(hook)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white text-[12px] font-black rounded-xl transition-all duration-300 uppercase tracking-widest hover:scale-[1.02] shadow-lg shadow-indigo-500/20"
                          >
                            Apply Hook <ArrowRight className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleCopy(`hook-${idx}`, hook)}
                            className="p-3 bg-white/50 dark:bg-slate-700/50 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 rounded-xl transition-all duration-300 border border-slate-100 dark:border-white/5 shadow-sm"
                          >
                            {copiedId === `hook-${idx}` ? <Check className="w-4.5 h-4.5 text-emerald-500" /> : <Copy className="w-4.5 h-4.5" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hot Topics Column */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 w-fit">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-black text-[13px] tracking-widest uppercase text-emerald-600 dark:text-emerald-400">trending verticals</h3>
                  </div>
                  <div className="space-y-4">
                    {ideasData.trending_topics?.map((topic, idx) => (
                      <div key={idx} className="group glass-card hover-lift flex items-center justify-between rounded-2xl px-7 py-5 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500/50"></div>
                        <div className="flex items-center gap-3 relative z-10">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                          <span className="text-[14px] md:text-[15px] font-black text-slate-800 dark:text-slate-100 tracking-tight">{topic}</span>
                        </div>
                        <div className="flex items-center gap-3 relative z-10">
                          <button 
                            onClick={() => handleCopy(`topic-${idx}`, topic)}
                            className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                          >
                            {copiedId === `topic-${idx}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => onUseIdea(topic)}
                            className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all duration-300"
                          >
                            <ArrowRight className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center px-4 glass-card border-dashed border-2 rounded-[3rem] shadow-2xl shadow-amber-500/5">
                 <div className="relative mb-10 group cursor-default">
                    <div className="absolute -inset-10 bg-amber-500/10 rounded-full blur-[50px] animate-pulse-slow"></div>
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl relative transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                       <Terminal className="w-10 h-10 md:w-14 md:h-14 text-slate-200 dark:text-slate-700" />
                    </div>
                 </div>
                 <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Intelligence Standby</h3>
                 <p className="text-[15px] text-slate-500 dark:text-slate-400 font-bold max-w-sm leading-relaxed opacity-70">
                   Awaiting neural exploration. Select a strategic vertical above to scan for viral opportunities.
                 </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIdeas;
