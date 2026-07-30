'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('portfolio-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('portfolio-theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-12 h-6 rounded-full border border-white/20 p-1 flex items-center justify-start opacity-60">
        <div className="w-4 h-4 rounded-full bg-white" />
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-6 rounded-full border p-1 flex items-center cursor-pointer transition-all relative duration-300"
      style={{
        borderColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.3)',
        justifyContent: theme === 'dark' ? 'flex-end' : 'flex-start',
      }}
      aria-label="Toggle Theme"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className="w-4 h-4 rounded-full"
        style={{
          backgroundColor: theme === 'dark' ? '#ffffff' : '#000000',
        }}
      />
    </button>
  );
}
