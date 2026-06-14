"use client";

import { useState } from 'react';
import PageHero from '@/src/components/PageHero';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight, Search, X } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" }
  }
};

interface TopicItem {
  _id: string;
  name: string;
  description: string;
  resolvedImage: string;
  moduleCount: number;
}

export default function TopicsClient({ topics }: { topics: TopicItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const q = searchQuery.toLowerCase().trim();

  const filtered = q
    ? topics.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    : topics;

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        eyebrow="Interactive Directory"
        title="The Forensics Hub"
        description="Browse our comprehensive peer-reviewed directory of forensic protocols, articles, and research modules."
      />

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-8 relative z-20">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all shadow-sm"
          />
          {q && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {q && (
          <p className="text-center text-sm text-slate-400 font-light mt-3">
            {filtered.length === 0 ? 'No topics found' : `${filtered.length} topic${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        )}
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filtered.map((topic, i) => (
          <motion.div
            key={topic._id || i}
            variants={cardVariants}
            className="card-panel group cursor-pointer flex flex-col p-0 h-[380px]"
          >
            {/* Image section */}
            <div className="relative h-44 w-full overflow-hidden shrink-0 bg-white">
              <img 
                src={topic.resolvedImage || `https://images.unsplash.com/photo-1544648156-5388451882c5?auto=format&fit=crop&q=80`} 
                alt={topic.name || "Topic"} 
                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-60" />
              <div className="absolute top-4 right-4 bg-white/90 border border-slate-200 backdrop-blur-xl px-3 py-1 rounded-full shadow-sm">
                <span className="text-[10px] font-bold text-slate-900">#{(i + 1).toString().padStart(2, '0')}</span>
              </div>
            </div>

            {/* Content section */}
            <div className="p-6 flex-1 flex flex-col min-h-0">
              <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-accent transition-colors mb-2 leading-tight">
                {topic.name || "Loading..."}
              </h3>

              {/* 2-line description with gradient fade */}
              <div className="relative flex-1 overflow-hidden">
                <p className="text-slate-600 font-light text-sm leading-relaxed line-clamp-2 relative z-0">
                  {topic.description || "..."}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
              </div>

              <div className="flex items-center justify-between pt-5 mt-auto border-t border-slate-100 shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                  {topic.moduleCount || 0} Modules
                </span>
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-all duration-500">
                   <ArrowUpRight className="w-4 h-4 translate-x-[1px] translate-y-[-1px] group-hover:translate-x-0 group-hover:translate-y-0" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty state when no results */}
      {q && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm font-light">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
