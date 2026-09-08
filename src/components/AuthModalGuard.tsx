"use client";

import { useAuth, useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function AuthModalGuard({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      openSignIn();
    }
  }, [isLoaded, isSignedIn, openSignIn]);

  // Render the page content so it's optional, but the popup still appears as a reminder
  return <>{children}</>;
}
