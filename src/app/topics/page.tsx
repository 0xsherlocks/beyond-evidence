"use client";

import PageHero from '@/src/components/PageHero';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, ArrowUpRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const MOCK_TOPICS = [
  { id: '1', name: 'Crime Scene Investigation', count: 14, description: 'Scene control, evidence collection, and professional chain of custody protocols.', image: 'https://images.unsplash.com/photo-1590486803833-ffc6f784520a?auto=format&fit=crop&q=80' },
  { id: '2', name: 'DNA and Serology', count: 22, description: 'Advanced sampling strategies and rigid contamination control methodologies.', image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80' },
  { id: '3', name: 'Cyber Forensics', count: 31, description: 'Device triage, volatile memory analysis, and digital artifact recovery.', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80' },
  { id: '4', name: 'Forensic Toxicology', count: 19, description: 'Toxic agent screening via HPLC and advanced spectroscopic methods.', image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80' },
  { id: '5', name: 'Forensic Psychology', count: 12, description: 'Scientific interview techniques and evidence-based behavioral analysis.', image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80' },
  { id: '6', name: 'Ballistics & Toolmarks', count: 16, description: 'Weapon mechanics and advanced ballistic trajectory reconstruction.', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80' },
  { id: '7', name: 'Forensic Anthropology', count: 9, description: 'Skeletal profiling, age estimation, and trauma identification.', image: 'https://images.unsplash.com/photo-1582213702581-67852b75306e?auto=format&fit=crop&q=80' },
  { id: '8', name: 'Environmental Forensics', count: 7, description: 'Field sampling protocols for archaeological and environmental remediation.', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80' },
];

export default function Topics() {
  return (
    <div className="min-h-screen pb-24">
      <PageHero
        eyebrow="Interactive Directory"
        title="The Forensics Hub"
        description="Browse our comprehensive peer-reviewed directory of forensic protocols, articles, and research modules."
      />
      <motion.div 
        className="max-w-7xl mx-auto px-6 md:px-12 py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
            {MOCK_TOPICS.map((topic, i) => (
              <motion.div
                key={topic.id || i}
                variants={cardVariants}
                className="card-panel group cursor-pointer flex flex-col p-0"
              >
                <div className="relative h-64 w-full overflow-hidden bg-white">
                  <img 
                    src={topic.image || `https://images.unsplash.com/photo-1544648156-5388451882c5?auto=format&fit=crop&q=80`} 
                    alt={topic.name || "Topic"} 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 right-6 bg-white/90 border border-slate-200 backdrop-blur-xl px-4 py-1.5 rounded-full shadow-sm">
                    <span className="text-[10px] font-bold text-slate-900">#{(i + 1).toString().padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <h3 className="font-display font-bold text-2xl text-slate-900 group-hover:text-accent transition-colors mb-4 leading-tight">{topic.name || "Loading..."}</h3>
                  <p className="text-slate-600 font-light text-sm leading-relaxed mb-10 flex-1 line-clamp-3">{topic.description || topic.desc || "..."}</p>
                  <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 opacity-60">{topic.count || 0} Modules</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 group-hover:bg-accent group-hover:text-white flex items-center justify-center transition-all duration-500">
                       <ArrowUpRight className="w-5 h-5 translate-x-[-1px]" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
      </motion.div>
    </div>
  );
}
