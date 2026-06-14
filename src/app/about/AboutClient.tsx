"use client";

import PageHero from '@/src/components/PageHero';
import { Target, BookOpen, Users, Compass } from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  BookOpen,
  Compass,
  Target,
  Users,
};

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
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 tracking-tighter">
              {props.missionTitle}
            </h2>
            {paragraphs.map((p, i) => (
              <p key={i} className={`text-slate-600 ${i === 0 ? 'text-lg' : ''} font-light leading-relaxed`}>
                {p}
              </p>
            ))}
          </div>
          
          {/* Visual/Image Area */}
          <div className="relative rounded-[2.5rem] overflow-hidden aspect-square border border-slate-100 shadow-xl bg-slate-50">
            <img 
              src={props.missionImage} 
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
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tighter mb-4">{props.methodologyTitle}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-light">{props.methodologyDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {props.methodologyFeatures.map((feature, i) => {
              const IconComponent = ICON_MAP[feature.iconName] || BookOpen;
              return (
                <div key={i} className="card-panel p-8 group hover:-translate-y-1 transition-transform duration-500">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 font-light leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
