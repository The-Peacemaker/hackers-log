import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/markdown';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const posts = await getAllPosts();
    const siteUrl = 'http://localhost:3000'; // Replace with actual production domain in prod

    let rssFeedXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Benedict's Notebook</title>
  <link>${siteUrl}</link>
  <description>Writings, low-level architecture, and security reports by Benedict.</description>
  <language>en-us</language>
  <atom:link href="${siteUrl}/feed" rel="self" type="application/rss+xml" />
`;

    posts.forEach(post => {
      rssFeedXml += `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${siteUrl}/blog/${post.slug}</link>
    <guid>${siteUrl}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description>${escapeXml(post.summary)}</description>
  </item>
`;
    });

    rssFeedXml += `</channel>
</rss>`;

    return new NextResponse(rssFeedXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate RSS feed' }, { status: 500 });
  }
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
