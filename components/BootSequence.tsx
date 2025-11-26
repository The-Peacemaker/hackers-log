'use client';

import { useState, useEffect } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
  const [lines, setLines] = useState<string[]>([]);
  
  const bootText = [
    "INITIALIZING SYSTEM...",
    "LOADING KERNEL MODULES...",
    "MOUNTING VOLUMES: /dev/sda1...",
    "CHECKING INTEGRITY... OK",
    "LOADING USER PROFILE: root@benedict",
    "DECRYPTING SECURE STORAGE...",
    "ESTABLISHING UPLINK...",
    "CONNECTION SECURE.",
    "STARTING TERMINAL SESSION..."
  ];

  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex >= bootText.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
        return;
      }

      setLines(prev => [...prev, bootText[currentIndex]]);
      currentIndex++;
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#050505] text-[#00ff41] font-mono z-50 flex items-center justify-center">
      <div className="w-[400px] p-4">
        {lines.map((line, index) => (
          <div key={index} className="mb-1 text-xs md:text-sm font-bold opacity-90">
            <span className="mr-2 text-green-700">[{((index + 1) * 0.13).toFixed(4)}]</span>
            {line}
          </div>
        ))}
        <div className="mt-6 relative h-2 w-full bg-[#111] rounded-sm overflow-hidden border border-green-900/50">
            <div 
                className="h-full bg-[#00ff41] shadow-[0_0_10px_#00ff41]"
                style={{ 
                  width: `${(lines.length / bootText.length) * 100}%`, 
                  transition: 'width 0.1s ease-out' 
                }}
            />
            {/* Scanline effect for the bar */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.2)_50%,transparent_100%)] opacity-30 w-full h-full" />
        </div>
      </div>
    </div>
  );
}
