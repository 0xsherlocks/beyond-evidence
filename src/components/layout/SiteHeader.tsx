"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Database, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import Logo from '../Logo';

interface NavLink {
  label: string;
  href: string;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Syllabus', href: '/syllabus' },
  { label: 'Research', href: '/research' },
  { label: 'Quiz', href: '/quiz' },
  { label: 'Study Material', href: '/study-material' },
  { label: 'Contact', href: '/contact' },
];

// Only show Studio CMS link if NEXT_PUBLIC_SHOW_STUDIO is explicitly set to 'true'
const SHOW_STUDIO = process.env.NEXT_PUBLIC_SHOW_STUDIO === 'true';

export default function SiteHeader({ headerLinks }: { headerLinks?: NavLink[] }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = headerLinks && headerLinks.length > 0 ? headerLinks : DEFAULT_NAV_LINKS;

  return (
    <>
      <header className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b',
        isScrolled ? 'bg-white/60 backdrop-blur-lg border-slate-200/50 py-3 shadow-sm' : 'bg-transparent border-transparent py-5'
      )}>
        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Logo showIcon={!isScrolled} showSubtitle={false} />
          </Link>
          
          {/* Navigation and Actions grouped on the right */}
          <div className="flex items-center gap-8 lg:gap-16">
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-8 lg:gap-12">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.2em] transition-colors whitespace-nowrap",
                    pathname === link.href ? "text-accent" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-6">
              {/* Studio CMS — only visible when NEXT_PUBLIC_SHOW_STUDIO=true */}
              {SHOW_STUDIO && (
                <Link href="/studio" className="hidden lg:flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-accent transition-colors whitespace-nowrap">
                  <Database className="w-4 h-4" />
                  Studio CMS
                </Link>
              )}
              {/* Mobile menu toggle */}
              <button 
                className="md:hidden p-2 text-slate-900"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden overflow-y-auto">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-lg font-display font-bold tracking-tight transition-colors py-4 border-b border-slate-100",
                  pathname === link.href ? "text-accent" : "text-slate-900"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* Studio CMS — hidden from students in production */}
            {SHOW_STUDIO && (
              <Link
                href="/studio"
                className="flex items-center gap-3 text-sm font-bold text-slate-500 hover:text-accent transition-colors mt-4 py-3"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Database className="w-4 h-4" />
                Studio CMS
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
