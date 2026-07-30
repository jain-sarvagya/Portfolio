'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedGrid() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-black">
      {/* Moving background grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Futuristic glowing orbs (Monochrome grey/white textures only) */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-white/[0.015] blur-[100px]"
        animate={{
          x: [0, 100, -50, 0],
          y: [0, 80, 120, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ top: '10%', left: '5%' }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-white/[0.01] blur-[120px]"
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 100, -80, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ bottom: '15%', right: '5%' }}
      />

      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full bg-white/[0.012] blur-[90px]"
        animate={{
          x: [0, 80, -100, 0],
          y: [0, -120, 60, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ top: '40%', left: '35%' }}
      />
    </div>
  );
}
