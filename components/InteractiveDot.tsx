'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function InteractiveDot() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring animations for a organic magnetic feel
  const springX = useSpring(x, { stiffness: 120, damping: 15 });
  const springY = useSpring(y, { stiffness: 120, damping: 15 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const dotX = rect.left + rect.width / 2;
      const dotY = rect.top + rect.height / 2;
      
      const distanceX = e.clientX - dotX;
      const distanceY = e.clientY - dotY;
      
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // If mouse is within 150px, pull the dot slightly towards the cursor
      if (distance < 150) {
        setHovered(true);
        // Clamp pull to a max radius of 16px (so it stays within the outer ring)
        const pullRadius = 14;
        const angle = Math.atan2(distanceY, distanceX);
        const intensity = (150 - distance) / 150; // stronger pull closer to center
        
        x.set(Math.cos(angle) * pullRadius * intensity);
        y.set(Math.sin(angle) * pullRadius * intensity);
      } else {
        setHovered(false);
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <div 
      ref={ref}
      className="w-16 h-16 rounded-full border border-white/[0.12] flex items-center justify-center relative transition-colors duration-300 hover:border-white/30"
    >
      <motion.div
        className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        style={{ x: springX, y: springY }}
        animate={hovered ? { scale: 1.3 } : { scale: 1 }}
      />
    </div>
  );
}
