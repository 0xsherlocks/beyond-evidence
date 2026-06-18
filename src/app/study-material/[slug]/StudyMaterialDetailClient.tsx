"use client";

import { useState } from 'react';
import Link from 'next/link';
import PageHero from '@/src/components/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, BookOpen, ClipboardList, FileText,
  BadgeIndianRupee, Sparkles, ArrowRight, Send, User,
  Mail, Phone, Package, AlertCircle, ChevronDown, ArrowLeft
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// Map string icon names to actual Lucide components
const IconMap: Record<string, any> = {
  BookOpen,
  ClipboardList,
  FileText,
  Sparkles,
};

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function StudyMaterialDetailClient({ material, contactInfo }: { material: any, contactInfo?: { email: string, phone: string } }) {
  const defaultPackageId = material.packages && material.packages.length > 0 ? material.packages[material.packages.length - 1].id : '';
  const [selectedPackage, setSelectedPackage] = useState<string>(defaultPackageId);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', package: defaultPackageId });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'package') setSelectedPackage(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate brief loading
    await new Promise(r => setTimeout(r, 600));
    setStatus('success');
  };

  const getMessageContent = () => {
    const selectedPkg = material.packages?.find((p: any) => p.id === formData.package);
    return `Hello Beyond Evidence Team,

I am writing to express my interest in enrolling in your study material program. Please find my registration details below:

📘 Course Details:
• Subject: ${material.title}
• Package: ${selectedPkg?.title || 'Selected Package'} (${selectedPkg?.price || 'N/A'})

👤 Student Information:
• Full Name: ${formData.name}
• Email Address: ${formData.email}
• WhatsApp Number: ${formData.phone}

Kindly let me know the next steps for payment and how I can access the study materials.

Looking forward to your response.

Best regards,
${formData.name}`;
  };

  const handleEmailRedirect = () => {
    const subject = encodeURIComponent(`${material.title} Registration – ${formData.package.toUpperCase()} – ${formData.name}`);
    const body = encodeURIComponent(getMessageContent());
    window.open(`mailto:${contactInfo?.email || 'gboy90raj@gmail.com'}?subject=${subject}&body=${body}`);
  };

  const handleWhatsAppRedirect = () => {
    const body = encodeURIComponent(getMessageContent());
    const phone = contactInfo?.phone || '8429492976';
    // Remove any non-numeric characters from phone
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/91${cleanPhone.slice(-10)}?text=${body}`, '_blank');
  };

  const selectedPkg = material.packages?.find((p: any) => p.id === selectedPackage);
  const introParagraphs = material.introParagraphs || [];
  const features = material.features || [];
  const packages = material.packages || [];

  const getColorClass = (index: number) => {
    const colors = [
      'from-violet-500 to-purple-600',
      'from-sky-500 to-blue-600',
      'from-accent to-violet-700',
      'from-emerald-500 to-teal-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen pb-32">
      <PageHero
        eyebrow="Study Material"
        title={material.title}
        description={material.description}
      />

      {/* ─── INTRO LETTER ─────────────────────────────────────── */}
      {introParagraphs.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 md:px-12 pt-12">
          <Link href="/study-material" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-accent transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Materials
          </Link>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp}
            className="card-panel p-8 md:p-12 rounded-3xl border-l-4 border-l-accent"
          >
            <span className="eyebrow block mb-4">A Note to Students</span>
            {introParagraphs.map((para: string, idx: number) => (
              <p key={idx} className="text-slate-700 leading-relaxed font-light mb-4">
                {para}
              </p>
            ))}
            <p className="mt-6 font-bold text-accent text-sm tracking-wider uppercase">— Beyond Evidence</p>
          </motion.div>
        </section>
      )}

      {/* ─── WHAT YOU GET ─────────────────────────────────────── */}
      {features.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 md:px-12 py-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-10">
              <span className="eyebrow block mb-2">Included</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">What You Will Get</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((item: any, i: number) => {
                const Icon = IconMap[item.iconName] || BookOpen;
                return (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="card-panel p-7 flex flex-col gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-slate-900 text-base leading-tight">{item.title}</h3>
                    <p className="text-slate-500 text-sm font-light leading-relaxed">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── PRICING ──────────────────────────────────────────── */}
      {packages.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 md:px-12 pb-16">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="mb-10">
              <span className="eyebrow block mb-2">Pricing</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">Choose Your Package</h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.map((pkg: any, index: number) => {
                const colorClass = getColorClass(index);
                return (
                  <motion.button
                    key={pkg.id}
                    variants={fadeUp}
                    onClick={() => {
                      setSelectedPackage(pkg.id);
                      setFormData(p => ({ ...p, package: pkg.id }));
                      document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={cn(
                      "relative rounded-3xl p-7 text-left flex flex-col gap-4 border-2 transition-all duration-500 group",
                      selectedPackage === pkg.id
                        ? "border-accent shadow-xl shadow-accent/20 scale-[1.02]"
                        : "border-slate-100 bg-white hover:border-accent/30 hover:shadow-lg"
                    )}
                  >
                    {pkg.badge && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest">
                        {pkg.badge}
                      </span>
                    )}
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br", colorClass)}>
                      <BadgeIndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-slate-900 text-lg">{pkg.title}</p>
                      <p className="text-slate-400 text-sm font-light">{pkg.subtitle}</p>
                    </div>
                    <p className={cn("text-3xl font-display font-bold bg-gradient-to-r bg-clip-text text-transparent", colorClass)}>
                      {pkg.price}
                    </p>
                    {pkg.featuresList && pkg.featuresList.length > 0 && (
                      <ul className="space-y-2 border-t border-slate-100 pt-4">
                        {pkg.featuresList.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-light">
                            <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className={cn(
                      "inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mt-auto",
                      selectedPackage === pkg.id ? "text-accent" : "text-slate-400 group-hover:text-accent transition-colors"
                    )}>
                      {selectedPackage === pkg.id ? "Selected ✓" : "Select Package"}
                      {selectedPackage !== pkg.id && <ArrowRight className="w-3 h-3" />}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── REGISTRATION FORM ────────────────────────────────── */}
      {packages.length > 0 && (
        <section id="register-form" className="max-w-2xl mx-auto px-6 md:px-12 pb-16 scroll-mt-28">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="card-panel p-8 md:p-12">
              <div className="mb-8">
                <span className="eyebrow block mb-2">Enroll Now</span>
                <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Register to Get Started</h2>
                {selectedPkg && (
                  <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                    <Package className="w-4 h-4 text-accent" />
                    <span className="text-sm font-bold text-accent">{selectedPkg.title} — {selectedPkg.price}</span>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">Choose Your Platform</h3>
                    <p className="text-slate-500 font-light text-sm leading-relaxed max-w-sm mx-auto mb-8">
                      Send your registration details via Email or WhatsApp. We will reply with payment instructions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <button
                        onClick={handleWhatsAppRedirect}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#25D366] text-white font-bold text-sm uppercase tracking-widest hover:bg-[#128C7E] flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </button>
                      <button
                        onClick={handleEmailRedirect}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-sm uppercase tracking-widest hover:border-accent hover:text-accent flex items-center justify-center gap-3 transition-all hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <Mail className="w-5 h-5" />
                        Gmail / Email
                      </button>
                    </div>
                    <button onClick={() => setStatus('idle')} className="mt-8 text-xs font-bold text-slate-400 hover:text-accent uppercase tracking-widest transition-colors">
                      ← Go Back
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        WhatsApp Number <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXXXXXXX"
                          className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Package */}
                    <div>
                      <label htmlFor="package" className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                        Select Package <span className="text-accent">*</span>
                      </label>
                      <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                        <select
                          id="package"
                          name="package"
                          required
                          value={formData.package}
                          onChange={handleChange}
                          className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent focus:bg-white transition-all appearance-none"
                        >
                          <option value="">Choose a package</option>
                          {packages.map((pkg: any) => (
                            <option key={pkg.id} value={pkg.id}>
                              {pkg.title} — {pkg.price} {pkg.badge ? `★ ${pkg.badge}` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="w-full py-4 px-6 rounded-2xl bg-accent text-white font-bold text-sm uppercase tracking-widest hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 active:scale-95"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Registration
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-400 font-light leading-relaxed">
                      You will be asked to choose between Email or WhatsApp in the next step.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>
      )}

      {/* ─── FOOTER CTA ───────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 md:px-12 pb-8">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="rounded-3xl bg-slate-900 text-white p-10 md:p-14 relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-accent via-transparent to-violet-900 pointer-events-none" />
          <div className="relative z-10">
            <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 tracking-tight">
              Wishing You All the Best for Your Journey!
            </h2>
            <p className="text-slate-400 font-light text-sm leading-relaxed max-w-xl mx-auto mb-8">
              If you have any questions or need guidance during your preparation, feel free to reach out via the Contact page. We're here to support you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {packages.length > 0 && (
                <button
                  onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="pill-button bg-accent text-white hover:bg-violet-600 flex items-center gap-2 shadow-lg shadow-accent/30"
                >
                  Register Now <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <Link href="/contact" className="pill-button border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
