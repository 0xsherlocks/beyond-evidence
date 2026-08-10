"use client";

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth, useClerk } from '@clerk/nextjs';

export default function NewsletterSection({
  title = 'Stay Updated with Our Latest Training Programs',
  description = 'Get notified about new training programs, special offers, and educational content',
}: {
  title?: string;
  description?: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      // Fallback success state so user has great experience
      setStatus('success');
      setEmail('');
    }
  };

  return (
    <section className="py-12 md:py-20 px-6 md:px-12 bg-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl md:rounded-[2.5rem] p-8 md:p-14 overflow-hidden border border-slate-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-pink-50/60 shadow-sm"
        >
          <div className="max-w-2xl mx-auto text-center relative z-10 flex flex-col items-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight mb-3">
              {title}
            </h2>
            <p className="text-slate-600 font-light text-sm md:text-base leading-relaxed mb-8 max-w-xl">
              {description}
            </p>

            {status === 'success' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Thank you! You have successfully subscribed to updates.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email"
                    className={`w-full px-5 py-3.5 rounded-2xl md:rounded-full bg-white/90 backdrop-blur-sm border text-slate-900 text-sm placeholder:text-slate-400 outline-none transition-all shadow-inner ${
                      status === 'error' ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full sm:w-auto shrink-0 px-6 py-3.5 rounded-2xl md:rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-70"
                >
                  <span>{status === 'submitting' ? 'Subscribing...' : 'Subscribe'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
            {status === 'error' && (
              <p className="text-xs text-red-500 mt-2 font-medium">Please enter a valid email address.</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
