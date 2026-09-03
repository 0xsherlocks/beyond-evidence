"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useClerk, useUser } from '@clerk/nextjs';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeIndianRupee,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,

  Mail,
  Package,
  Phone,
  Send,
  Sparkles,
  Target,
  User,
} from 'lucide-react';
import PageHero from '@/src/components/PageHero';
import SecurePdfViewer from '@/src/components/SecurePdfViewer';
import { cn } from '@/src/lib/utils';


const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const IconMap: Record<string, any> = {
  BadgeIndianRupee,
  BookOpen,
  ClipboardList,
  FileText,
  Sparkles,
  Target,
};

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

type PaidAccess = {
  hasAccess: boolean;
  courseName?: string;
  packageName?: string;
  downloadLinks?: Array<{ title?: string; url?: string }>;
};

function loadRazorpayScript() {
  return new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function StudyMaterialDetailClient({
  material,
}: {
  material: any;
  contactInfo?: { email: string; phone: string };
}) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { redirectToSignIn } = useClerk();
  const packages = material.packages || [];
  const defaultPackageId = packages.length > 0 ? packages[packages.length - 1].id : '';
  const [selectedPackage, setSelectedPackage] = useState<string>(defaultPackageId);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    package: defaultPackageId,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [paidAccess, setPaidAccess] = useState<PaidAccess | null>(null);
  const [activeDoc, setActiveDoc] = useState<{ url: string; title?: string } | null>(null);
  const [purchasedPackageIds, setPurchasedPackageIds] = useState<string[]>([]);


  const selectedPkg = packages.find((pkg: any) => pkg.id === selectedPackage);
  const introParagraphs = material.introParagraphs || [];
  const features = material.features || [];

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    setFormData((prev) => ({
      ...prev,
      name: prev.name || user.fullName || '',
      email: prev.email || user.primaryEmailAddress?.emailAddress || '',
    }));
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !selectedPackage || !material.slug) return;

    let cancelled = false;

    async function checkPaidAccess() {
      try {
        const response = await fetch(
          `/api/study-material-access?slug=${encodeURIComponent(material.slug)}&packageId=${encodeURIComponent(selectedPackage)}`,
          { cache: 'no-store' }
        );

        if (!response.ok) return;

        const access = await response.json();

        if (!cancelled) {
          if (access.purchasedPackageIds) {
            setPurchasedPackageIds(access.purchasedPackageIds);
          }
          if (access.hasAccess) {
            setPaidAccess(access);
            setStatus('success');
          } else {
            setPaidAccess(null);
            setStatus('idle');
          }
        }
      } catch (error) {
        // Checkout still performs full server-side checks; this only restores access on revisit.
      }
    }

    checkPaidAccess();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, material.slug, selectedPackage]);

  const getColorClass = (index: number) => {
    const colors = [
      'from-violet-500 to-purple-600',
      'from-sky-500 to-blue-600',
      'from-accent to-violet-700',
      'from-emerald-500 to-teal-600',
    ];
    return colors[index % colors.length];
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setFormData((prev) => ({ ...prev, package: packageId }));
    setPaidAccess(null);
    setStatus('idle');
    setErrorMessage('');
    document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'package') {
      handlePackageSelect(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    if (!isSignedIn) {
      await redirectToSignIn({ redirectUrl: window.location.href } as any);
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        throw new Error('Unable to load Razorpay checkout. Please check your connection and try again.');
      }

      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: material.slug,
          packageId: formData.package,
        }),
      });

      if (orderResponse.status === 401) {
        await redirectToSignIn({ redirectUrl: window.location.href } as any);
        return;
      }

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData?.error || 'Unable to create payment order.');
      }

      const paymentResult: any = await new Promise((resolve, reject) => {
        const razorpay = new (window as any).Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Beyond Evidence',
          description: `${orderData.courseName} - ${orderData.packageName}`,
          order_id: orderData.orderId,
          prefill: {
            name: formData.name || user?.fullName || '',
            email: formData.email || user?.primaryEmailAddress?.emailAddress || '',
            contact: formData.phone,
          },
          theme: { color: '#7c3aed' },
          handler: resolve,
          modal: {
            ondismiss: () => reject(new Error('Payment was cancelled.')),
          },
        });

        razorpay.on('payment.failed', (response: any) => {
          reject(new Error(response?.error?.description || 'Payment failed.'));
        });

        razorpay.open();
      });

      const verifyResponse = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentResult),
      });
      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        throw new Error(verifyData?.error || 'Payment verification failed.');
      }

      // After successful payment, redirect to dashboard/my-courses
      window.location.href = verifyData.redirectUrl || '/dashboard/my-courses';
    } catch (error: any) {
      setErrorMessage(error?.message || 'Payment could not be completed. Please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <PageHero
        eyebrow="Study Material"
        title={material.title}
        description={material.description}
        imageUrl={material.imageUrl}
      />

      {introParagraphs.length > 0 && (
        <section className="max-w-4xl mx-auto px-6 md:px-12 pt-12">
          <Link href="/study-material" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-accent transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to All Materials
          </Link>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="card-panel p-8 md:p-12 rounded-3xl border-l-4 border-l-accent"
          >
            <span className="eyebrow block mb-4">A Note to Students</span>
            {introParagraphs.map((para: string, idx: number) => (
              <p key={idx} className="text-slate-700 leading-relaxed font-light mb-4">
                {para}
              </p>
            ))}
            <p className="mt-6 font-bold text-accent text-sm tracking-wider uppercase">Beyond Evidence</p>
          </motion.div>
        </section>
      )}

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
                  <motion.div key={i} variants={fadeUp} className="card-panel p-7 flex flex-col gap-4 group">
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
                const isPurchased = purchasedPackageIds.includes(pkg.id);
                return (
                  <motion.button
                    key={pkg.id}
                    type="button"
                    variants={fadeUp}
                    onClick={() => {
                      if (isPurchased) {
                        window.location.href = '/dashboard/my-courses';
                      } else {
                        handlePackageSelect(pkg.id);
                      }
                    }}
                    className={cn(
                      'relative rounded-3xl p-7 text-left flex flex-col gap-4 border-2 transition-all duration-500 group',
                      isPurchased
                        ? 'border-green-500 shadow-xl shadow-green-500/20 bg-green-50/30'
                        : selectedPackage === pkg.id
                          ? 'border-accent shadow-xl shadow-accent/20 scale-[1.02]'
                          : 'border-slate-100 bg-white hover:border-accent/30 hover:shadow-lg'
                    )}
                  >
                    {isPurchased ? (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Purchased
                      </span>
                    ) : pkg.badge ? (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-widest">
                        {pkg.badge}
                      </span>
                    ) : null}
                    
                    <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br', isPurchased ? 'from-green-500 to-emerald-600' : colorClass)}>
                      {isPurchased ? <CheckCircle2 className="w-5 h-5" /> : <BadgeIndianRupee className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-display font-bold text-slate-900 text-lg">{pkg.title}</p>
                      <p className="text-slate-400 text-sm font-light">{pkg.subtitle}</p>
                    </div>
                    <p className={cn('text-3xl font-display font-bold bg-gradient-to-r bg-clip-text text-transparent', isPurchased ? 'from-green-500 to-emerald-600' : colorClass)}>
                      {pkg.price}
                    </p>
                    {pkg.featuresList && pkg.featuresList.length > 0 && (
                      <ul className="space-y-2 border-t border-slate-100 pt-4">
                        {pkg.featuresList.map((feature: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-light">
                            <CheckCircle2 className={cn("w-4 h-4 shrink-0 mt-0.5", isPurchased ? "text-green-500" : "text-accent")} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span
                      className={cn(
                        'inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest mt-auto',
                        isPurchased ? 'text-green-600' : selectedPackage === pkg.id ? 'text-accent' : 'text-slate-400 group-hover:text-accent transition-colors'
                      )}
                    >
                      {isPurchased ? 'Go to My Courses' : selectedPackage === pkg.id ? 'Selected' : 'Select Package'}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </section>
      )}

      {packages.length > 0 && (
        <section id="register-form" className="max-w-2xl mx-auto px-6 md:px-12 pb-16 scroll-mt-28">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="card-panel p-8 md:p-12">
              <div className="mb-8">
                <span className="eyebrow block mb-2">Secure Checkout</span>
                <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Complete Your Purchase</h2>
                {selectedPkg && (
                  <div className="mt-4 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                    <Package className="w-4 h-4 text-accent" />
                    <span className="text-sm font-bold text-accent">{selectedPkg.title} - {selectedPkg.price}</span>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {purchasedPackageIds.includes(selectedPackage) ? (
                  <motion.div
                    key="purchased-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">You Own This Package</h3>
                    <p className="text-slate-500 font-light text-sm leading-relaxed max-w-sm mx-auto mb-8">
                      You have already purchased access to this study material. Go to your dashboard to access your secure notes.
                    </p>
                    <Link
                      href="/dashboard/my-courses"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                    >
                      <BookOpen className="w-4 h-4 shrink-0" />
                      Go to My Courses
                    </Link>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {status === 'error' && errorMessage && (
                      <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

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
                              {pkg.title} - {pkg.price} {pkg.badge ? `* ${pkg.badge}` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'submitting' || !isLoaded}
                      className="w-full py-4 px-6 rounded-2xl bg-accent text-white font-bold text-sm uppercase tracking-widest hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 active:scale-95"
                    >
                      {status === 'submitting' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Opening Checkout...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          {isSignedIn ? 'Pay with Razorpay' : 'Sign In to Purchase'}
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-400 font-light leading-relaxed">
                      Price is verified securely from Sanity before Razorpay checkout opens.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </section>
      )}

      <section className="max-w-4xl mx-auto px-6 md:px-12 pb-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="rounded-3xl bg-slate-900 text-white p-10 md:p-14 relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-accent via-transparent to-violet-900 pointer-events-none" />
          <div className="relative z-10">
            <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 tracking-tight">
              Wishing You All the Best for Your Journey!
            </h2>
            <p className="text-slate-400 font-light text-sm leading-relaxed max-w-xl mx-auto mb-8">
              If you have any questions or need guidance during your preparation, feel free to reach out via the Contact page.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {packages.length > 0 && (
                <button
                  onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="pill-button bg-accent text-white hover:bg-violet-600 flex items-center gap-2 shadow-lg shadow-accent/30"
                >
                  {status === 'success' ? 'View Access' : 'Buy Now'} <ArrowRight className="w-4 h-4" />
                </button>
              )}
              <Link href="/contact" className="pill-button border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white">
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {activeDoc && (
        <SecurePdfViewer
          url={activeDoc.url}
          title={activeDoc.title}
          onClose={() => setActiveDoc(null)}
        />
      )}
    </div>
  );
}

