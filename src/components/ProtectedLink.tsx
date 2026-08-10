"use client";

import Link, { LinkProps } from "next/link";
import React from "react";

interface ProtectedLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  children: React.ReactNode;
}

export default function ProtectedLink({ href, children, ...props }: ProtectedLinkProps) {
  // Navigation is no longer blocked. The AuthModalGuard on the destination page
  // will handle popping up the optional sign-in modal as a reminder.
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
