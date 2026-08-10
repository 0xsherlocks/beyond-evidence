"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface ProtectedLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
  children: React.ReactNode;
}

export default function ProtectedLink({ href, children, onClick, ...props }: ProtectedLinkProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // Determine if this specific link goes to a protected route
    const isProtectedRoute = href.toString().startsWith('/courses') || href.toString().startsWith('/research');

    // If not loaded yet, let Next.js handle navigation (it will be caught by AuthModalGuard)
    if (!isLoaded) {
      if (onClick) onClick(e);
      return;
    }

    if (isProtectedRoute && !isSignedIn) {
      // Prevent navigation
      e.preventDefault();
      // Open modal overlay
      openSignIn({
        afterSignInUrl: href.toString(),
      });
    } else {
      // Allow normal Link navigation, or call custom onClick
      if (onClick) {
        onClick(e);
      }
    }
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
