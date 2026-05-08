import type { Metadata } from "next";
import { Sora, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/src/components/layout/SiteHeader";
import Link from "next/link";
import Logo from "@/src/components/Logo";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${sora.variable} ${spaceGrotesk.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`} suppressHydrationWarning>
        <SiteHeader />
        <main className="flex-1">
          {children}
        </main>
        <footer className="py-6 mt-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-4 text-center md:text-left transition-all duration-300">
              <Logo showText={true} />
              <div className="flex items-center justify-center md:justify-start gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <Link href="/about" className="hover:text-accent transition-colors">About</Link>
                <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
                <Link href="/legal" className="hover:text-accent transition-colors">Legal</Link>
              </div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">&copy; {new Date().getFullYear()} BEYOND EVIDENCE. ALL RIGHTS RESERVED.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
