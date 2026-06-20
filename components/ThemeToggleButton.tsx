'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggleButton() {
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
