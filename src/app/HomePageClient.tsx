"use client";

import { useRef, MouseEvent, useState, useEffect } from 'react';
import { motion, Variants, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Microscope, BookCheck, ArrowUpRight, BellRing, Target } from 'lucide-react';
import Link from '@/src/components/ProtectedLink';
import Logo from '@/src/components/Logo';
import NewsletterSection from '@/src/components/NewsletterSection';

const ICON_MAP: Record<string, any> = {
  BookOpen,
  Microscope,
  BookCheck,
  BellRing,
  Target,
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 }, // Changed to 20px below for fade-up
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

// 3D Card Components
function ValuePropCard({ item, index }: { item: any, index: number }) {
  const IconComponent = ICON_MAP[item.iconName] || BookOpen;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollRotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const smoothScrollRotateX = useSpring(scrollRotateX, { stiffness: 100, damping: 30 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseRotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const mouseRotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const rotateX = useTransform(() => smoothScrollRotateX.get() + mouseRotateX.get());
  const rotateY = useSpring(mouseRotateY, { stiffness: 150, damping: 20 });

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
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="group flex flex-col items-center text-center p-0 transition-all duration-300 hover:-translate-y-1"
    >
      {item.link ? (
        <Link href={item.link} className="w-full h-full block">
          <div 
            style={{ transformStyle: "preserve-3d" }}
            className="w-full h-[320px] md:h-[380px] rounded-[2rem] overflow-hidden mb-10 relative bg-white border border-slate-100 shadow-sm group-hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.2)] group-hover:border-violet-200 transition-all duration-700 cursor-pointer"
          >
            <img
              src={item.resolvedImage}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-0 group-hover:opacity-10 scale-110 group-hover:scale-100 mix-blend-multiply transition-all duration-1000"
            />
            <div className="absolute inset-x-0 bottom-8 flex flex-col items-center px-6 z-10" style={{ transformStyle: "preserve-3d" }}>
              <div 
                style={{ transform: "translateZ(50px)" }}
                className="w-14 h-14 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-500"
              >
                <IconComponent className="w-7 h-7" />
              </div>
              <h3 style={{ transform: "translateZ(60px)" }} className="text-xl font-display font-bold mb-3 text-slate-900 drop-shadow-sm">{item.title}</h3>
              <p style={{ transform: "translateZ(40px)" }} className="text-slate-600 font-light text-sm leading-relaxed drop-shadow-sm">{item.description}</p>
            </div>
          </div>
        </Link>
      ) : (
        <div 
          style={{ transformStyle: "preserve-3d" }}
          className="w-full h-[320px] md:h-[380px] rounded-[2rem] overflow-hidden mb-10 relative bg-white border border-slate-100 shadow-sm group-hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.2)] group-hover:border-violet-200 transition-all duration-700"
        >
          <img
            src={item.resolvedImage}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover grayscale opacity-0 group-hover:opacity-10 scale-110 group-hover:scale-100 mix-blend-multiply transition-all duration-1000"
          />
          <div className="absolute inset-x-0 bottom-8 flex flex-col items-center px-6 z-10" style={{ transformStyle: "preserve-3d" }}>
            <div 
              style={{ transform: "translateZ(50px)" }}
              className="w-14 h-14 rounded-2xl bg-accent/5 border border-accent/20 flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-500"
            >
              <IconComponent className="w-7 h-7" />
            </div>
            <h3 style={{ transform: "translateZ(60px)" }} className="text-xl font-display font-bold mb-3 text-slate-900 drop-shadow-sm">{item.title}</h3>
            <p style={{ transform: "translateZ(40px)" }} className="text-slate-600 font-light text-sm leading-relaxed drop-shadow-sm">{item.description}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function TopicCard({ topic, index }: { topic: any, index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollRotateX = useTransform(scrollYProgress, [0, 1], [15, -15]);
  const scrollRotateY = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  
  const smoothScrollRotateX = useSpring(scrollRotateX, { stiffness: 100, damping: 30 });
  const smoothScrollRotateY = useSpring(scrollRotateY, { stiffness: 100, damping: 30 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseRotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const mouseRotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const rotateX = useTransform(() => smoothScrollRotateX.get() + mouseRotateX.get());
  const rotateY = useTransform(() => smoothScrollRotateY.get() + mouseRotateY.get());

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      style={{ perspective: 2000 }}
      className="h-[300px] md:h-[360px]"
    >
      <motion.a 
        key={topic.name || index}
        href={topic.link || '/courses'}
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="group block w-full h-full rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between bg-slate-50 border border-slate-100 hover:border-violet-200 hover:bg-white hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(139,92,246,0.2)] transition-all duration-700 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 mix-blend-multiply transition-all duration-1000">
          <img
            src={topic.resolvedImage}
            alt={topic.name}
            className="w-full h-full object-cover grayscale scale-110 group-hover:scale-100 transition-transform duration-1000"
          />
        </div>
        <div 
          style={{ transform: "translateZ(30px)" }} 
          className="absolute -right-2 -top-2 text-8xl font-display font-bold text-slate-200/50 group-hover:text-slate-200 transition-colors pointer-events-none drop-shadow-sm"
        >
          {topic.number}
        </div>
        <div 
          style={{ transform: "translateZ(50px)" }}
          className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-500 z-10 shadow-sm group-hover:shadow-xl"
        >
          <ArrowUpRight className="w-6 h-6 transition-transform duration-500 group-hover:rotate-45" />
        </div>
        <h3 style={{ transform: "translateZ(60px)" }} className="font-display font-bold text-2xl text-slate-900 group-hover:text-accent transition-colors z-10 relative leading-tight drop-shadow-sm">
          {topic.name}
        </h3>
      </motion.a>
    </motion.div>
  );
}

interface HomePageClientProps {
  heroTitle: string;
  heroTitleLine2: string;
  heroHighlight: string;
  heroDescription: string;
  heroCtaPrimaryText: string;
  heroCtaPrimaryLink: string;
  heroCtaSecondaryText: string;
  heroCtaSecondaryLink: string;
  valuePropEyebrow: string;
  valuePropTitle: string;
  valueProps: Array<{ title: string; description: string; iconName: string; resolvedImage: string }>;
  featuredTopicsEyebrow: string;
  featuredTopicsTitle: string;
  featuredTopics: Array<{ name: string; number: string; resolvedImage: string; link: string }>;
  newsletterTitle: string;
  newsletterDescription: string;
  bannerTitle: string;
  bannerDescription: string;
  bannerImageUrl: string;
  bannerCta1Text: string;
  bannerCta1Link: string;
  bannerCta2Text: string;
  bannerCta2Link: string;
  latestNotification?: any;
}

export default function HomePageClient(props: HomePageClientProps) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 250]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [showSplash, setShowSplash] = useState(false);
  const [introWordIndex, setIntroWordIndex] = useState(0);
  const introWords = ["EDUCATION", "RESEARCH", "CAREER"];

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (!hasSeenSplash) {
      // Small delay so user doesn't see a flicker
      setTimeout(() => setShowSplash(true), 100);
      
      const interval = setInterval(() => {
        setIntroWordIndex((prev) => {
          if (prev < 2) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 1000);

      setTimeout(() => {
        setShowSplash(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 3800);
      
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-white to-sky-50/50" />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative flex flex-col items-center z-10"
            >
              <Logo layoutId="site-logo" size="intro" showIcon={true} showSubtitle={false} className="mb-16" />
              
              <div className="h-10 relative flex items-center justify-center w-full overflow-hidden mt-6">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={introWords[introWordIndex]}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute text-xl md:text-2xl font-display font-bold tracking-[0.3em] text-slate-800"
                  >
                    {introWords[introWordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-24 pb-10 md:pt-28 md:pb-14 lg:pt-32 lg:pb-16 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="z-10 flex flex-col items-center text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {props.latestNotification && (
              <motion.div variants={itemVariants} className="mb-5 md:mb-6">
                <Link 
                  href={props.latestNotification.link || (props.latestNotification.fileUrl ? props.latestNotification.fileUrl : '/notification')}
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/20 hover:border-accent/30 transition-all duration-300 group shadow-sm"
                >
                  {props.latestNotification.isNew && (
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
                    </span>
                  )}
                  <span className="text-sm font-medium text-accent">
                    <span className="font-bold mr-1">Update:</span> 
                    {props.latestNotification.title}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight text-slate-900 leading-[0.98] mb-4 md:mb-6"
            >
              {props.heroTitle}<br />
              <span className="text-accent">{props.heroTitleLine2}</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg text-slate-600 max-w-2xl mb-6 md:mb-8 font-light leading-relaxed"
            >
              <strong className="font-semibold text-slate-800">{props.heroHighlight}</strong><br />
              {props.heroDescription}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-6"
            >
              <Link href={props.heroCtaPrimaryLink} className="pill-button bg-accent text-white hover:bg-[#6d28d9] flex items-center gap-3 shadow-lg shadow-accent/20 transition-all hover:-translate-y-1">
                {props.heroCtaPrimaryText} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href={props.heroCtaSecondaryLink} className="text-sm font-bold uppercase tracking-[0.3em] text-slate-600 hover:text-accent transition-colors">
                {props.heroCtaSecondaryText}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 pointer-events-none -z-10"
        >
          <div className="absolute top-1/4 -left-12 w-64 h-64 bg-slate-200 rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-1/4 -right-12 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20" />
        </motion.div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-24 md:py-32 bg-transparent px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto" style={{ perspective: 2000 }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="eyebrow">{props.valuePropEyebrow}</span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mt-4 text-slate-900 tracking-tighter">{props.valuePropTitle}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {props.valueProps.map((item, i) => (
              <ValuePropCard key={item.title} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 md:mb-24 gap-6 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="eyebrow">{props.featuredTopicsEyebrow}</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 text-slate-900 tracking-tighter">{props.featuredTopicsTitle}</h2>
            </motion.div>
            <Link href="/courses" className="pill-button border border-slate-200 text-slate-900 hover:bg-slate-50 flex items-center gap-2 group transition-all hover:-translate-y-1">
              <span>View All Courses</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {props.featuredTopics.map((topic, i) => (
              <TopicCard key={topic.name} topic={topic} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Modern Banner */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-slate-900 text-white overflow-hidden relative">
        <div className={`absolute inset-0 opacity-20 bg-cover bg-center grayscale mix-blend-overlay`} style={{ backgroundImage: `url('${props.bannerImageUrl}')` }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-6 md:mb-8 tracking-tighter">{props.bannerTitle}</h2>
            <p className="text-slate-300 mb-10 md:mb-12 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">{props.bannerDescription}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href={props.bannerCta1Link} className="pill-button bg-accent text-white hover:bg-white hover:text-slate-900 px-10 border-none transition-all hover:-translate-y-1">
                {props.bannerCta1Text}
              </Link>
              <Link href={props.bannerCta2Link} className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                {props.bannerCta2Text}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Training Program Subscription Newsletter (Placed at very last) */}
      <NewsletterSection title={props.newsletterTitle} description={props.newsletterDescription} />
    </div>
  );
}
