"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Database, X, LogIn } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';
import Logo from '../Logo';
import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { useAuth } from '@clerk/nextjs';
import ProtectedLink from '../ProtectedLink';

interface NavLink {
  label: string;
  href: string;
}

const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Courses', href: '/courses' },
  { label: 'Research', href: '/research' },
  { label: 'Quiz', href: '/quiz' },
  { label: 'Notification', href: '/notification' },
  { label: 'Study Material', href: '/study-material' },
  { label: 'Contact', href: '/contact' },
];

// Only show Studio CMS link if NEXT_PUBLIC_SHOW_STUDIO is explicitly set to 'true'
const SHOW_STUDIO = process.env.NEXT_PUBLIC_SHOW_STUDIO === 'true';

export default function SiteHeader({ headerLinks }: { headerLinks?: NavLink[] }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

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
        'fixed top-0 inset-x-0 z-50 transition-all duration-500 border-b flex items-center',
        isScrolled ? 'bg-white/90 backdrop-blur-lg border-slate-200/50 h-[60px] shadow-sm' : 'bg-transparent border-transparent h-[80px]'
      )}>
        <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Logo layoutId="site-logo" showIcon={!isScrolled} showSubtitle={false} />
          </Link>

          {/* Navigation and Actions grouped on the right */}
          <div className="flex items-center justify-between ml-auto gap-4 lg:gap-8 shrink-0">
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-8">
              {navLinks.map((link) => (
                <ProtectedLink
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-[11px] font-bold uppercase tracking-[0.12em] lg:tracking-[0.15em] transition-colors whitespace-nowrap",
                    pathname === link.href ? "text-accent" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {link.label}
                </ProtectedLink>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
              {/* Studio CMS — only visible when NEXT_PUBLIC_SHOW_STUDIO=true */}
              {SHOW_STUDIO && (
                <Link href="/studio" className="hidden lg:flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 hover:text-accent transition-colors whitespace-nowrap shrink-0">
                  <Database className="w-4 h-4" />
                  Studio CMS
                </Link>
              )}
              {/* Auth buttons & My Courses link */}
              {isSignedIn ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard/my-courses"
                    className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-violet-100 transition-all shadow-xs"
                  >
                    My Courses
                  </Link>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: 'w-8 h-8',
                      },
                    }}
                  />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <button className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#6d28d9] transition-all shadow-sm shrink-0 whitespace-nowrap">
                    <LogIn className="w-3.5 h-3.5" />
                    Sign In
                  </button>
                </SignInButton>
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
              <ProtectedLink
                key={link.href}
                href={link.href}
                className={cn(
                  "text-lg font-display font-bold tracking-tight transition-colors py-4 border-b border-slate-100",
                  pathname === link.href ? "text-accent" : "text-slate-900"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </ProtectedLink>
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
            {/* Mobile Auth */}
            {!isSignedIn && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                <SignInButton mode="modal">
                  <button className="flex-1 py-3 rounded-xl bg-accent text-white font-bold text-sm hover:bg-[#6d28d9] transition-all">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="flex-1 py-3 rounded-xl border-2 border-accent text-accent font-bold text-sm hover:bg-accent/5 transition-all">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
            {isSignedIn && (
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-10 h-10' } }} />
                <span className="text-sm font-bold text-slate-700">My Account</span>
              </div>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
