"use client";

import PageHero from '@/src/components/PageHero';
import { Target, BookOpen, Users, Compass, ArrowRight } from 'lucide-react';
import { useRef, MouseEvent } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const ICON_MAP: Record<string, any> = {
  BookOpen,
  Compass,
  Target,
  Users,
};

function MethodologyCard({ feature, index }: { feature: any, index: number }) {
  const IconComponent = ICON_MAP[feature.iconName] || BookOpen;
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="h-full relative group cursor-pointer"
    >
      <div 
        className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" 
      />
      <div className="h-full p-8 md:p-10 bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-[2rem] shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-accent/20 hover:border-violet-200 transition-all duration-500 flex flex-col relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all duration-700" />
        
        <div style={{ transform: "translateZ(40px)" }} className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-accent mb-8 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-sm">
          <IconComponent className="w-8 h-8" />
        </div>
        <h3 style={{ transform: "translateZ(50px)" }} className="text-2xl font-display font-bold text-slate-900 mb-4 group-hover:text-accent transition-colors">{feature.title}</h3>
        <p style={{ transform: "translateZ(30px)" }} className="text-slate-600 font-light leading-relaxed flex-1">{feature.description}</p>
      </div>
    </motion.div>
  );
}

interface AboutClientProps {
  heroTitle: string;
  heroDescription: string;
  missionTitle: string;
  missionBodySimple: string;
  missionImage: string;
  methodologyTitle: string;
  methodologyDescription: string;
  methodologyFeatures: Array<{ title: string; description: string; iconName: string }>;
}

export default function AboutClient(props: AboutClientProps) {
  const paragraphs = props.missionBodySimple.split('\n\n').filter(Boolean);

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        title={props.heroTitle}
        description={props.heroDescription}
      />

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest self-start">
              Our Mission
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-slate-900 tracking-tighter leading-[1.1]">
              {props.missionTitle}
            </h2>
            <div className="flex flex-col gap-4">
              {paragraphs.map((p, i) => (
                <p key={i} className={`text-slate-600 ${i === 0 ? 'text-xl font-medium text-slate-800' : 'text-lg'} font-light leading-relaxed`}>
                  {p}
                </p>
              ))}
            </div>
          </motion.div>
          
          {/* Visual/Image Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative rounded-[3rem] overflow-hidden aspect-square md:aspect-[4/5] border border-slate-100 shadow-2xl bg-slate-50 group"
          >
            <img 
              src={props.missionImage} 
              alt="Forensic Science Laboratory" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 grayscale group-hover:grayscale-0"
            />
            {/* Liquid overlay effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 via-blue-500/20 to-accent/20 rounded-full blur-3xl mix-blend-overlay opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
            
            <div className="absolute inset-x-8 bottom-8 md:bottom-12 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
              <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20">
                <p className="text-white font-medium text-lg mb-2">Pioneering Forensic Education</p>
                <div className="w-12 h-1 bg-accent rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-32" />

        {/* Our Approach Section */}
        <div className="mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="eyebrow">{props.methodologyTitle}</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 tracking-tighter mt-4 mb-6">How We Teach</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-light text-lg">{props.methodologyDescription}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {props.methodologyFeatures.map((feature, i) => (
              <MethodologyCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
