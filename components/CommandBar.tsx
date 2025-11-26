'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';
import { CommandResponse } from '@/types';

interface CommandBarProps {
  onMatrixToggle: (active: boolean) => void;
  matrixActive: boolean;
  onGlitch: () => void;
}

export default function CommandBar({ onMatrixToggle, matrixActive, onGlitch }: CommandBarProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [response, setResponse] = useState<CommandResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setTheme } = useTheme();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/bg-audio/Memory Reboot x A Real Hero (Slowed Reverb).mp3');
    audioRef.current.loop = true;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const showResponse = (text: string, type: CommandResponse['type'], duration = 3000) => {
    setResponse({ text, type, duration });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setResponse(null);
    }, duration);
  };

  const simulateHack = (target: string) => {
    const stages = ["CONNECTING...", "BYPASSING FIREWALL...", "INJECTING PAYLOAD...", "ROOT ACCESS GRANTED"];
    let i = 0;

    const nextStage = () => {
      if (i < stages.length) {
        showResponse(`[${target.toUpperCase()}] ${stages[i]}`, i === stages.length - 1 ? 'success' : 'info', 800);
        i++;
        setTimeout(nextStage, 800);
      } else {
        setTimeout(() => setResponse(null), 3000);
      }
    };

    nextStage();
  };

  const activateDarkProtocol = () => {
    showResponse("ACCESS GRANTED. GOING DARK.", "success");
    setTheme('hacker');
    onGlitch();
    if (!matrixActive) onMatrixToggle(true);
  };

  const handleCommand = (cmdRaw: string) => {
    const trimmedCmd = cmdRaw.trim();
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, cmdRaw]);
    setHistoryIndex(null);
    setInput('');

    const parts = trimmedCmd.split(' ');
    const cmd = parts[0].toLowerCase();
    const arg = parts[1];

    switch (cmd) {
      case 'go':
        if (arg === 'dark') activateDarkProtocol();
        else showResponse("Command 'go' requires argument", "error");
        break;

      case 'help':
        showResponse("TRY: theme [name], matrix, music, whoami, hack [target]", "info");
        break;

      case 'music':
        if (isPlaying) {
          audioRef.current?.pause();
          setIsPlaying(false);
          showResponse("MUSIC PAUSED", "info");
        } else {
          audioRef.current?.play()
            .then(() => {
              setIsPlaying(true);
              showResponse("PLAYING BACKGROUND MUSIC...", "success");
            })
            .catch(e => showResponse("AUDIO ERROR: " + e.message, "error"));
        }
        break;

      case 'theme':
        if (['dracula', 'gruvbox', 'hacker', 'github'].includes(arg)) {
          setTheme(arg as any);
          showResponse(`THEME SWITCHED TO ${arg.toUpperCase()}`, "success");
        } else {
          showResponse("AVAILABLE: dracula, gruvbox, hacker, github", "error");
        }
        break;

      case 'matrix':
        onMatrixToggle(!matrixActive);
        showResponse("MATRIX PROTOCOL TOGGLED", "success");
        break;

      case 'whoami':
        showResponse("root@benedict", "success");
        break;

      case 'sudo':
        showResponse("NICE TRY. PERMISSION DENIED.", "error");
        break;

      case 'hack':
        if (!arg) {
          showResponse("USAGE: hack [target]", "error");
        } else {
          simulateHack(arg);
        }
        break;

      default:
        showResponse(`COMMAND '${cmd}' NOT FOUND`, "error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      
      const newIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === null) return;
      
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else {
        setHistoryIndex(null);
        setInput('');
      }
    }
  };

  useEffect(() => {
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const getResponseColor = () => {
    if (!response) return 'var(--fg)';
    if (response.type === 'success') return 'var(--green)';
    if (response.type === 'error') return 'var(--red)';
    return 'var(--cyan)';
  };

  return (
    <div
      className="h-10 flex items-center px-4 text-[13px] transition-all duration-500"
      style={{
        backgroundColor: 'var(--curr-line)',
        borderTop: '1px solid var(--bg)',
      }}
    >
      <span className="font-bold mr-1.5" style={{ color: 'var(--purple)' }}>COMMAND</span>
      <span className="mr-2" style={{ color: 'var(--pink)' }}>&gt;&gt;&gt;</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 bg-transparent border-none outline-none font-mono text-[13px] ml-2 focus:ring-0"
        style={{ color: 'var(--fg)' }}
        placeholder="Type 'help' for options..."
        autoComplete="off"
        spellCheck="false"
        autoFocus
      />
      {response && (
        <div
          className="ml-2.5 font-bold whitespace-nowrap transition-opacity duration-500"
          style={{ color: getResponseColor() }}
        >
          {response.text}
        </div>
      )}
    </div>
  );
}
