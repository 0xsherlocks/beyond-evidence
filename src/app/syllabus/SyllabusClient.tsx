"use client";

import { useState } from 'react';
import Link from 'next/link';
import PageHero from '@/src/components/PageHero';
import { motion, Variants } from 'framer-motion';
import { ArrowUpRight, Search, X, BookOpen, FileText } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
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

interface SubjectItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  resolvedImage: string;
  moduleCount: number;
}

export default function SyllabusClient({ subjects }: { subjects: SubjectItem[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const q = searchQuery.toLowerCase().trim();

  const filtered = q
    ? subjects.filter(s => s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q))
    : subjects;

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        eyebrow="Academic Curriculum"
        title="Syllabus"
        description="Browse the complete forensic science curriculum. Select a subject to access lecture slides, notes, and study resources."
      />

      {/* Search bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-8 relative z-20">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search subjects…"
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
            {filtered.length === 0 ? 'No subjects found' : `${filtered.length} subject${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        )}
      </div>

      <motion.div 
        className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filtered.map((subject, i) => (
          <Link href={`/syllabus/${subject.slug || subject._id}`} key={subject._id || i}>
            <motion.div
              variants={cardVariants}
              className="card-panel group cursor-pointer flex flex-col p-0 h-[340px] hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              {/* Image section */}
              <div className="relative h-36 w-full overflow-hidden shrink-0 bg-gradient-to-br from-slate-100 to-slate-50">
                {subject.resolvedImage ? (
                  <img 
                    src={subject.resolvedImage} 
                    alt={subject.name} 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-slate-300 group-hover:text-accent transition-colors duration-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-60" />
                <div className="absolute top-3 right-3 bg-white/90 border border-slate-200 backdrop-blur-xl px-2.5 py-0.5 rounded-full shadow-sm">
                  <span className="text-[10px] font-bold text-slate-900">#{(i + 1).toString().padStart(2, '0')}</span>
                </div>
              </div>

              {/* Content section */}
              <div className="p-5 flex-1 flex flex-col min-h-0">
                <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-accent transition-colors mb-1.5 leading-tight">
                  {subject.name}
                </h3>

                <div className="relative flex-1 overflow-hidden">
                  <p className="text-slate-500 font-light text-sm leading-relaxed line-clamp-2">
                    {subject.description || "Course materials coming soon."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-auto border-t border-slate-100 shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    <FileText className="w-3 h-3" />
                    {subject.moduleCount || 0} Modules
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 group-hover:bg-accent group-hover:text-white group-hover:border-accent flex items-center justify-center transition-all duration-500">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {q && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm font-light">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
