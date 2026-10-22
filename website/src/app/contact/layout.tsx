import type { Metadata } from 'next';
import { buildPageMetadata, getContactPageJsonLd } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact Us - Office Location & Enquiries',
  description: 'Contact Leimarembi Foundation at Manipuri Rajbari, Guwahati, Assam. Phone lines, official email, and community outreach enquiries.',
  path: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = JSON.stringify(getContactPageJsonLd()).replace(/</g, '\\u003c');
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      {children}
    </>
  );
}
