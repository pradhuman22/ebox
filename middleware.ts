import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

const authRoute = ['/login', '/register', '/forgot-password', '/reset-password'];

const publicRoute = [
  '/',
  '/events',
  '/events/:path*',
  '/how-it-works',
  '/api/webhook/stripe',
  '/email-verified',
];

export const apiAuthPrefix = '/api/auth';

const isRoutePublic = (pathname: string) => {
  return publicRoute.some(route => {
    if (route.includes(':path*')) {
      const baseRoute = route.split('/:path*')[0];
      return pathname.startsWith(baseRoute);
    }
    return route === pathname;
  });
};

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const sessionCookie = getSessionCookie(req);

  const isLoggedIn = !!sessionCookie;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = isRoutePublic(nextUrl.pathname);
  const isAuthRoute = authRoute.includes(nextUrl.pathname);
  if (isApiAuthRoute) {
    return NextResponse.next();
  }
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard/profile', nextUrl));
    }
    return NextResponse.next();
  }
  if (!isPublicRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
