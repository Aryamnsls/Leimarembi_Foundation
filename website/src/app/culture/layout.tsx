import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Cultural Heritage Archive - Traditions, Music & Cuisine',
  description: 'Explore traditional Manipuri indigenous culture, classical dance heritage, sacred Pena musical arts, cultural festival calendar, and authentic culinary recipes.',
  path: '/culture',
});

export default function CultureLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
