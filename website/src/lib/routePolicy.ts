/**
 * Route Policy Definition for Leimarembi Foundation
 * Central classification of all application routes into public and private boundaries.
 */

export const PUBLIC_PAGES = [
  '/',
  '/about',
  '/activities',
  '/ai',
  '/contact',
  '/culture',
  '/donate',
  '/gallery',
  '/grants',
  '/health',
  '/news',
  '/members',
] as const;

export const PUBLIC_UTILITY_ROUTES = [
  '/login',
  '/register',
  '/manifest.webmanifest',
  '/offline.html',
  '/sw.js',
  '/robots.txt',
  '/sitemap.xml',
] as const;

export const PRIVATE_ROUTES = [
  '/portal',
  '/meetings',
  '/documents',
  '/management',
  '/superadmin',
] as const;

export function isPublicPath(pathname: string): boolean {
  if (!pathname) return false;
  // Strip search params and hashes if present
  const cleanPath = pathname.split('?')[0].split('#')[0];

  // Normalize pathname: remove trailing slash except for root '/'
  const normalized = cleanPath.length > 1 && cleanPath.endsWith('/')
    ? cleanPath.slice(0, -1)
    : cleanPath;

  // Exact public root
  if (normalized === '/') return true;

  // Exact public pages & subpages
  if (PUBLIC_PAGES.some(p => p !== '/' && (normalized === p || normalized.startsWith(p + '/')))) {
    return true;
  }

  // Public utility routes & subpages
  if (PUBLIC_UTILITY_ROUTES.some(p => normalized === p || normalized.startsWith(p + '/'))) {
    return true;
  }

  // Static assets & APIs
  if (
    normalized.startsWith('/_next') ||
    normalized.startsWith('/static') ||
    normalized.startsWith('/api') ||
    normalized.startsWith('/icons') ||
    normalized.startsWith('/members/') || // public member executive photos
    normalized.startsWith('/favicon') ||
    normalized === '/leimarembi_official_logo.png' ||
    normalized === '/leimarembi_logo_new.jpeg' ||
    normalized.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|otf|css|js|map|pdf|webmanifest|json|txt|xml)$/)
  ) {
    return true;
  }

  return false;
}

export function isPrivateRoute(pathname: string): boolean {
  if (!pathname) return false;
  const cleanPath = pathname.split('?')[0].split('#')[0];
  const normalized = cleanPath.length > 1 && cleanPath.endsWith('/')
    ? cleanPath.slice(0, -1)
    : cleanPath;
  return PRIVATE_ROUTES.some(p => normalized === p || normalized.startsWith(p + '/'));
}
