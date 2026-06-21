"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Layers, FileText, ExternalLink, ChevronRight, Menu, X } from 'lucide-react';
import { PortableText } from '@portabletext/react';

interface Module {
  title: string;
  description?: string;
  content?: any[];
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

// Custom components for Portable Text rendering
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-slate-700 leading-relaxed mb-4 text-base">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-10 mb-4 tracking-tight">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 mt-8 mb-3 tracking-tight">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-display font-bold text-slate-900 mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-accent/30 bg-accent/5 px-6 py-4 my-6 rounded-r-xl text-slate-700 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-slate-700 pl-2">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-slate-700 pl-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-slate-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    underline: ({ children }: any) => <span className="underline decoration-accent/40 underline-offset-2">{children}</span>,
    highlight: ({ children }: any) => <mark className="bg-yellow-100 text-slate-900 px-1 rounded">{children}</mark>,
    link: ({ children, value }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) => {
      let alignClass = "mx-auto text-center";
      let sizeClass = "w-full";
      let floatClass = "";

      if (value?.size === 'small') sizeClass = "w-1/2 md:w-1/3";
      else if (value?.size === 'medium') sizeClass = "w-3/4 md:w-1/2";
      else if (value?.size === 'large') sizeClass = "w-full md:w-3/4";
      
      if (value?.position === 'left' && value?.size !== 'full') {
         alignClass = "text-left";
         floatClass = "md:float-left md:mr-8 md:mb-4";
      } else if (value?.position === 'right' && value?.size !== 'full') {
         alignClass = "text-right";
         floatClass = "md:float-right md:ml-8 md:mb-4";
      }

      return (
        <figure className={`my-8 ${alignClass} ${sizeClass} ${floatClass}`}>
          <img
            src={value?.asset?.url || ''}
            alt={value?.alt || ''}
            className="w-full h-auto rounded-2xl border border-slate-200 shadow-sm object-cover"
          />
          {value?.caption && (
            <figcaption className="text-xs text-slate-400 mt-3 font-light">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

export default function SubjectDetailClient({ subject }: { subject: SubjectData }) {
  const modules = subject.modules || [];
  const [activeModule, setActiveModule] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (modules.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
          <BookOpen className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">No Modules Yet</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Course materials for {subject.name} are currently being updated.
        </p>
        <Link href="/syllabus" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-bold hover:bg-[#6d28d9] transition-all">
          <ArrowLeft className="w-4 h-4" />
          Back to Syllabus
        </Link>
      </div>
    );
  }

  const currentMod = modules[activeModule];

  const selectModule = (i: number) => {
    setActiveModule(i);
    setSidebarOpen(false); // auto-close on mobile
  };

  return (
    <>
      {/* Push content below the fixed site header */}
      <div className="pt-[72px] md:pt-[80px]" />

      <div className="min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col md:flex-row border-t border-slate-200 relative">

        {/* ─── MOBILE SIDEBAR OVERLAY ───────────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── SIDEBAR ─────────────────────────────────────────── */}
        <aside className={`
          fixed md:sticky top-[72px] md:top-[80px] left-0 z-50 md:z-auto
          w-[85vw] max-w-[360px] md:w-80 lg:w-96 
          bg-white border-r border-slate-200 
          flex flex-col 
          h-[calc(100vh-72px)] md:h-[calc(100vh-80px)]
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          shrink-0 overflow-hidden
        `}>
          {/* Sidebar header */}
          <div className="p-5 md:p-6 border-b border-slate-100 shrink-0 bg-slate-50">
            <div className="flex items-center justify-between mb-4">
              <Link href="/syllabus" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-accent uppercase tracking-wider transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Link>
              {/* Close button on mobile */}
              <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h1 className="text-lg md:text-xl font-display font-bold text-slate-900 leading-tight mb-2">
              {subject.name}
            </h1>
            <div className="flex items-center gap-2 text-xs font-bold text-accent">
              <Layers className="w-3.5 h-3.5" />
              {modules.length} Module{modules.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Module list */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {modules.map((mod, i) => {
              const isActive = activeModule === i;
              const hasContent = mod.content && mod.content.length > 0;
              return (
                <button
                  key={i}
                  onClick={() => selectModule(i)}
                  className={`w-full text-left p-4 border-b border-slate-100 transition-all flex gap-3 ${
                    isActive ? 'bg-accent/5 border-l-4 border-l-accent' : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className={`w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    isActive ? 'bg-accent text-white shadow-md shadow-accent/20' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0 pr-1">
                    <h3 className={`font-bold text-sm leading-tight mb-1 truncate ${isActive ? 'text-accent' : 'text-slate-800'}`}>
                      {mod.title}
                    </h3>
                    {mod.description && (
                      <p className="text-xs text-slate-500 line-clamp-1">{mod.description}</p>
                    )}
                    {!hasContent && (
                      <span className="text-[10px] text-slate-400 italic">Coming soon</span>
                    )}
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 mt-1.5 transition-colors ${isActive ? 'text-accent' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </aside>

        {/* ─── MAIN CONTENT AREA ───────────────────────────────── */}
        <main className="flex-1 flex flex-col min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-80px)]">
          {/* Content header with module title + mobile menu toggle */}
          <header className="h-14 md:h-16 shrink-0 bg-white border-b border-slate-200 px-4 md:px-10 flex items-center justify-between shadow-sm sticky top-[72px] md:top-[80px] z-30">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile sidebar toggle */}
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1.5 -ml-1 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
              <h2 className="font-display font-bold text-base md:text-lg text-slate-900 truncate">
                {activeModule + 1}. {currentMod?.title}
              </h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {currentMod?.fileUrl && (
                <a
                  href={currentMod.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" /> PDF
                </a>
              )}
              {currentMod?.link && (
                <a
                  href={currentMod.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Link
                </a>
              )}
            </div>
          </header>

          {/* Lesson Content */}
          <div className="flex-1 px-5 md:px-10 lg:px-16 py-8 md:py-10 max-w-4xl w-full mx-auto overflow-y-auto">
            {currentMod?.content && currentMod.content.length > 0 ? (
              <motion.article
                key={activeModule}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="prose-custom"
              >
                <PortableText value={currentMod.content} components={portableTextComponents} />
              </motion.article>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 md:py-20">
                <FileText className="w-12 h-12 md:w-16 md:h-16 text-slate-200 mb-4" />
                <h3 className="text-lg md:text-xl font-display font-bold text-slate-900 mb-2">Content Coming Soon</h3>
                <p className="text-sm text-slate-500 font-light max-w-md">
                  The lesson content for this module is being prepared. Check back soon!
                </p>
              </div>
            )}
          </div>

          {/* Footer / Navigation */}
          <footer className="h-14 md:h-16 shrink-0 bg-white border-t border-slate-200 px-4 md:px-10 flex items-center justify-between sticky bottom-0 z-10">
            <button
              onClick={() => setActiveModule(Math.max(0, activeModule - 1))}
              disabled={activeModule === 0}
              className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" /> <span className="hidden sm:inline">Previous</span><span className="sm:hidden">Prev</span>
            </button>

            <span className="text-xs font-bold text-slate-400">
              {activeModule + 1} / {modules.length}
            </span>
            
            <button
              onClick={() => setActiveModule(Math.min(modules.length - 1, activeModule + 1))}
              disabled={activeModule === modules.length - 1}
              className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-6 py-2 rounded-xl text-xs md:text-sm font-bold text-white bg-accent hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-accent/20 transition-all"
            >
              Next <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4 rotate-180" />
            </button>
          </footer>
        </main>

      </div>
    </>
  );
}
