"use client";

import Link from 'next/link';
import PageHero from '@/src/components/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ClipboardList, FileText, Target, Sparkles, BadgeIndianRupee, ArrowRight, ShieldAlert, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StudyMaterialItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  iconName?: string;
  imageUrl?: string;
}

const IconMap: Record<string, any> = {
  BookOpen,
  ClipboardList,
  FileText,
  Target,
  Sparkles,
  BadgeIndianRupee,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function StudyMaterialListClient({ materials }: { materials: StudyMaterialItem[] }) {
  const searchParams = useSearchParams();
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (searchParams.get('toast') === 'purchase_required') {
      setToast(true);
      const t = setTimeout(() => setToast(false), 5000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen pb-24">
      {/* ── Purchase-required toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            id="purchase-required-toast"
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed top-5 left-1/2 z-[9999] -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-sm font-semibold max-w-sm w-full"
            style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #4c1d95 100%)', border: '1px solid rgba(108,78,246,0.4)' }}
          >
            <ShieldAlert className="w-5 h-5 shrink-0 text-violet-300" />
            <span className="flex-1">Purchase required to access this content</span>
            <button
              onClick={() => setToast(false)}
              className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHero
        eyebrow="Exam Preparation"
        title="Competitive Exams"
        description="Comprehensive notes, mock tests, and preparation guides for your forensic science competitive exams."
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {materials.length === 0 ? (
          <div className="card-panel mx-auto max-w-2xl p-8 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 text-accent">
              <BookOpen className="h-6 w-6" />
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900">No exam packages found</h2>
            <p className="mx-auto mt-3 max-w-md text-sm font-light leading-relaxed text-slate-500">
              Add and publish Study Material documents in Sanity Studio, then refresh this page.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {materials.map((material) => {
              const Icon = IconMap[material.iconName || 'BookOpen'] || BookOpen;

              return (
                <Link key={material._id} href={`/study-material/${material.slug}`}>
                  <motion.div
                    variants={cardVariants}
                    className="card-panel group flex flex-col overflow-hidden h-full hover:-translate-y-1 transition-all duration-300"
                  >
                {material.imageUrl && (
                  <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={material.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-8">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="font-display font-bold text-xl text-slate-900 mb-3 group-hover:text-accent transition-colors">
                  {material.title}
                </h2>
                <p className="text-slate-500 font-light text-sm leading-relaxed mb-8 flex-1">
                  {material.description || "Comprehensive study resources and preparation material."}
                </p>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-accent transition-colors">
                  View Package <ArrowRight className="w-4 h-4" />
                </div>
                </div>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

