"use client";

import Link from 'next/link';
import PageHero from '@/src/components/PageHero';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';

interface StudyMaterialItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function StudyMaterialListClient({ materials }: { materials: StudyMaterialItem[] }) {
  return (
    <div className="min-h-screen pb-24">
      <PageHero
        eyebrow="Exam Preparation"
        title="Study Materials"
        description="Comprehensive notes, mock tests, and preparation guides for your forensic science examinations."
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {materials.map((material) => (
            <Link key={material._id} href={`/study-material/${material.slug}`}>
              <motion.div
                variants={cardVariants}
                className="card-panel group flex flex-col p-8 h-full hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  <BookOpen className="w-6 h-6" />
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
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
