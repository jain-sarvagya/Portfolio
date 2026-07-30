'use strict';

'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for lag-effect (feels much more premium)
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 175); // offsets for glow radius
      mouseY.set(e.clientY - 175);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 hidden lg:block"
      style={{
        left: springX,
        top: springY,
        width: 350,
        height: 350,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.035) 0%, rgba(255, 255, 255, 0.01) 50%, rgba(0, 0, 0, 0) 100%)',
        filter: 'blur(30px)',
      }}
    />
  );
}
