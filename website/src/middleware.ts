import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { isPublicPath } from './lib/routePolicy';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths through immediately without authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token in cookie (set by the login page)
  const token = request.cookies.get('lf_token')?.value;

  if (!token) {
    // Not logged in → redirect to login with the original destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('tab', 'login');
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }


  // Token exists → allow through
  return NextResponse.next();
}

export const config = {
  // Run middleware on every route except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
