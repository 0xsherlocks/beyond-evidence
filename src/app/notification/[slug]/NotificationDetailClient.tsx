"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, ExternalLink, Calendar, Bell } from 'lucide-react';
import { PortableText } from '@portabletext/react';

interface NotificationData {
  _id: string;
  title: string;
  slug: string;
  content?: any[];
  excerpt?: string;
  isNew?: boolean;
  timestamp?: string;
  fileUrl?: string;
  link?: string;
}

// Custom components for Portable Text rendering
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="text-slate-700 leading-relaxed mb-4 text-base md:text-lg">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mt-10 mb-4 tracking-tight">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl md:text-2xl font-display font-bold text-slate-900 mt-8 mb-3 tracking-tight">{children}</h3>
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
    link: ({ children, value }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-medium">
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }: any) => (
      <figure className="my-8 mx-auto text-center w-full">
        <img
          src={value?.asset?.url || ''}
          alt={value?.alt || ''}
          className="w-full h-auto rounded-2xl border border-slate-200 shadow-sm object-cover"
        />
      </figure>
    ),
  },
};

export default function NotificationDetailClient({ notification }: { notification: NotificationData }) {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <main className="max-w-4xl mx-auto px-6 md:px-12">
        {/* Back Button */}
        <Link 
          href="/notification" 
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-accent transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Notifications
        </Link>

        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest">
              <Bell className="w-3.5 h-3.5" /> Official Announcement
            </span>
            {notification.isNew && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                NEW
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" /> {notification.timestamp || "Just now"}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 leading-tight mb-8">
            {notification.title}
          </h1>

          {/* Action Buttons (if files or links exist) */}
          {(notification.fileUrl || notification.link) && (
            <div className="flex flex-wrap items-center gap-4 py-6 border-y border-slate-200/60 mb-8">
              {notification.fileUrl && (
                <a 
                  href={notification.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  <FileText className="w-4 h-4" /> Download Attachment
                </a>
              )}
              {notification.link && (
                <a 
                  href={notification.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-slate-200 text-slate-700 text-sm font-bold hover:border-accent hover:text-accent transition-colors shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" /> Open External Link
                </a>
              )}
            </div>
          )}
        </header>

        {/* Main Content */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose-custom bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100"
        >
          {notification.content && notification.content.length > 0 ? (
            <PortableText value={notification.content} components={portableTextComponents} />
          ) : (
            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
              {notification.excerpt || "No content provided."}
            </p>
          )}
        </motion.article>

      </main>
    </div>
  );
}
