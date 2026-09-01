import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;
  const queryTopics = ['Manipur', 'Loktak Lake', 'Imphal', 'Northeast India nature', 'Manipur landscape'];
  const randomTopic = queryTopics[Math.floor(Math.random() * queryTopics.length)];

  if (apiKey) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/photos/random?query=${encodeURIComponent(randomTopic)}&orientation=landscape&content_filter=high`,
        {
          headers: {
            Authorization: `Client-ID ${apiKey}`,
          },
          next: { revalidate: 300 } // cache for 5 minutes
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
      console.error('Failed fetching Unsplash image:', error);
    }
  }

  // Fallback to static local background if API key is missing, API fails, or rate limit is reached
  const randomBg = Math.floor(Math.random() * 4) + 1;
  return NextResponse.json({
    url: `/bg${randomBg}.jpg`,
    isFallback: true
  });
}
