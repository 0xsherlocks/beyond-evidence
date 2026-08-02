"use client";

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  className?: string;
  showText?: boolean;
  showIcon?: boolean;
  showSubtitle?: boolean;
  layoutId?: string;
  size?: 'default' | 'intro';
}

export default function Logo({ className, showText = true, showIcon = true, showSubtitle = true, layoutId, size = 'default' }: LogoProps) {
  const iconSizeClass = size === 'intro' ? 'w-16 h-16 md:w-20 md:h-20' : 'w-12 h-12';
  const textSizeClass = size === 'intro' ? 'text-2xl md:text-3xl' : 'text-lg';
  const subtitleSpacingClass = size === 'intro' ? 'mt-2.5' : 'mt-1.5';
  const gapClass = size === 'intro' ? 'gap-4' : 'gap-3';

  return (
    <div className={cn("flex items-center group", gapClass, className)}>
      <motion.div
        layoutId={layoutId}
        layout
        transition={{ layout: { type: 'spring', stiffness: 160, damping: 22 } }}
        style={{ willChange: 'transform, opacity' }}
        className={cn(
          "relative shrink-0 flex items-center justify-center transition-all duration-500 rounded-full overflow-hidden",
          showIcon ? iconSizeClass : "w-0 h-0 opacity-0 overflow-hidden"
        )}
      >
        {/* Replace the SVG with the uploaded logo image */}
        <Image
          src="/logo.png"
          alt="Beyond Evidence Logo"
          fill
          className={cn("object-cover mix-blend-multiply", size === 'intro' && "object-contain")}
          style={{
            filter: "contrast(1.1) brightness(1.05)",
            WebkitMaskImage: "radial-gradient(circle, black 50%, transparent 70%)",
            maskImage: "radial-gradient(circle, black 50%, transparent 80%)"
          }}
          priority
        />
      </motion.div>
      {showText && (
        <div className="flex flex-col">
          <motion.span
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={cn("font-display font-bold leading-none tracking-tight text-slate-900 group-hover:text-accent transition-colors", textSizeClass)}
          >
            BEYOND EVIDENCE
          </motion.span>
          {showSubtitle && (
            <motion.span
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={cn("text-[7px] uppercase tracking-[0.3em] font-bold text-accent flex flex-col gap-0.5", subtitleSpacingClass)}
            >
              <span>WHERE SCIENCE</span>
              <span>MEETS INVESTIGATION</span>
            </motion.span>
          )}
        </div>
      )}
    </div>
  );
}
