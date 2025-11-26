'use client';

import { useState, useEffect } from 'react';
import FileList from './FileList';
import PreviewPane from './PreviewPane';
import CommandBar from './CommandBar';
import TopBar from './TopBar';
import { FileItem } from '@/types';
import { fileSystem } from '@/lib/fileSystem';

interface TerminalWindowProps {
  onMatrixToggle: (active: boolean) => void;
  matrixActive: boolean;
}

export default function TerminalWindow({ onMatrixToggle, matrixActive }: TerminalWindowProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(fileSystem.length - 1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const selectedFile = fileSystem[selectedIndex];

  const activateGlitch = () => {
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 500);
  };

  return (
    <div
      className={`w-[85%] h-[80%] max-w-6xl flex flex-col overflow-hidden rounded-lg border-2 relative z-10 transition-all duration-500 ${
        glitchActive ? 'glitch-active' : ''
      }`}
      style={{
        backgroundColor: 'var(--bg)',
        borderColor: 'var(--curr-line)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
      }}
    >
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        <FileList
          files={fileSystem}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
        />
        <PreviewPane file={selectedFile} />
      </div>

      <CommandBar
        onMatrixToggle={onMatrixToggle}
        matrixActive={matrixActive}
        onGlitch={activateGlitch}
      />
    </div>
  );
}
