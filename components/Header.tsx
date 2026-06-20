'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import CommandPalette from '@/components/CommandPalette';

export default function Header() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen(prev => !prev);
      }
    };
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className={`header-bar transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="nf nf-dev-terminal text-base text-amber-600 group-hover:text-amber-500 transition-colors" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase font-medium text-foreground">
              Benedict
            </span>
            <span className="status-dot ml-1" />
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="social-icon !w-9 !h-9 !rounded-lg"
              title="Search (Ctrl+K)"
            >
              <span className="nf nf-fa-search text-sm" />
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-border mx-1" />

            {/* GitHub */}
            <a
              href="https://github.com/benedii"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon !w-9 !h-9 !rounded-lg"
              title="GitHub"
            >
              <span className="nf nf-fa-github text-base" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/benedict"
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon !w-9 !h-9 !rounded-lg"
              title="LinkedIn"
            >
              <span className="nf nf-fa-linkedin text-base" />
            </a>

            {/* Cmd+K Badge */}
            <div className="hidden sm:flex items-center gap-1 ml-1 text-[10px] font-mono text-muted border border-border rounded-md px-2 py-1 bg-white/50">
              <span className="nf nf-md-keyboard text-xs mr-0.5" />
              Ctrl+K
            </div>
          </div>
        </div>
      </header>

      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  );
}
