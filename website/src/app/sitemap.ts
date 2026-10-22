import type { MetadataRoute } from 'next';
import { CANONICAL_ORIGIN } from '@/lib/seo';

/**
 * Dynamic XML Sitemap Generator for Leimarembi Foundation
 * Serves /sitemap.xml conforming to Google, Bing, and Search Engine standards.
 * Only enumerates public, canonical, indexable content. Excludes all private/auth routes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastUpdated = new Date('2026-10-20T00:00:00.000Z');

  const publicRoutes: {
    path: string;
    priority: number;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  }[] = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/health', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/donate', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/activities', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/culture', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/grants', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/news', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/gallery', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/members', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/ai', priority: 0.7, changeFrequency: 'monthly' },
  ];

  return publicRoutes.map((route) => ({
    url: `${CANONICAL_ORIGIN}${route.path}`,
    lastModified: lastUpdated,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
