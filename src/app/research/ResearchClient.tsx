"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search, ExternalLink, ChevronDown, ChevronRight, Download, Mail, Phone, X,
  Lightbulb, BookOpen, Highlighter, FolderOpen, PenTool, CheckSquare, Target, Send,
  FileText, File, Table2, Sparkles, GraduationCap, ArrowRight, Globe, Bot
} from 'lucide-react';

/* ─── Types ─── */
interface ResourceCard { name: string; description: string; url?: string; color?: string; logo?: { asset?: { url?: string } }; imageUrl?: string; formats?: string[] }
interface RoadmapStep { title: string; description: string; iconName: string; link: string }
interface WritingGuide { heading: string; explanation: string; tips?: string[]; mistakes?: string[] }
interface TemplateCard { name: string; description: string; downloadUrl?: string; iconName: string }

interface Props {
  heroTitle: string; heroSubtitle: string;
  roadmapTitle: string; roadmapDescription: string; roadmapImageUrl: string; roadmapSteps: RoadmapStep[];
  paperDbTitle: string; paperDbDescription: string; paperDbImageUrl: string; paperDatabases: ResourceCard[];
  forensicTitle: string; forensicDescription: string; forensicImageUrl: string; forensicResources: ResourceCard[];
  aiToolsTitle: string; aiToolsDescription: string; aiToolsImageUrl: string; aiTools: ResourceCard[];
  refManagerTitle: string; refManagerDescription: string; refManagerImageUrl: string; referenceManagers: ResourceCard[];
  citationTitle: string; citationDescription: string; citationImageUrl: string; citationGenerators: ResourceCard[];
  writingGuideTitle: string; writingGuideDescription: string; writingGuideImageUrl: string; writingGuides: WritingGuide[];
  templatesTitle: string; templatesDescription: string; templatesImageUrl: string; templates: TemplateCard[];
  mentorshipTitle: string; mentorshipDescription: string; mentorshipImageUrl: string; mentorshipEmail: string; mentorshipPhone: string; mentorshipCtaText: string; mentorshipCtaLink: string;
}

/* ─── Icon resolver ─── */
const iconMap: Record<string, any> = { Lightbulb, BookOpen, Search, Highlighter, FolderOpen, PenTool, CheckSquare, Target, Send, FileText, File, Table2 };
function getIcon(name: string) { return iconMap[name] || Sparkles; }

/* ─── Animations ─── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };

/* ─── Section header component ─── */
function SectionHeader({ id, eyebrow, title, description, imageUrl }: { id?: string; eyebrow: string; title: string; description?: string; imageUrl?: string }) {
  return (
    <motion.div id={id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12 md:mb-16 scroll-mt-28">
      {imageUrl && (
        <div className="flex justify-center mb-6">
          <img src={imageUrl} alt={title} className="h-20 w-auto object-contain drop-shadow-md" />
        </div>
      )}
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-3 text-slate-900 tracking-tight">{title}</h2>
      {description && <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-light leading-relaxed text-sm md:text-base">{description}</p>}
    </motion.div>
  );
}

/* ─── Resource card component ─── */
function ResCard({ r, i }: { r: ResourceCard; i: number }) {
  // Priority: Sanity uploaded logo → imageUrl field → Google favicon as automatic fallback
  const logoSrc = r.logo?.asset?.url || r.imageUrl || (r.url ? `https://www.google.com/s2/favicons?sz=64&domain=${new URL(r.url).hostname}` : null);

  return (
    <motion.a
      href={r.url} target="_blank" rel="noopener noreferrer"
      variants={fadeUp}
      className="group flex flex-col rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 hover:border-violet-200 hover:shadow-[0_12px_32px_-8px_rgba(139,92,246,0.15)] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
    >
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          {logoSrc ? (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 bg-white p-1.5">
              <img src={logoSrc} alt={r.name} className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: r.color || '#7c3aed' }}>
              {r.name.charAt(0)}
            </div>
          )}
          <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-accent transition-colors leading-tight">{r.name}</h3>
        </div>
        <p className="text-slate-500 text-sm font-light leading-relaxed flex-1 line-clamp-3">{r.description}</p>
        {r.formats && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {r.formats.map(f => <span key={f} className="text-[9px] font-bold uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-full">{f}</span>)}
          </div>
        )}
      </div>
      <div className="px-6 pb-5">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent group-hover:gap-2.5 transition-all">
          Visit <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </motion.a>
  );
}

/* ─── Main Component ─── */
export default function ResearchClient(props: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openGuide, setOpenGuide] = useState<number | null>(null);
  const q = searchQuery.toLowerCase().trim();

  // Filter helper
  const filterRes = (items: ResourceCard[]) =>
    q ? items.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) : items;
  const filterGuides = (items: WritingGuide[]) =>
    q ? items.filter(g => g.heading.toLowerCase().includes(q) || g.explanation.toLowerCase().includes(q)) : items;
  const filterTemplates = (items: TemplateCard[]) =>
    q ? items.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) : items;

  const filteredPapers = filterRes(props.paperDatabases);
  const filteredForensic = filterRes(props.forensicResources);
  const filteredAi = filterRes(props.aiTools);
  const filteredRef = filterRes(props.referenceManagers);
  const filteredCitation = filterRes(props.citationGenerators);
  const filteredGuides = filterGuides(props.writingGuides);
  const filteredTemplates = filterTemplates(props.templates);

  const totalResults = q ? filteredPapers.length + filteredForensic.length + filteredAi.length + filteredRef.length + filteredCitation.length + filteredGuides.length + filteredTemplates.length : -1;

  const quickLinks = [
    { label: 'Find Papers', href: '#find-papers', icon: Search },
    { label: 'AI Research Tools', href: '#ai-tools', icon: Bot },
    { label: 'Citation Tools', href: '#citation-tools', icon: CheckSquare },
    { label: 'Journal Finder', href: '#forensic-resources', icon: Globe },
    { label: 'Research Writing Guide', href: '#writing-guides', icon: PenTool },
  ];

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative px-6 md:px-12 pt-32 pb-20 md:pt-40 md:pb-28 flex items-center justify-center">
        <div className="max-w-3xl mx-auto w-full flex flex-col items-center text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="mb-2">
              <span className="eyebrow">Academic Resource Hub</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl md:text-7xl font-bold font-display tracking-tight text-slate-900 mb-4">
              {props.heroTitle}
            </motion.h1>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-slate-500 max-w-xl mx-auto mb-8 font-light leading-relaxed">
              {props.heroSubtitle}
            </motion.p>

            {/* Search */}
            <motion.div variants={fadeUp} className="relative max-w-lg mx-auto mb-4 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text" placeholder="Search tools, databases, guides…"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all shadow-sm"
              />
              {q && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.div>

            {/* Search results count */}
            {totalResults >= 0 && (
              <p className="text-sm text-slate-400 font-light mb-8">
                {totalResults === 0 ? 'No results found' : `${totalResults} result${totalResults !== 1 ? 's' : ''} found`}
              </p>
            )}
            {!q && <div className="mb-6" />}

            {/* Quick access — hide when searching */}
            {!q && (
              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
                {quickLinks.map((ql) => (
                  <a key={ql.label} href={ql.href} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 bg-white/60 backdrop-blur-sm text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600 hover:bg-accent hover:text-white hover:border-accent transition-all duration-300">
                    <ql.icon className="w-3.5 h-3.5" /> {ql.label}
                  </a>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ SECTION 1: RESEARCH ROADMAP (hidden during search) ═══ */}
      {!q && (
        <section className="py-20 md:py-28 px-6 md:px-12">
          <SectionHeader eyebrow="Step by Step" title={props.roadmapTitle} description={props.roadmapDescription} imageUrl={props.roadmapImageUrl} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-6xl mx-auto relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
              {props.roadmapSteps.map((step, i) => {
                const Icon = getIcon(step.iconName);
                return (
                  <motion.a key={i} href={step.link} variants={fadeUp}
                    className="group flex flex-col items-center text-center p-5 rounded-2xl hover:bg-white/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-3 group-hover:bg-accent group-hover:text-white transition-all duration-500 relative z-10">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent/50 mb-1">Step {i + 1}</span>
                    <h4 className="font-display font-bold text-sm text-slate-900 mb-1">{step.title}</h4>
                    <p className="text-slate-500 text-xs font-light leading-relaxed line-clamp-2">{step.description}</p>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* ═══ SECTION 2: FIND RESEARCH PAPERS ═══ */}
      {filteredPapers.length > 0 && (
        <section id="find-papers" className="py-20 md:py-28 px-6 md:px-12 scroll-mt-24">
          <SectionHeader eyebrow="Databases" title={props.paperDbTitle} description={props.paperDbDescription} imageUrl={props.paperDbImageUrl} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPapers.map((r, i) => <ResCard key={r.name} r={r} i={i} />)}
          </motion.div>
        </section>
      )}

      {/* ═══ SECTION 3: FORENSIC SCIENCE RESOURCES ═══ */}
      {filteredForensic.length > 0 && (
        <section id="forensic-resources" className="py-20 md:py-28 px-6 md:px-12 scroll-mt-24">
          <SectionHeader eyebrow="Forensic Journals & Institutions" title={props.forensicTitle} description={props.forensicDescription} imageUrl={props.forensicImageUrl} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredForensic.map((r, i) => <ResCard key={r.name} r={r} i={i} />)}
          </motion.div>
        </section>
      )}

      {/* ═══ SECTION 4: AI TOOLS ═══ */}
      {filteredAi.length > 0 && (
        <section id="ai-tools" className="py-20 md:py-28 px-6 md:px-12 scroll-mt-24">
          <SectionHeader eyebrow="AI-Powered" title={props.aiToolsTitle} description={props.aiToolsDescription} imageUrl={props.aiToolsImageUrl} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredAi.map((r, i) => <ResCard key={r.name} r={r} i={i} />)}
          </motion.div>
        </section>
      )}

      {/* ═══ SECTION 5: REFERENCE MANAGEMENT ═══ */}
      {filteredRef.length > 0 && (
        <section id="reference-mgmt" className="py-20 md:py-28 px-6 md:px-12 scroll-mt-24">
          <SectionHeader eyebrow="Organize & Cite" title={props.refManagerTitle} description={props.refManagerDescription} imageUrl={props.refManagerImageUrl} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredRef.map((r, i) => <ResCard key={r.name} r={r} i={i} />)}
          </motion.div>
        </section>
      )}

      {/* ═══ SECTION 6: CITATION GENERATORS ═══ */}
      {filteredCitation.length > 0 && (
        <section id="citation-tools" className="py-20 md:py-28 px-6 md:px-12 scroll-mt-24">
          <SectionHeader eyebrow="Format & Cite" title={props.citationTitle} description={props.citationDescription} imageUrl={props.citationImageUrl} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
            {filteredCitation.map((r, i) => <ResCard key={r.name} r={r} i={i} />)}
          </motion.div>
        </section>
      )}

      {/* ═══ SECTION 7: WRITING GUIDES ═══ */}
      {filteredGuides.length > 0 && (
        <section id="writing-guides" className="py-20 md:py-28 px-6 md:px-12 scroll-mt-24">
          <SectionHeader eyebrow="Write Like a Researcher" title={props.writingGuideTitle} description={props.writingGuideDescription} imageUrl={props.writingGuideImageUrl} />
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredGuides.map((guide, i) => (
              <motion.div key={guide.heading} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="rounded-2xl border border-slate-100 bg-white/70 backdrop-blur-sm overflow-hidden hover:border-violet-200 transition-all duration-300"
              >
                <button onClick={() => setOpenGuide(openGuide === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-bold shrink-0">{i + 1}</div>
                    <h3 className="font-display font-bold text-base md:text-lg text-slate-900 group-hover:text-accent transition-colors">{guide.heading}</h3>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 shrink-0 ${openGuide === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openGuide === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 md:px-6 pb-6 space-y-4">
                        <p className="text-slate-600 text-sm font-light leading-relaxed">{guide.explanation}</p>
                        {guide.tips && guide.tips.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">💡 Tips</h4>
                            <ul className="space-y-1.5">
                              {guide.tips.map((t, j) => <li key={j} className="text-sm text-slate-600 font-light flex items-start gap-2"><ChevronRight className="w-3 h-3 text-emerald-500 mt-1 shrink-0" />{t}</li>)}
                            </ul>
                          </div>
                        )}
                        {guide.mistakes && guide.mistakes.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 mb-2">⚠️ Common Mistakes</h4>
                            <ul className="space-y-1.5">
                              {guide.mistakes.map((m, j) => <li key={j} className="text-sm text-slate-600 font-light flex items-start gap-2"><ChevronRight className="w-3 h-3 text-red-400 mt-1 shrink-0" />{m}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ SECTION 8: TEMPLATES ═══ */}
      {filteredTemplates.length > 0 && (
        <section id="templates" className="py-20 md:py-28 px-6 md:px-12 scroll-mt-24">
          <SectionHeader eyebrow="Ready to Use" title={props.templatesTitle} description={props.templatesDescription} imageUrl={props.templatesImageUrl} />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTemplates.map((tpl, i) => {
              const Icon = getIcon(tpl.iconName);
              return (
                <motion.div key={tpl.name} variants={fadeUp}
                  className="group flex flex-col rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100 hover:border-violet-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 p-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900 mb-2">{tpl.name}</h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed flex-1 mb-4">{tpl.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                    <Download className="w-3 h-3" /> Coming Soon
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* ═══ MENTORSHIP CTA ═══ */}
      <section id="mentorship" className="py-20 md:py-28 px-6 md:px-12 scroll-mt-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-white p-10 md:p-16 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-accent via-transparent to-blue-500" />
          <div className="relative z-10 text-center">
            {props.mentorshipImageUrl ? (
              <img src={props.mentorshipImageUrl} alt={props.mentorshipTitle} className="h-16 w-auto mx-auto mb-6 object-contain drop-shadow-md" />
            ) : (
              <GraduationCap className="w-12 h-12 mx-auto mb-6 text-accent" />
            )}
            <h2 className="text-2xl md:text-4xl font-display font-bold mb-4 tracking-tight">{props.mentorshipTitle}</h2>
            <p className="text-slate-300 max-w-lg mx-auto mb-8 font-light leading-relaxed text-sm md:text-base">{props.mentorshipDescription}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link href={props.mentorshipCtaLink}
                className="pill-button bg-accent text-white hover:bg-white hover:text-slate-900 border-none transition-all hover:-translate-y-1 flex items-center gap-2"
              >
                {props.mentorshipCtaText} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-400">
              <a href={`mailto:${props.mentorshipEmail}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4" /> {props.mentorshipEmail}
              </a>
              <a href={`tel:${props.mentorshipPhone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" /> {props.mentorshipPhone}
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
