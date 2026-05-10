import React, { useState, useEffect, useMemo } from 'react';
import { Copy, Check, Trash2, Folder, Calendar, Search, Filter, Sparkles, FileText, BarChart3, Clock, ArrowRight, Layout, Zap, ChevronDown, ListFilter, SortAsc, SortDesc, X } from 'lucide-react';
import { notify } from '../toastConfig';
import { cn } from '../utils';

const MyPosts = ({ setActiveTab }) => {
  const [posts, setPosts] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTone, setFilterTone] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('saved_posts');
      const saved = raw ? JSON.parse(raw) : [];
      setPosts(Array.isArray(saved) ? saved : []);
    } catch (e) {
      console.error('Error parsing saved posts from localStorage:', e);
      setPosts([]);
      notify.error('Load failed', 'Could not load saved posts. Data might be corrupted.');
    }
  }, []);

  const availableTones = useMemo(() => {
    if (!Array.isArray(posts)) return ['All'];
    const tones = new Set(posts.map(p => p?.tone).filter(Boolean));
    return ['All', ...Array.from(tones)];
  }, [posts]);

  // Statistics calculation
  const stats = useMemo(() => {
    if (!posts.length) return { total: 0, favoriteTone: 'N/A', totalWords: 0 };
    
    const tones = posts.reduce((acc, p) => {
      acc[p.tone] = (acc[p.tone] || 0) + 1;
      return acc;
    }, {});
    
    const favoriteTone = Object.entries(tones).sort((a, b) => b[1] - a[1])[0][0];
    const totalWords = posts.reduce((acc, p) => acc + (p.text?.split(/\s+/).length || 0), 0);
    
    return {
      total: posts.length,
      favoriteTone,
      totalWords
    };
  }, [posts]);

  const sortedAndFilteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];
    
    let result = posts.filter(post => {
      if (!post) return false;
      const textMatches = post.text?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const bulletMatches = post.bulletPoints?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const matchesSearch = textMatches || bulletMatches;
      const matchesTone = filterTone === 'All' || post.tone === filterTone;
      return matchesSearch && matchesTone;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'Newest') return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === 'Oldest') return new Date(a.timestamp) - new Date(b.timestamp);
      if (sortBy === 'Longest') return b.text.length - a.text.length;
      return 0;
    });
  }, [posts, searchQuery, filterTone, sortBy]);

  const handleDelete = (id) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    localStorage.setItem('saved_posts', JSON.stringify(updated));
    notify.deleted();
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    notify.copy();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col relative text-slate-800 dark:text-slate-200 transition-colors duration-500">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Premium Header */}
      <header className="relative px-4 md:px-8 pt-6 md:pt-8 pb-6 md:pb-10 shrink-0 overflow-hidden z-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 md:gap-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[10px] md:text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest flex items-center gap-1.5 w-fit">
                <Layout className="w-3 h-3" />
                Vault Console
              </div>
            </div>
            <h2 className="text-[26px] md:text-[34px] font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight transition-colors duration-500">
              Content Library
              <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
            </h2>
            <p className="text-[14px] md:text-[15px] text-slate-500 dark:text-slate-400 font-bold transition-colors duration-500 max-w-lg opacity-80">
              Your personal archive of high-performance AI generated content.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">

            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 w-full lg:w-auto">
            {[
              { label: 'Archive Size', value: stats.total, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: 'Prime Tone', value: stats.favoriteTone, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
              { label: 'Word Count', value: stats.totalWords, icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
            ].map((stat, i) => (
              <div key={i} className="glass-card hover-lift rounded-[1.5rem] p-4 md:p-5 min-w-[120px] md:min-w-[140px] shadow-lg group">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={cn("p-2 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6", stat.bg)}>
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                  </div>
                  <span className="text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-lg md:text-xl font-black text-slate-800 dark:text-white truncate tracking-tight">{stat.value}</div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </header>

      {/* Controls Bar: Search, Filter, Sort */}
      <div className="px-4 md:px-8 pb-6 md:pb-8 shrink-0 flex flex-col md:flex-row gap-3 md:gap-4 relative z-20">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Filter by keyword or bullet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 md:py-4 bg-white/40 dark:bg-slate-800/40 border-2 border-slate-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/50 text-[15px] font-bold text-slate-700 dark:text-slate-200 placeholder-slate-400/60 transition-all duration-500 backdrop-blur-xl shadow-sm outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {/* Filter Tone */}
          <div className="relative group flex-1 md:flex-none">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <ListFilter className="h-4 w-4 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
            </div>
            <select
              value={filterTone}
              onChange={(e) => setFilterTone(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 md:py-4 bg-white/40 dark:bg-slate-800/40 border-2 border-slate-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/50 text-[14px] font-black text-slate-700 dark:text-slate-200 appearance-none transition-all duration-500 backdrop-blur-xl outline-none cursor-pointer md:min-w-[160px] shadow-sm"
            >
              {availableTones.map(tone => (
                <option key={tone} value={tone} className="dark:bg-slate-900 font-bold">{tone === 'All' ? 'ALL TONES' : tone.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div className="relative group flex-1 md:flex-none">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {sortBy === 'Longest' ? <BarChart3 className="h-4 w-4 text-slate-400" /> : <Clock className="h-4 w-4 text-slate-400" />}
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 md:py-4 bg-white/40 dark:bg-slate-800/40 border-2 border-slate-100 dark:border-white/5 rounded-2xl focus:ring-4 focus:ring-purple-500/5 focus:border-purple-500/50 text-[14px] font-black text-slate-700 dark:text-slate-200 appearance-none transition-all duration-500 backdrop-blur-xl outline-none cursor-pointer md:min-w-[160px] shadow-sm"
            >
              <option value="Newest" className="dark:bg-slate-900 font-bold">NEWEST</option>
              <option value="Oldest" className="dark:bg-slate-900 font-bold">OLDEST</option>
              <option value="Longest" className="dark:bg-slate-900 font-bold">LONGEST</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 md:px-8 pb-12 relative z-10">
        {posts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-6 md:mt-12 py-16 md:py-24 glass-card border-dashed border-2 rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-700 shadow-2xl shadow-purple-500/5">
             <div className="relative mb-10">
               <div className="absolute -inset-10 bg-purple-500/10 rounded-full blur-[50px] animate-pulse-slow"></div>
               <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
                 <Folder className="w-10 h-10 md:w-14 md:h-14 text-slate-200 dark:text-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" />
               </div>
             </div>
             <h3 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-3 tracking-tight">Your vault is empty</h3>
             <p className="text-sm md:text-[16px] text-slate-500 dark:text-slate-400 font-bold max-w-sm mb-10 leading-relaxed px-4 opacity-70">
               Start generating high-impact posts to populate your professional content archive.
             </p>
             <button 
               onClick={() => setActiveTab('Dashboard')}
               className="group relative flex items-center gap-3 px-8 md:px-10 py-4 md:py-4.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-2xl hover:scale-[1.05] active:scale-95 transition-all duration-300"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <span className="relative z-10 flex items-center gap-3">
                  INITIATE CREATION
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
             </button>
          </div>
        ) : sortedAndFilteredPosts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center mt-12 md:mt-20 animate-in fade-in duration-700">
             <div className="w-20 h-20 bg-white/50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-xl">
               <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
             </div>
             <h3 className="text-xl font-black text-slate-700 dark:text-white mb-2 tracking-tight">Zero Matches Found</h3>
             <p className="text-[14px] text-slate-500 dark:text-slate-400 font-bold opacity-60">
               Try refining your search parameters or clearing filters.
             </p>
             <button 
               onClick={() => {setSearchQuery(''); setFilterTone('All');}}
               className="mt-6 text-[13px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest hover:underline underline-offset-8"
             >
               Reset All Filters
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {sortedAndFilteredPosts.map((post, index) => (
              <div 
                key={post.id} 
                className="group glass-card hover-lift rounded-[2.5rem] p-8 shadow-2xl shadow-purple-500/5 relative flex flex-col animate-in fade-in slide-in-from-bottom-6 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                {/* Background Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[1.5s]"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/10 text-[10px] font-black text-purple-600 dark:text-purple-300 uppercase tracking-widest">
                      {post.tone}
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/10 text-[10px] font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">
                      {post.length}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-80">
                      <Clock className="w-3 h-3" />
                      {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 mb-8 text-[15px] text-slate-700 dark:text-slate-200 leading-[1.8] whitespace-pre-wrap font-bold opacity-80 relative z-10 line-clamp-6 group-hover:line-clamp-none transition-all duration-700">
                  {post.text}
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between relative z-10">
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-3 text-slate-400 hover:text-red-500 dark:text-slate-600 dark:hover:text-red-400 hover:bg-red-500/5 rounded-2xl transition-all duration-300 active:scale-90"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                  
                  <button
                    onClick={() => handleCopy(post.id, post.text)}
                    className="flex items-center gap-2.5 text-[12px] font-black text-white bg-slate-900 dark:bg-slate-800 hover:bg-purple-600 dark:hover:bg-purple-600 px-6 py-3 rounded-2xl transition-all duration-300 shadow-xl active:scale-95 group/copy"
                  >
                    {copiedId === post.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 group-hover/copy:scale-110 transition-transform" />
                    )}
                    {copiedId === post.id ? 'COPIED' : 'COPY CONTENT'}
                  </button>
                </div>

                {/* Staggered accent dot */}
                <div className="absolute top-8 right-8 w-1.5 h-1.5 rounded-full bg-purple-500/20 group-hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all duration-500"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;
