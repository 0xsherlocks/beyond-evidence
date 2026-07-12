import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/src/components/layout/SiteHeader";
import Link from "next/link";
import Logo from "@/src/components/Logo";
import { getNavigation } from "@/src/sanity/queries";
import { ClerkProvider } from "@clerk/nextjs";

// Force dynamic rendering so navigation always reflects latest Sanity data
export const dynamic = 'force-dynamic';

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Beyond Evidence",
  description: "A curated database for technical investigators, bridging theoretical research, field SOPs, and advanced laboratory methodology.",
  icons: {
    icon: "/icon-circle.png",
  },
};

const DEFAULT_HEADER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Syllabus', href: '/syllabus' },
  { label: 'Research', href: '/research' },
  { label: 'Quiz', href: '/quiz' },
  { label: 'Competitive Exams', href: '/study-material' },
  { label: 'Contact', href: '/contact' },
];

const DEFAULT_FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Legal', href: '/legal' },
];

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let nav;
  try {
    nav = await getNavigation();
  } catch (e) {
    nav = null;
  }

  const HOME_LINK = { label: 'Home', href: '/' };
  let rawHeaderLinks = nav?.headerLinks?.length > 0 ? nav.headerLinks : DEFAULT_HEADER_LINKS;
  
  // Force rename 'Study Material' to 'Competitive Exams' if it came from Sanity
  rawHeaderLinks = rawHeaderLinks.map((link: any) => {
    if (link.href === '/study-material') {
      return { ...link, label: 'Competitive Exams' };
    }
    return link;
  });

  // Force inject Competitive Exams if it's missing from Sanity's DB
  const hasStudyMaterial = rawHeaderLinks.some((link: any) => link.href === '/study-material');
  if (!hasStudyMaterial) {
    // Replace UGC-NET or Topics if they exist, otherwise append before Contact
    const updatedLinks = [];
    let added = false;
    for (const link of rawHeaderLinks) {
      if (link.href === '/ugc-net' || link.href === '/topics' || link.label === 'UGC-NET' || link.label === 'Topics') {
        if (!added) {
          updatedLinks.push({ label: 'Competitive Exams', href: '/study-material' });
          added = true;
        }
      } else {
        updatedLinks.push(link);
      }
    }
    
    if (!added) {
      // Insert right before Contact
      const contactIdx = updatedLinks.findIndex((l: any) => l.href === '/contact');
      if (contactIdx >= 0) {
        updatedLinks.splice(contactIdx, 0, { label: 'Competitive Exams', href: '/study-material' });
      } else {
        updatedLinks.push({ label: 'Competitive Exams', href: '/study-material' });
      }
    }
    rawHeaderLinks = updatedLinks;
  }

  const headerLinks = rawHeaderLinks[0]?.href === '/' ? rawHeaderLinks : [HOME_LINK, ...rawHeaderLinks];
  const footerLinks = nav?.footerLinks?.length > 0 ? nav.footerLinks : DEFAULT_FOOTER_LINKS;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${sora.variable} ${spaceGrotesk.variable} antialiased min-h-screen flex flex-col bg-transparent text-foreground`} suppressHydrationWarning>
        <ClerkProvider>
        <SiteHeader headerLinks={headerLinks} />
        <main className="flex-1">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-slate-50/60 mt-20">
          {/* Main Footer Grid */}
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

              {/* Column 1: Logo + About */}
              <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-4">
                <Link href="/">
                  <Logo showText={true} showIcon={true} showSubtitle={true} />
                </Link>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                  Empowering the next generation of forensic experts with premium study materials, live job alerts, and research guidance.
                </p>
              </div>

              {/* Column 2: Study */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 mb-1">Study</h4>
                <Link href="/syllabus" className="text-sm text-slate-500 hover:text-accent transition-colors">Syllabus</Link>
                <Link href="/quiz" className="text-sm text-slate-500 hover:text-accent transition-colors">Mock Tests & Quizzes</Link>
                <Link href="/study-material" className="text-sm text-slate-500 hover:text-accent transition-colors">Competitive Exams</Link>
                <Link href="/research" className="text-sm text-slate-500 hover:text-accent transition-colors">Research Papers</Link>
              </div>

              {/* Column 3: Career */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 mb-1">Career</h4>
                <Link href="/notification" className="text-sm text-slate-500 hover:text-accent transition-colors">Job Alerts</Link>
                <Link href="/notification" className="text-sm text-slate-500 hover:text-accent transition-colors">Exam Notifications</Link>
                <Link href="/notification" className="text-sm text-slate-500 hover:text-accent transition-colors">Internships</Link>
                <Link href="/notification" className="text-sm text-slate-500 hover:text-accent transition-colors">Scholarships</Link>
              </div>

              {/* Column 4: About */}
              <div className="flex flex-col gap-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900 mb-1">About</h4>
                <Link href="/about" className="text-sm text-slate-500 hover:text-accent transition-colors">About Us</Link>
                <Link href="/contact" className="text-sm text-slate-500 hover:text-accent transition-colors">Contact</Link>
                <Link href="/legal" className="text-sm text-slate-500 hover:text-accent transition-colors">Legal</Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-200 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
              <span>Beyond Evidence &copy; {new Date().getFullYear()}</span>
              <div className="flex items-center gap-6">
                {footerLinks.map((link: any, i: number) => (
                  <span key={link.href} className="flex items-center gap-6">
                    {i > 0 && <span className="text-slate-200">|</span>}
                    <Link href={link.href} className="hover:text-accent transition-colors">{link.label}</Link>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
