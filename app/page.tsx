import Dashboard from '@/components/Dashboard';
import { getAllPosts, getAllLogs } from '@/lib/markdown';

export const revalidate = 3600;

export default async function Home() {
  const posts = await getAllPosts();
  const logs = await getAllLogs();
  const categories = ['All', ...Array.from(new Set(posts.flatMap(p => p.categories)))];

  return (
    <main className="w-full px-6 md:px-10 lg:px-16 xl:px-24">
      <Dashboard posts={posts} logs={logs} categories={categories} />
    </main>
  );
}
