'use client';

import { useState, useEffect } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface PostInteractionsProps {
  toc: TocItem[];
}

export default function PostInteractions({ toc }: PostInteractionsProps) {
  const [activeId, setActiveId] = useState<string>('');

  // Active heading scroll highlighting
  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-10% 0px -70% 0px',
        threshold: 0.1
      }
    );

    toc.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  // Active TOC link styling
  useEffect(() => {
    if (!activeId) return;
    toc.forEach(item => {
      const linkEl = document.getElementById(`toc-link-${item.id}`);
      if (linkEl) {
        if (item.id === activeId) {
          linkEl.classList.add('text-foreground', 'border-l-[var(--foreground)]', 'font-semibold');
          linkEl.classList.remove('text-[var(--muted)]', 'border-transparent');
        } else {
          linkEl.classList.remove('text-foreground', 'border-l-[var(--foreground)]', 'font-semibold');
          linkEl.classList.add('text-[var(--muted)]', 'border-transparent');
        }
      }
    });
  }, [activeId, toc]);

  return null;
}
