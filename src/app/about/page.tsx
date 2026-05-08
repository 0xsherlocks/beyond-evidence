"use client";

import PageHero from '@/src/components/PageHero';
import { Target, BookOpen, Users, Compass } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pb-24">
      <PageHero
        title="About Beyond Evidence"
        description="Bridging the gap between theoretical forensic science and real-world investigation through premier education."
      />

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tighter">
              Decoding the Truth, Empowering Minds.
            </h2>
            <p className="text-slate-600 text-lg font-light leading-relaxed">
              Beyond Evidence prioritizes clarity and structured discovery. We move away from dense, unstructured textbooks and toward interactive evidence mapping, making complex forensic concepts accessible and engaging.
            </p>
            <p className="text-slate-600 font-light leading-relaxed">
              Our platform is designed for students preparing for crucial exams, researchers developing new methodologies, and enthusiasts passionate about the pursuit of truth through science.
            </p>
          </div>
          
          {/* Visual/Image Area */}
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-square border border-slate-100 shadow-xl bg-slate-50">
            <img 
              src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80" 
              alt="Forensic Science Laboratory" 
              className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-80"
            />
            {/* Liquid overlay effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/20 via-blue-500/20 to-accent/20 rounded-full blur-3xl mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-widest">
                Our Mission
              </span>
            </div>
          </div>
        </div>

        {/* Our Approach Section */}
        <div className="mb-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tighter mb-4">Our Methodology</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-light">We focus on high-yield topics, practical skill drills, and interconnected learning to ensure mastery of forensic sciences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: BookOpen, 
                title: "Compact Theory", 
                desc: "Distilled, precision-focused notes centered around high-yield exam topics and crucial laboratory methodologies." 
              },
              { 
                icon: Compass, 
                title: "Visual Evidence Maps", 
                desc: "Connect the dots. See intuitively how specific crime scene findings correlate seamlessly to rigorous lab results." 
              },
              { 
                icon: Target, 
                title: "Targeted Skill Drills", 
                desc: "Practice and apply scientific methodologies rigorously until they become second nature and muscle memory." 
              }
            ].map((feature, i) => (
              <div key={i} className="card-panel p-8 group hover:-translate-y-1 transition-transform duration-500">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 font-light leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
