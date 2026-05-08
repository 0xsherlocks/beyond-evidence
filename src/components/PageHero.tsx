"use client";

import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface PageHeroProps {
  title: string;
  eyebrow?: string;
  description?: string;
  imageUrl?: string;
}

export default function PageHero({ title, eyebrow, description, imageUrl }: PageHeroProps) {
  if (imageUrl) {
    return (
      <div className="relative w-full h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-white/70 z-10 backdrop-blur-sm" />
        <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover grayscale opacity-20" />
        <div className="relative z-20 text-center max-w-4xl px-6">
          {eyebrow && <span className="eyebrow block mb-8">{eyebrow}</span>}
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-display font-bold text-slate-900 mb-8 tracking-tighter leading-none">{title}</h1>
          {description && <p className="text-lg md:text-xl text-slate-600 font-light max-w-2xl mx-auto">{description}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pt-48 pb-24 px-6 md:px-12 flex flex-col items-center text-center bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-transparent -z-10" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        {eyebrow && <span className="eyebrow block mb-8 text-accent">{eyebrow}</span>}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-slate-900 mb-6 tracking-tighter leading-[0.95]">{title}</h1>
        {description && <p className="text-base md:text-lg text-slate-600 font-light max-w-2xl mx-auto leading-relaxed">{description}</p>}
      </motion.div>
    </div>
  );
}
