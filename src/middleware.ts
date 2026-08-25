import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/reader']

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname

  // Always forward the pathname so the root RSC layout can conditionally
  // strip the site header/footer for full-screen routes.
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', path)

  // Protect dashboard and reader routes at the edge
  if (PROTECTED_PREFIXES.some(prefix => path.startsWith(prefix))) {
    const { userId } = await auth()
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', path)
      return NextResponse.redirect(signInUrl)
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};


