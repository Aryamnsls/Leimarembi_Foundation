import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Executive Committee & Foundation Leadership',
  description: 'Meet the Trustees and Executive Board of Leimarembi Foundation, led by President Dr. Phuritsabam Birmani, Secretary M. Bina Babu Singha, and community leaders.',
  path: '/members',
});

export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
