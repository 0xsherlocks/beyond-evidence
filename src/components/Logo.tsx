import React from 'react';
import Image from 'next/image';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  showIcon?: boolean;
  showSubtitle?: boolean;
}

export default function Logo({ className, showText = true, showIcon = true, showSubtitle = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3 group", className)}>
      <div className={cn(
        "relative shrink-0 flex items-center justify-center transition-all duration-500 rounded-full",
        showIcon ? "w-12 h-12 opacity-95" : "w-0 h-0 opacity-0 overflow-hidden"
      )}>
        {/* Replace the SVG with the uploaded logo image */}
        <Image
          src="/logo.png"
          alt="Beyond Evidence Logo"
          fill
          className="object-cover mix-blend-multiply"
          style={{
            filter: "contrast(1.1) brightness(1.05)",
            WebkitMaskImage: "radial-gradient(circle, black 50%, transparent 70%)",
            maskImage: "radial-gradient(circle, black 50%, transparent 80%)"
          }}
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg leading-none tracking-tight text-slate-900 group-hover:text-accent transition-colors">
            BEYOND EVIDENCE
          </span>
          {showSubtitle && (
            <span className="text-[7px] uppercase tracking-[0.3em] font-bold text-accent mt-1.5 flex flex-col gap-0.5">
              <span>WHERE SCIENCE</span>
              <span>MEETS INVESTIGATION</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
