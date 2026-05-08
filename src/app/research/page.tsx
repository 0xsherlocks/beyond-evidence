"use client";

import PageHero from '@/src/components/PageHero';
import { motion } from 'framer-motion';
import { Beaker, Microscope, TestTube } from 'lucide-react';

export default function Research() {
  return (
    <div className="min-h-screen">
      <PageHero
        eyebrow="Research Desk"
        title="Lab Protocols"
        description="Access long-form research, workflow architectures, and cutting-edge signal data."
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2">
          <div className="mb-20">
            <h2 className="eyebrow mb-12">Journal Roundups & SOPs</h2>
            <div className="space-y-8">
              {[
                { tag: "Journal Roundup", title: "HPLC Methods for Synthetic Cannabinoids", icon: Beaker, author: "Dr. L. Vance", date: "Oct 12, 2023", image: "https://images.unsplash.com/photo-1544648156-5388451882c5?auto=format&fit=crop&q=80" },
                { tag: "SOP", title: "Bone Density Post-Mortem Interval Protocol", icon: TestTube, author: "A. Torres", date: "Nov 04, 2023", image: "https://images.unsplash.com/photo-1582213702581-67852b75306e?auto=format&fit=crop&q=80" },
                { tag: "Case Library", title: "Evidence Trail: Digital Heist Reconstruction", icon: Microscope, author: "L. Nguyen", date: "Dec 18, 2023", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" }
              ].map((item, i) => (
                <motion.div 
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-panel flex flex-col md:flex-row items-stretch gap-0 group cursor-pointer p-0"
                >
                  <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden bg-white">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent opacity-80 transition-opacity" />
                  </div>
                  <div className="flex-1 p-8 flex flex-col justify-center bg-white border-l border-slate-100">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent border border-accent/20 px-3 py-1 rounded-full">{item.tag}</span>
                      <span className="text-slate-500 text-[9px] uppercase tracking-widest font-bold">{item.date}</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 group-hover:text-accent transition-colors leading-tight mb-4">{item.title}</h3>
                    <p className="text-slate-600 text-xs font-light">Lead Investigator: <span className="text-slate-900 font-medium">{item.author}</span></p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-12">
            <div className="p-10 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative group border border-slate-200 shadow-2xl">
              <div className="absolute inset-0 opacity-20 mix-blend-overlay transition-transform duration-[20s] group-hover:scale-125">
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80" 
                  alt="Forensic Pattern background" 
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="relative z-10">
                <h3 className="font-display font-bold text-3xl mb-6 leading-tight">Master Forensic Ballistics</h3>
                <p className="text-slate-300 text-sm font-light mb-10 leading-relaxed">Advanced webinar series on firearm toolmark identification and trajectory analysis architectures.</p>
                <button className="w-full py-5 bg-accent hover:bg-white text-white hover:text-slate-900 transition-all rounded-full font-bold text-[10px] uppercase tracking-[0.2em]">
                  Register for Webinar
                </button>
              </div>
            </div>

            <div>
              <h2 className="eyebrow mb-8">Learning Tracks</h2>
              <div className="space-y-4">
                {[
                  { title: "UGC-NET Track", desc: "Question banks & unit-wise technical notes." },
                  { title: "Lab Skills Builder", desc: "Instrumental analysis & protocol design." },
                  { title: "Case Review Sprints", desc: "Intense evidence scene training simulations." }
                ].map((track) => (
                  <div key={track.title} className="p-6 border border-slate-200 rounded-[2rem] bg-white hover:shadow-lg hover:border-slate-300 transition-all cursor-pointer group">
                    <h4 className="font-display font-bold text-slate-900 group-hover:text-accent transition-colors text-base mb-2">{track.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold group-hover:text-slate-600 transition-colors">{track.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
