import type { Metadata } from 'next';

/**
 * Technical SEO & Structured Data Library for Leimarembi Foundation
 * Enforces canonical origin, URL normalization, metadata construction, and Schema.org JSON-LD.
 */

export const CANONICAL_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://leimarembifoundation.org').replace(/\/+$/, '');

/**
 * Strips tracking query parameters (e.g. ?qr=1, ?direct=1, utm_*, fbclid) and generates a clean canonical URL.
 */
export function getCanonicalUrl(path: string = '/'): string {
  // Strip query string and hash
  const cleanPath = path.split('?')[0].split('#')[0] || '/';
  // Normalize leading slash
  const withLeadingSlash = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  // Normalize trailing slash (remove trailing slash except for root '/')
  const normalized = withLeadingSlash.length > 1 && withLeadingSlash.endsWith('/')
    ? withLeadingSlash.slice(0, -1)
    : withLeadingSlash;

  return `${CANONICAL_ORIGIN}${normalized === '/' ? '' : normalized}`;
}

export interface BuildMetadataOptions {
  title: string;
  description: string;
  path?: string;
  ogType?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
}

/**
 * Builds a standardized, production-quality Next.js Metadata object with strict canonicals and OpenGraph.
 */
export function buildPageMetadata({
  title,
  description,
  path = '/',
  ogType = 'website',
  image = '/leimarembi_qr_preview.jpg',
  noIndex = false,
}: BuildMetadataOptions): Metadata {
  const canonicalUrl = getCanonicalUrl(path);
  const imageUrl = image.startsWith('http') ? image : `${CANONICAL_ORIGIN}${image.startsWith('/') ? image : `/${image}`}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Leimarembi Foundation`,
      description,
      url: canonicalUrl,
      siteName: 'Leimarembi Foundation',
      locale: 'en_IN',
      type: ogType,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${title} - Leimarembi Foundation`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Leimarembi Foundation`,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

/**
 * Returns Schema.org Organization (NGO) JSON-LD entity.
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    '@id': `${CANONICAL_ORIGIN}/#organization`,
    name: 'Leimarembi Foundation',
    alternateName: ['Leimarembi Charitable Trust', 'লাইমারেম্বী ফাউণ্ডেশন'],
    url: CANONICAL_ORIGIN,
    logo: {
      '@type': 'ImageObject',
      url: `${CANONICAL_ORIGIN}/leimarembi_official_logo.png`,
      width: '512',
      height: '512',
    },
    image: `${CANONICAL_ORIGIN}/leimarembi_qr_preview.jpg`,
    foundingDate: '2001',
    description: 'Recognized non-profit public charitable trust dedicated to indigenous cultural preservation, rural healthcare welfare, educational grants, and community development across Northeast India.',
    taxID: 'AAATL4938EE20234',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Manipuri Rajbari, Ulubari',
      addressLocality: 'Guwahati',
      addressRegion: 'Assam',
      postalCode: '781007',
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+91-9707499079',
        contactType: 'general inquiries',
        email: 'leimarembifoundation@gmail.com',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Manipuri', 'Assamese', 'Bengali'],
      },
    ],
    sameAs: [
      'https://leimarembifoundation.org',
    ],
  };
}

/**
 * Returns Schema.org WebSite JSON-LD entity.
 */
export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${CANONICAL_ORIGIN}/#website`,
    url: CANONICAL_ORIGIN,
    name: 'Leimarembi Foundation',
    description: 'Official Digital Governance & Public Welfare Portal for Leimarembi Foundation.',
    publisher: {
      '@id': `${CANONICAL_ORIGIN}/#organization`,
    },
    inLanguage: 'en-IN',
  };
}

/**
 * Returns Schema.org BreadcrumbList JSON-LD entity.
 */
export function getBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

/**
 * Returns Schema.org ContactPage JSON-LD entity.
 */
export function getContactPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${CANONICAL_ORIGIN}/contact#webpage`,
    url: `${CANONICAL_ORIGIN}/contact`,
    name: 'Contact Leimarembi Foundation',
    description: 'Get in touch with the Leimarembi Foundation administrative team, trustees, and community healthcare volunteers.',
    isPartOf: {
      '@id': `${CANONICAL_ORIGIN}/#website`,
    },
    about: {
      '@id': `${CANONICAL_ORIGIN}/#organization`,
    },
  };
}

/**
 * Returns Schema.org Community Health Clinic JSON-LD for /health.
 */
export function getHealthCampJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': `${CANONICAL_ORIGIN}/health#clinic`,
    name: 'Leimarembi Foundation Rural Health & Senior Welfare Camps',
    description: 'Community health clinics providing free consultations, preventive screenings, senior citizen care, and essential medicines on the 15th and 30th of every month.',
    url: `${CANONICAL_ORIGIN}/health`,
    parentOrganization: {
      '@id': `${CANONICAL_ORIGIN}/#organization`,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Manipuri Rajbari, Ulubari',
      addressLocality: 'Guwahati',
      addressRegion: 'Assam',
      postalCode: '781007',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '15:00',
        description: 'Bi-monthly rural medical camp on 15th and 30th of every month',
      },
    ],
  };
}
