import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/src/components/layout/SiteHeader";
import Link from "next/link";
import Logo from "@/src/components/Logo";
import { getNavigation } from "@/src/sanity/queries";

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
  { label: 'Study Material', href: '/study-material' },
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
  
  // Force inject Study Material if it's missing from Sanity's DB
  const hasStudyMaterial = rawHeaderLinks.some((link: any) => link.href === '/study-material');
  if (!hasStudyMaterial) {
    // Replace UGC-NET or Topics if they exist, otherwise append before Contact
    const updatedLinks = [];
    let added = false;
    for (const link of rawHeaderLinks) {
      if (link.href === '/ugc-net' || link.href === '/topics' || link.label === 'UGC-NET' || link.label === 'Topics') {
        if (!added) {
          updatedLinks.push({ label: 'Study Material', href: '/study-material' });
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
        updatedLinks.splice(contactIdx, 0, { label: 'Study Material', href: '/study-material' });
      } else {
        updatedLinks.push({ label: 'Study Material', href: '/study-material' });
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
        <SiteHeader headerLinks={headerLinks} />
        <main className="flex-1">
          {children}
        </main>
        <footer className="py-6 mt-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-4 text-center md:text-left transition-all duration-300">
              <Logo showText={true} />
              <div className="flex items-center justify-center md:justify-start gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                {footerLinks.map((link: any) => (
                  <Link key={link.href} href={link.href} className="hover:text-accent transition-colors">{link.label}</Link>
                ))}
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">&copy; {new Date().getFullYear()} BEYOND EVIDENCE. ALL RIGHTS RESERVED.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
