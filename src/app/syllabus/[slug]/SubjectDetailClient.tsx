"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, ExternalLink, Download, BookOpen, Layers } from 'lucide-react';

interface Module {
  title: string;
  description?: string;
  fileUrl?: string;
  link?: string;
  order?: number;
}

interface SubjectData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  resolvedImage?: string;
  modules?: Module[];
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeInOut" } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function SubjectDetailClient({ subject }: { subject: SubjectData }) {
  const modules = subject.modules || [];

  return (
    <div className="min-h-screen pb-24">
      {/* Hero */}
      <div className="relative w-full pt-32 pb-16 px-6 md:px-12 overflow-hidden">
        {/* Background image */}
        {subject.resolvedImage && (
          <>
            <img src={subject.resolvedImage} alt="" className="absolute inset-0 w-full h-full object-cover grayscale opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white" />
          </>
        )}

        <div className="relative z-10 max-w-4xl mx-auto">
          <Link href="/syllabus" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-accent transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Syllabus
          </Link>

          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="eyebrow block mb-4 text-accent">Subject</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-slate-900 mb-4 tracking-tighter leading-[0.95]">
              {subject.name}
            </h1>
            {subject.description && (
              <p className="text-lg text-slate-600 font-light max-w-2xl leading-relaxed">
                {subject.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-bold">
                <Layers className="w-4 h-4" />
                {modules.length} Module{modules.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modules list */}
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {modules.length > 0 ? (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="space-y-4">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.title + i}
                variants={fadeUp}
                className="group rounded-2xl bg-white border border-slate-100 hover:border-accent/20 hover:shadow-lg transition-all duration-500 p-6"
              >
                <div className="flex items-start gap-5">
                  {/* Number badge */}
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 text-sm font-bold text-slate-400 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-500">
                    {(i + 1).toString().padStart(2, '0')}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-1">{mod.title}</h3>
                    {mod.description && (
                      <p className="text-slate-500 text-sm font-light leading-relaxed mb-4">{mod.description}</p>
                    )}

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center gap-3">
                      {mod.fileUrl && (
                        <a
                          href={mod.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/10 text-accent hover:bg-accent hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                      )}
                      {mod.link && (
                        <a
                          href={mod.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 text-xs font-bold uppercase tracking-wider transition-all duration-300"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open Link
                        </a>
                      )}
                      {!mod.fileUrl && !mod.link && (
                        <span className="text-xs text-slate-400 font-light italic">Coming soon</span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-20">
            <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-xl font-display font-bold text-slate-900 mb-2">No Modules Yet</h2>
            <p className="text-slate-400 font-light text-sm max-w-md mx-auto">
              Course materials for {subject.name} will be uploaded soon. Check back later or explore other subjects.
            </p>
            <Link href="/syllabus" className="inline-flex items-center gap-2 mt-8 pill-button bg-accent text-white hover:bg-[#6d28d9] transition-all">
              <ArrowLeft className="w-4 h-4" />
              Browse Other Subjects
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
