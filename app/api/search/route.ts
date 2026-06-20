import { NextResponse } from 'next/server';
import { getAllPosts, getAllLogs } from '@/lib/markdown';

export async function GET() {
  try {
    const posts = await getAllPosts();
    const logs = await getAllLogs();

    const searchIndex = [
      // Pages
      { title: 'Writings & Logs', description: 'Benedict\'s notebook homepage and logs dashboard', url: '/', type: 'Page' },
      
      // Posts
      ...posts.map(post => ({
        title: post.title,
        description: post.summary || `Read post under ${post.categories[0]}`,
        url: `/blog/${post.slug}`,
        type: 'Article'
      })),

      // Logs
      ...logs.map(log => {
        const plainText = log.contentHtml.replace(/<[^>]*>/g, '').substring(0, 100);
        return {
          title: `Log Update: ${log.date}`,
          description: plainText,
          url: '/', // Directs to homepage where logs live
          type: 'Log'
        };
      })
    ];

    return NextResponse.json(searchIndex);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to build search index' }, { status: 500 });
  }
}
