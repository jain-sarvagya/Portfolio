'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    setMounted(true);

    // Disable custom cursor on touch devices / mobile screens
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobile = window.innerWidth <= 1024;
    
    if (isTouchDevice || isMobile) {
      return;
    }

    setIsVisible(true);
    // Add global class to hide default cursor
    document.documentElement.classList.add('custom-cursor-active');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Global event listener to detect hover on interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' ||
        target.closest('a') || 
        target.closest('button') || 
        target.closest('input') || 
        target.closest('textarea') ||
        target.classList.contains('cursor-pointer') ||
        target.closest('.cursor-pointer');

      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.classList.remove('custom-cursor-active');
    };
  }, [mouseX, mouseY]);

  if (!mounted || !isVisible) return null;

  return (
    <motion.div
      className="fixed w-3 h-3 rounded-full bg-white pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
      style={{ left: mouseX, top: mouseY, mixBlendMode: 'difference' }}
      animate={{
        scale: isHovered ? 2.2 : 1,
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 1)',
        border: isHovered ? '1px solid rgba(255, 255, 255, 0.8)' : 'none',
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
    />
  );
}
