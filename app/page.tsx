'use client';

import { useState, useEffect } from 'react';
import TerminalWindow from '@/components/TerminalWindow';
import MatrixRain from '@/components/MatrixRain';
import BootSequence from '@/components/BootSequence';

export default function Home() {
  const [matrixActive, setMatrixActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="flex items-center justify-center h-screen">
      {isLoading ? (
        <BootSequence onComplete={() => setIsLoading(false)} />
      ) : (
        <>
          {matrixActive && <MatrixRain />}
          <TerminalWindow onMatrixToggle={setMatrixActive} matrixActive={matrixActive} />
        </>
      )}
    </main>
  );
}
