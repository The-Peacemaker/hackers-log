import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import PostInteractions from '@/components/PostInteractions';
import ThemeToggleButton from '@/components/ThemeToggleButton';
import InteractiveContent from '@/components/InteractiveContent';
import { getPostBySlug, getAllPosts } from '@/lib/markdown';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(post => ({
    slug: post.slug,
  }));
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'security': return 'nf-md-shield_lock_outline';
    case 'open source': return 'nf-md-source_branch';
    case 'computer science': return 'nf-md-chip';
    case 'ai': return 'nf-md-robot_outline';
    default: return 'nf-md-file_document_outline';
  }
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch (error) {
    notFound();
  }

  const allPosts = await getAllPosts();
  const excludedSlugs = slug === 'silent-invigilator' ? ['quantflow'] : [];
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug && !excludedSlugs.includes(p.slug) && p.categories.some(c => post.categories.includes(c)))
    .slice(0, 2);
  const finalRelated = relatedPosts.length > 0 
    ? relatedPosts 
    : allPosts.filter(p => p.slug !== slug && !excludedSlugs.includes(p.slug)).slice(0, 2);

  return (
    <>
      <ReadingProgressBar />
      <PostInteractions toc={post.toc} />

      <main className="w-full px-3 sm:px-4 lg:px-6">
        
        {/* Top nav */}
        <header className="site-header">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-serif text-lg tracking-tight text-[var(--foreground)] hover:opacity-70 transition-opacity flex items-center gap-2">
              Benedict&apos;s Notebook
            </Link>
            <nav className="flex items-center gap-3">
              <Link href="/" className="nav-link flex items-center gap-1">
                <span className="nf nf-md-arrow_left text-xs" />
                All Writings
              </Link>
              <a href="https://github.com/The-Peacemaker" target="_blank" rel="noopener noreferrer" className="nav-link flex items-center gap-1">
                <span className="nf nf-md-github text-base" />
                GitHub
              </a>
              <ThemeToggleButton />
            </nav>
          </div>
        </header>

        <div className="flex gap-8 pt-4 max-w-full">
          
          {/* Table of Contents - Fixed Left Sidebar */}
          <aside className="hidden lg:block flex-shrink-0 w-56">
            {post.toc.length > 0 && (
              <div className="sticky top-8 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 custom-scrollbar">
                <div className="section-label flex items-center gap-2 mb-4 text-[11px]">
                  <span className="nf nf-md-format_list_bulleted text-sm" />
                  Contents
                </div>
                <nav className="space-y-0.5 relative pl-3 border-l border-[var(--border)]">
                  {post.toc.map((item) => {
                    const indent = item.level > 2 ? 'ml-3' : '';
                    return (
                      <a
                        key={item.id}
                        id={`toc-link-${item.id}`}
                        href={`#${item.id}`}
                        className={`toc-link block text-[0.7rem] leading-relaxed text-[var(--muted)] hover:text-[var(--foreground)] transition-all duration-200 py-0.5 -ml-3 pl-3 border-l-2 border-transparent hover:border-[var(--foreground)] ${indent}`}
                      >
                        {item.text}
                      </a>
                    );
                  })}
                </nav>

                {slug === 'silent-invigilator' && (
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <a
                    href={`https://github.com/The-Peacemaker/Silent-Invigilator`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[0.65rem] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors group"
                  >
                    <span className="nf nf-fa-github text-sm" />
                    <span>View on GitHub</span>
                  </a>
                </div>
                )}
              </div>
            )}
          </aside>

          {/* Article content - fills remaining space */}
          <div className="flex-1 min-w-0 max-w-4xl">
            
            {/* Metadata */}
            <div className="meta-line mb-1">
              <span className="flex items-center gap-1">
                <span className="nf nf-md-calendar_text text-xs" />
                Published {post.date}
              </span>
              <span className="sep">|</span>
              <span className="flex items-center gap-1">
                <span className="nf nf-md-timer_sand text-xs" />
                {post.readingTime}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl xl:text-4xl leading-[1.15] tracking-tight mt-3 mb-4">
              {post.title}
            </h1>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.categories.map(cat => (
                <span 
                  key={cat}
                  className="text-[0.6rem] text-[var(--foreground)] border border-[var(--foreground)] px-2 py-0.5 rounded flex items-center gap-1 font-semibold"
                >
                  <span className={`nf ${getCategoryIcon(cat)} text-[10px]`} />
                  {cat}
                </span>
              ))}
            </div>

            {/* Tags + GitHub link */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {post.tags.map(tag => (
                <span 
                  key={tag}
                  className="text-[0.6rem] text-[var(--muted)] border border-[var(--border)] px-2 py-0.5 rounded flex items-center gap-1"
                >
                  <span className="nf nf-md-tag_outline text-[10px]" />
                  {tag}
                </span>
              ))}
              {slug === 'silent-invigilator' && (
              <>
              <span className="mx-1 text-[var(--border)]">·</span>
              <a
                href={`https://github.com/The-Peacemaker/Silent-Invigilator`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.6rem] text-[var(--muted)] border border-[var(--border)] px-2 py-0.5 rounded flex items-center gap-1 hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-colors"
              >
                <span className="nf nf-fa-github text-xs" />
                GitHub
              </a>
              </>
              )}
            </div>

            <hr className="border-[var(--border)] mb-8" />

            {/* Body */}
            <InteractiveContent html={post.contentHtml} />

            <hr className="border-[var(--border)] my-10" />

            {/* Related */}
            <section className="mb-8">
              <div className="section-label flex items-center gap-2 mb-5">
                <span className="nf nf-md-link_variant text-sm" />
                Related writings
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {finalRelated.map(rp => (
                  <Link 
                    href={`/blog/${rp.slug}`} 
                    key={rp.slug}
                    className="block border border-[var(--border)] rounded-md p-5 hover:bg-[var(--surface)] transition-colors"
                  >
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1">
                      <span className="nf nf-md-calendar_text text-[10px]" />
                      {rp.date}
                    </span>
                    <h4 className="font-serif text-lg mt-1 leading-snug">
                      {rp.title}
                    </h4>
                    <p className="text-sm text-[var(--secondary)] line-clamp-2 leading-relaxed mt-1">
                      {rp.summary}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Back */}
            <div className="pb-8">
              <Link 
                href="/" 
                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5"
              >
                <span className="nf nf-md-arrow_left text-xs" />
                Back to all writings
              </Link>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="site-footer">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <span className="nf nf-md-console text-sm" />
              {new Date().getFullYear()} Benedict
            </span>
            <div className="flex items-center gap-5">
              <a href="https://benedictchacko.tech/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5">
                <span className="nf nf-md-account_tie" /> Portfolio
              </a>
              <a href="https://github.com/The-Peacemaker" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5">
                <span className="nf nf-md-github" /> GitHub
              </a>
              <a href="https://linkedin.com/in/benedict-chacko" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5">
                <span className="nf nf-md-linkedin" /> LinkedIn
              </a>
              <a href="mailto:benedictcm1@gmail.com" className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5">
                <span className="nf nf-md-email_fast_outline" /> Email
              </a>
              <a href="/feed" className="hover:text-[var(--foreground)] transition-colors flex items-center gap-1.5">
                <span className="nf nf-md-rss" /> RSS
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
