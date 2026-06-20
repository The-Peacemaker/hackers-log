'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PostHeader {
  slug: string;
  title: string;
  date: string;
  category: string;
  categories: string[];
  tags: string[];
  readingTime: string;
  summary: string;
}

interface LogData {
  id: string;
  date: string;
  contentHtml: string;
}

interface DashboardProps {
  posts: PostHeader[];
  logs: LogData[];
  categories: string[];
}

const getCategoryIcon = (cat: string) => {
  switch (cat.toLowerCase()) {
    case 'all': return 'nf-md-format_list_bulleted_square';
    case 'security': return 'nf-md-shield_lock_outline';
    case 'open source': return 'nf-md-source_branch';
    case 'computer science': return 'nf-md-chip';
    case 'ai': return 'nf-md-robot_outline';
    default: return 'nf-md-file_document_outline';
  }
};

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <button onClick={toggle} className="theme-toggle" title="Toggle theme">
      <span className={`nf ${dark ? 'nf-md-weather_sunny' : 'nf-md-weather_night'}`} />
    </button>
  );
}

export default function Dashboard({ posts, logs, categories }: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(post => post.categories.includes(activeCategory));

  // Group by year
  const groupedPosts: { [key: string]: PostHeader[] } = {};
  filteredPosts.forEach(post => {
    const year = new Date(post.date).getFullYear().toString();
    if (!groupedPosts[year]) groupedPosts[year] = [];
    groupedPosts[year].push(post);
  });
  const years = Object.keys(groupedPosts).sort((a, b) => b.localeCompare(a));

  return (
    <>
      {/* ─── Top Navigation Bar ─── */}
      <header className="site-header">
        <div className="flex items-start justify-between">
          {/* Left: Name + tagline */}
          <div>
            <h1 className="hero-name flex items-baseline gap-3">
              Benedict&apos;s Notebook
            </h1>
            <p className="hero-authors">
              Computer Science &middot; Vulnerability Research &middot; Open Source
            </p>
          </div>

          {/* Right: Nav links */}
          <nav className="hidden sm:flex items-center gap-4 pt-3">
            <a href="https://benedictchacko.tech/" target="_blank" rel="noopener noreferrer" className="nav-link flex items-center gap-1.5" title="Portfolio">
              <span className="nf nf-md-account_tie text-base" />
              Portfolio
            </a>
            <a href="https://github.com/The-Peacemaker" target="_blank" rel="noopener noreferrer" className="nav-link flex items-center gap-1.5">
              <span className="nf nf-md-github text-base" />
              GitHub
            </a>
            <a href="https://linkedin.com/in/benedict-chacko" target="_blank" rel="noopener noreferrer" className="nav-link flex items-center gap-1.5">
              <span className="nf nf-md-linkedin text-base" />
              LinkedIn
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      {/* ─── Hero Description ─── */}
      <section className="py-6 border-b border-[var(--border)]">
        <p className="hero-description">
          <span className="nf nf-md-fountain_pen_tip mr-2 text-base opacity-50" />
          I write about vulnerability research, systems architecture, and the 
          craft of building software that lasts. This is my digital notebook &mdash;
          long-form writings and short daily logs from the terminal.
        </p>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`nav-pill ${activeCategory === cat ? 'active' : ''}`}
            >
              <span className={`nf ${getCategoryIcon(cat)} text-xs`} />
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ─── Split Content Area ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 pt-6">

        {/* ─── Left Column: Writings (2/3) ─── */}
        <div className="lg:col-span-2 lg:pr-12">

          {/* Section label */}
          <div className="section-label flex items-center gap-2">
            <span className="nf nf-md-typewriter text-sm" />
            Writings
          </div>

          {/* Posts */}
          {years.length === 0 ? (
            <div className="py-16 text-center text-sm text-[var(--muted)]">
              <span className="nf nf-md-magnify text-2xl block mb-3 opacity-30" />
              No writings found in this category.
            </div>
          ) : (
            years.map(year => (
              <div key={year} className="mb-6">
                <div className="year-label flex items-center gap-2">
                  <span className="nf nf-md-calendar_blank_outline text-xs" />
                  {year}
                </div>
                <div>
                  {groupedPosts[year].map(post => (
                    <Link 
                      href={`/blog/${post.slug}`} 
                      key={post.slug} 
                      className="post-item"
                    >
                      <div className="post-item-meta">
                        <span className="flex items-center gap-1">
                          <span className="nf nf-md-calendar_text text-[10px]" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="sep">|</span>
                        <span className="flex items-center gap-1">
                          <span className="nf nf-md-timer_sand text-[10px]" />
                          {post.readingTime}
                        </span>
                        <span className="sep">|</span>
                        <span className="flex items-center gap-1">
                          <span className={`nf ${getCategoryIcon(post.category)} text-[10px]`} />
                          {post.category}
                        </span>
                      </div>
                      <h3 className="post-item-title">{post.title}</h3>
                      {post.summary && (
                        <p className="post-item-summary">{post.summary}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ─── Right Column: Activity Log (1/3) ─── */}
        <div className="lg:col-span-1 log-sidebar hidden lg:block">
          <div className="sticky top-8">
            <div className="log-sidebar-title flex items-center gap-2">
              <span className="nf nf-md-console_line text-sm" />
              Activity Log
            </div>

            {logs.length === 0 ? (
              <div className="text-sm text-[var(--muted)] font-serif italic">
                <span className="nf nf-md-console text-lg block mb-2 opacity-30" />
                No logs recorded yet.
              </div>
            ) : (
              logs.map(log => {
                const formattedDate = new Date(log.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });

                return (
                  <div key={log.id} className="log-entry">
                    <div className="log-date flex items-center gap-1.5">
                      <span className="nf nf-md-calendar_clock text-[10px]" />
                      {formattedDate}
                    </div>
                    <div 
                      className="log-body"
                      dangerouslySetInnerHTML={{ __html: log.contentHtml }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ─── Footer ─── */}
      <footer className="site-footer">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
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
    </>
  );
}
