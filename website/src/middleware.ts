import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ─────────────────────────────────────────────────
//  RBAC: Public routes — no login required
// ─────────────────────────────────────────────────
const PUBLIC_PATHS = [
  '/',          // Home page (QR code landing)
  '/login',     // Login / Register page
  '/api',       // All API routes pass through
  '/_next',     // Next.js internals
  '/favicon',
  '/leimarembi_official_logo.png',
  '/leimarembi_logo_new.jpeg',
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p + '?'));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths through immediately
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Allow static files (_next/static, images, fonts, etc.)
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|otf|css|js|map)$/)
  ) {
    return NextResponse.next();
  }

  // Check for auth token in cookie (set by the login page)
  const token = request.cookies.get('lf_token')?.value;

  if (!token) {
    // Not logged in → redirect to register with the original destination
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('tab', 'register');
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
