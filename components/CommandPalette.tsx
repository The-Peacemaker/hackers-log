'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchItem {
  title: string;
  description: string;
  url: string;
  type: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<SearchItem[]>([]);
  const [filtered, setFiltered] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load search index
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/search')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setItems(data);
            setFiltered(data);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
      
      // Focus input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter items
  useEffect(() => {
    if (!query) {
      setFiltered(items);
    } else {
      const q = query.toLowerCase();
      const matches = items.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
      );
      setFiltered(matches);
    }
    setSelectedIndex(0);
  }, [query, items]);

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          handleSelect(filtered[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex]);

  const handleSelect = (item: SearchItem) => {
    router.push(item.url);
    onClose();
  };

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.children[selectedIndex] as HTMLElement;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-background/40 command-palette-backdrop">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />
      
      <div className="w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[500px]">
        {/* Input area */}
        <div className="flex items-center px-4 py-3 border-b border-border space-x-3">
          <Search className="w-5 h-5 text-secondary-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-foreground placeholder:text-secondary-foreground text-sm focus:ring-0"
          />
          <button 
            onClick={onClose}
            className="text-[10px] uppercase border border-border px-1.5 py-0.5 rounded text-secondary-foreground hover:text-foreground"
          >
            Esc
          </button>
        </div>

        {/* Results */}
        <div 
          ref={listRef}
          className="overflow-y-auto flex-1 p-2 no-scrollbar"
        >
          {loading ? (
            <div className="py-12 text-center text-sm text-secondary-foreground">
              Building index...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-secondary-foreground">
              No results found for "{query}"
            </div>
          ) : (
            filtered.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.url + item.title}
                  onClick={() => handleSelect(item)}
                  className={`flex items-start justify-between px-4 py-3 rounded-md cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-border/50 text-foreground' 
                      : 'text-secondary-foreground hover:bg-border/20 hover:text-foreground'
                  }`}
                >
                  <div className="flex flex-col space-y-0.5 pr-4">
                    <span className="text-sm font-medium text-foreground">
                      {item.title}
                    </span>
                    <span className="text-xs line-clamp-1 text-secondary-foreground">
                      {item.description}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-mono border border-border/80 px-1.5 py-0.5 rounded bg-background shrink-0 mt-0.5">
                    {item.type}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
