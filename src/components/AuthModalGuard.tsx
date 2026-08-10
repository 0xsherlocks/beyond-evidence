"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthModalGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      openSignIn({
        afterSignInUrl: window.location.pathname,
      });
      // Optionally, push them back to home if they close the modal without signing in?
      // For now, let's just show the modal. 
    }
  }, [isLoaded, isSignedIn, openSignIn]);

  if (!isLoaded || !isSignedIn) {
    // Show nothing (or a blur) while modal is open to prevent seeing protected content
    return <div className="min-h-screen bg-slate-50/50 backdrop-blur-sm" />;
  }

  return <>{children}</>;
}
