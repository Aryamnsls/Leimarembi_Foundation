export const runtime = 'edge';

import { NextResponse } from 'next/server';

const UNSPLASH_ACCESS_KEYS = [
  process.env.UNSPLASH_ACCESS_KEY,
  'vuk-VrJDMI8qxZ_92YUpjRvggnuwQ-lfWlMOFvylj8c',
  'wBktuiBB5TkchxLdMLXasfgG15A-FTdUUvlJQn79x6k'
].filter(Boolean);

export async function GET() {
  const queryTopics = ['Manipur', 'Loktai Lake', 'Imphal', 'Northeast India nature', 'Manipur landscape'];
  const randomTopic = queryTopics[Math.floor(Math.random() * queryTopics.length)];

  for (const key of UNSPLASH_ACCESS_KEYS) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(randomTopic)}&orientation=landscape&content_filter=high`,
        {
          headers: {
            Authorization: `Client-ID ${key}`,
          },
          next: { revalidate: 60 } // cache for 60 seconds
        }
      );

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data?.urls?.regular || data?.urls?.full;
        const photographer = data?.user?.name;
        const photographerUrl = data?.user?.links?.html;

        if (imageUrl) {
          return NextResponse.json({
            url: imageUrl,
            photographer,
            photographerUrl,
            topic: randomTopic
          });
        }
      }
    } catch (error) {
      console.error('Failed fetching Unsplash image with key:', error);
    }
  }

  // Fallback to static local background if API fails or rate limit reached
  const randomBg = Math.floor(Math.random() * 4) + 1;
  return NextResponse.json({
    url: `/bg${randomBg}.jpg`,
    isFallback: true
  });
}
