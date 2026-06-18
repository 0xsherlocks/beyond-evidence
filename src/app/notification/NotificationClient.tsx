"use client";

import { useState } from 'react';
import PageHero from '@/src/components/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Search, Filter, Briefcase, GraduationCap, FileSignature, Award, Calendar, Layers } from 'lucide-react';
import type { FeedItem } from '@/src/lib/fetchRss';

interface NotificationClientProps {
  title: string;
  description: string;
  dfssVacancies: any[];
  feedItems: FeedItem[];
}

const CATEGORIES = ['All', 'Jobs', 'Internships', 'Exams', 'Scholarships', 'Workshops', 'Other'];

const categoryIcons: Record<string, any> = {
  Jobs: Briefcase,
  Internships: GraduationCap,
  Exams: FileSignature,
  Scholarships: Award,
  Workshops: Calendar,
  Other: Layers
};

export default function NotificationClient({ title, description, dfssVacancies, feedItems }: NotificationClientProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Combine DFSS vacancies into feedItems so they display together
  const combinedAlerts = [
    ...dfssVacancies.map(v => ({
      id: v._id || v.fingerprint,
      title: v.title,
      link: v.notificationUrl || v.sourceUrl,
      pubDate: v.date || v.scrapedAt,
      source: 'DFS India (Govt)',
      category: 'Job',
      isOfficial: true
    })),
    ...feedItems
  ].sort((a, b) => {
    // Sort combined descending by date
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return (isNaN(dateB) ? 0 : dateB) - (isNaN(dateA) ? 0 : dateA);
  });

  const filteredAlerts = combinedAlerts.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory || item.category + 's' === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isNew = (pubDateStr: string) => {
    const pubDate = new Date(pubDateStr);
    if (isNaN(pubDate.getTime())) return false;
    const diffTime = Math.abs(new Date().getTime() - pubDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= 3;
  };

  return (
    <div className="min-h-screen pb-32">
      <PageHero
        title={title}
        description={description}
      />

      {/* ─── LIVE JOB & EXAM ALERTS ───────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Live Job & Exam Alerts</h2>
            <p className="text-slate-500 font-light">Aggregated from official sources, boards, and RSS feeds.</p>
          </div>
          
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search alerts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto pb-4 mb-6 gap-2 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Alert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((item, index) => {
                const Icon = categoryIcons[item.category + 's'] || categoryIcons[item.category] || Layers;
                const newlyAdded = isNew(item.pubDate);
                
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={item.id + index}
                    className="card-panel p-6 flex flex-col h-full bg-white relative"
                  >
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <div className="flex gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          (item as any).isOfficial ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {(item as any).isOfficial && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                          {item.source}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">
                          <Icon className="w-3 h-3" />
                          {item.category}
                        </span>
                        {newlyAdded && (
                          <span className="inline-flex items-center px-2 py-1 rounded bg-rose-100 text-rose-700 text-[9px] font-bold uppercase tracking-widest animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-display font-bold text-slate-900 text-base leading-snug mb-4 line-clamp-3">
                      {item.title}
                    </h3>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-medium">
                        {item.pubDate ? new Date(item.pubDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </span>
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-violet-700 transition-colors group"
                      >
                        View Details 
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <Filter className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-display font-bold text-slate-900">No alerts found</h3>
                <p className="text-slate-500 font-light text-sm">Try adjusting your filters or search query.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
