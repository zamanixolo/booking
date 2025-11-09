import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const protectedRoutes = createRouteMatcher(['/user/:id', '/admin/:path*']);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Block unauthorized users at server-edge
  if (protectedRoutes(req) && !userId) {
    const signInUrl = new URL('/user', req.url)
   
    signInUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/user/:path*', '/admin/:path*'],
};
