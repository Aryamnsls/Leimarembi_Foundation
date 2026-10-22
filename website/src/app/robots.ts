import type { MetadataRoute } from 'next';
import { CANONICAL_ORIGIN } from '@/lib/seo';

/**
 * Native robots.txt Generator for Leimarembi Foundation
 * Serves /robots.txt to search engines and AI crawlers.
 * Disallows private administrative directories and APIs while permitting indexing of public content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/management/',
          '/superadmin/',
          '/portal/',
          '/meetings/',
          '/documents/',
          '/api/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/management/',
          '/superadmin/',
          '/portal/',
          '/meetings/',
          '/documents/',
          '/api/',
        ],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'ClaudeBot', 'PerplexityBot'],
        allow: [
          '/',
          '/about',
          '/activities',
          '/contact',
          '/culture',
          '/donate',
          '/gallery',
          '/grants',
          '/health',
          '/news',
          '/members',
        ],
        disallow: [
          '/management/',
          '/superadmin/',
          '/portal/',
          '/meetings/',
          '/documents/',
          '/api/',
        ],
      },
    ],
    sitemap: `${CANONICAL_ORIGIN}/sitemap.xml`,
  };
}
