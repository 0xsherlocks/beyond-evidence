"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, Database } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import Logo from '../Logo';

export default function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Topics', path: '/topics' },
    { name: 'Research Desk', path: '/research' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b',
      isScrolled ? 'bg-white/60 backdrop-blur-lg border-slate-200/50 py-3 shadow-sm' : 'bg-transparent border-transparent py-5'
    )}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Logo showIcon={!isScrolled} showSubtitle={false} />
        </Link>
        <nav className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={cn(
                "text-[11px] font-bold uppercase tracking-[0.2em] transition-colors",
                pathname === link.path ? "text-accent" : "text-slate-600 hover:text-slate-900"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button className="p-2 text-slate-500 hover:text-slate-900 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <Link href="/studio" className="hidden lg:flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-accent transition-colors">
            <Database className="w-4 h-4" />
            Studio CMS
          </Link>
          <button className="md:hidden p-2 text-slate-900">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
