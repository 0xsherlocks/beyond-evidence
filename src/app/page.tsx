"use client";

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Microscope, BookCheck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-6 md:px-12 py-20 md:py-32 lg:py-40 flex items-center justify-center min-h-[85vh]">
        <div className="absolute inset-0 bg-background -z-10" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        
        <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
          <motion.div 
            className="z-10 flex flex-col items-center text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight text-slate-900 leading-[0.95] mb-6"
            >
              Decode the Unseen.<br />
              <span className="text-slate-400">Master Intelligence.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base md:text-xl text-slate-600 max-w-2xl mb-10 font-light leading-relaxed"
            >
              <strong className="font-semibold text-slate-800">Proving everything with forensic science.</strong><br />
              Empowering students and professionals with top-tier customized courses, expert guidance, and comprehensive learning resources to excel in the field.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-8"
            >
              <Link href="/topics" className="pill-button bg-slate-900 text-white hover:bg-black flex items-center gap-3">
                Explore Library <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/research" className="text-sm font-bold uppercase tracking-[0.3em] text-slate-600 hover:text-accent transition-colors">
                Research Desk
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
      <section className="py-24 md:py-32 bg-slate-50 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-24"
          >
            <span className="eyebrow">The Curriculum</span>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold mt-4 text-slate-900 tracking-tighter">Structured for Discovery</h2>
          </motion.div>
 
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
            {[
              { icon: BookOpen, title: "Case-led Modules", desc: "Step-by-step forensic notes following evidence trails from field to lab.", image: "https://images.unsplash.com/photo-1590103254922-bb7971777d19?auto=format&fit=crop&q=80" },
              { icon: Microscope, title: "Lab-first Workflows", desc: "Scientific analytical methodologies verified against real-world SOPs.", image: "https://images.unsplash.com/photo-1579154273874-9467262276cb?auto=format&fit=crop&q=80" },
              { icon: BookCheck, title: "Exam-ready Prep", desc: "Specialized revision paths for forensic PG entrances and global certifications.", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80" }
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="group flex flex-col items-center text-center p-0"
              >
                <div className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-10 relative bg-white border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:border-slate-300 transition-all duration-700">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-12 flex flex-col items-center px-8 z-10">
                    <div className="w-16 h-16 rounded-3xl bg-accent/5 border border-accent/20 flex items-center justify-center text-accent mb-6 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      <item.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-display font-bold mb-4 text-slate-900">{item.title}</h3>
                    <p className="text-slate-600 font-light text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Topics Grid */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-16 md:mb-24 gap-6 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="eyebrow">Interactive Index</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mt-4 text-slate-900 tracking-tighter">Explore the Disciplines</h2>
            </motion.div>
            <Link href="/topics" className="pill-button border border-slate-200 text-slate-900 hover:bg-slate-50 flex items-center gap-2 group">
              Browse Directory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'CSI Scene Protocol', icon: '01', img: 'https://images.unsplash.com/photo-1590486803833-ffc6f784520a?auto=format&fit=crop&q=80' },
              { name: 'DNA & Serology', icon: '02', img: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80' },
              { name: 'Cyber Forensics', icon: '03', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80' },
              { name: 'Toxicology', icon: '04', img: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80' }
            ].map((topic, i) => (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href="/topics" className="group block h-[380px] md:h-[450px] rounded-[2.5rem] md:rounded-[3rem] p-8 md:p-10 flex flex-col justify-between bg-slate-50 border border-slate-100 hover:border-slate-300 hover:bg-white transition-all duration-700 relative overflow-hidden shadow-sm hover:shadow-2xl">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-1000">
                    <img 
                      src={topic.img} 
                      alt={topic.name} 
                      className="w-full h-full object-cover grayscale scale-110 group-hover:scale-100 transition-transform duration-1000"
                    />
                  </div>
                  <div className="absolute -right-4 -top-4 text-9xl font-display font-bold text-slate-200/50 group-hover:text-slate-200 transition-colors pointer-events-none">
                    {topic.icon}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 z-10 shadow-sm group-hover:shadow-xl">
                    <ArrowUpRight className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-3xl text-slate-900 group-hover:text-accent transition-colors z-10 relative leading-tight">{topic.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern Banner */}
      <section className="py-24 md:py-32 px-6 md:px-12 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale mix-blend-overlay" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-6 md:mb-8 tracking-tighter">Accelerate the Intelligence Cycle.</h2>
            <p className="text-slate-300 mb-10 md:mb-12 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">Join a network of academic researchers and investigators contributing to our peer-reviewed knowledge base.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/studio" className="pill-button bg-accent text-white hover:bg-white hover:text-slate-900 px-10 border-none">
                Join the Network
              </Link>
              <Link href="/contact" className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition-colors">
                Contact Board
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
