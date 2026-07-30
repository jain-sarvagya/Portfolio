'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  skills?: string[];
  points: string[];
}

interface ExperienceAccordionProps {
  experience: ExperienceItem[];
}

export default function ExperienceAccordion({ experience }: ExperienceAccordionProps) {
  // Keep the first item open by default
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const toggleIndex = (index: number) => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter((i) => i !== index));
    } else {
      setOpenIndices([...openIndices, index]);
    }
  };

  return (
    <div className="space-y-6 select-none relative pt-6">
      {/* Watermark Section Title */}
      <div className="absolute -top-3 left-0 pointer-events-none opacity-[0.03] select-none">
        <span className="text-6xl md:text-8xl font-black tracking-widest font-sans uppercase">EXPERIENCE</span>
      </div>

      <div className="border-b border-white/[0.08] pb-2 mb-8">
        <h3 className="text-sm font-mono font-bold tracking-widest text-slate-400">EXPERIENCE</h3>
      </div>

      <div className="border-t border-white/[0.08] divide-y divide-white/[0.08]">
        {experience.map((item, idx) => {
          const isOpen = openIndices.includes(idx);
          const formattedIndex = String(idx + 1).padStart(2, '0');

          return (
            <div key={idx} className="py-6 relative overflow-hidden group">
              {/* Giant Faint Index Watermark in the background (Always visible) */}
              <div className="absolute right-4 bottom-0 text-[10rem] md:text-[12rem] font-sans font-black text-transparent select-none pointer-events-none leading-none z-0 transition-opacity duration-500 opacity-[0.12] group-hover:opacity-[0.25] experience-watermark-text">
                {formattedIndex}
              </div>

              {/* Row Header Line */}
              <div 
                onClick={() => toggleIndex(idx)}
                className="flex items-center justify-between gap-4 cursor-pointer z-10 relative"
              >
                <div className="flex flex-wrap items-center gap-x-6 md:gap-x-12 gap-y-2">
                  {/* Small Index */}
                  <span className="text-xs font-mono text-slate-600 font-bold group-hover:text-slate-400 transition-colors">
                    {formattedIndex}
                  </span>

                  {/* Company & Role */}
                  <div className="flex flex-col">
                    <span className="text-base md:text-lg font-bold text-white font-sans tracking-wide">
                      {item.company}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-bold">
                      {item.role}
                    </span>
                  </div>

                  {/* Location */}
                  <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                    {item.role.toLowerCase().includes('training') ? 'Training' : 'Remote'}
                  </span>
                </div>

                {/* Duration & Toggle Button */}
                <div className="flex items-center gap-6">
                  <span className="text-xs font-mono text-slate-500 hidden md:inline">
                    {item.duration}
                  </span>

                  {/* Toggle Indicator Button */}
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.01] group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="text-slate-400 group-hover:text-white font-sans text-sm font-semibold"
                    >
                      +
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Skills/Tags List (Always Visible outside collapsible accordion) */}
              {item.skills && item.skills.length > 0 && (
                <div className="flex flex-wrap gap-2.5 pt-4 pl-8 md:pl-14 z-10 relative">
                  {item.skills.map((skill, skillIdx) => (
                    <span
                      key={skillIdx}
                      className="px-3.5 py-1 rounded-full border border-white/10 text-[10px] font-mono text-slate-300 bg-white/[0.01] hover:border-white/20 hover:text-white transition-colors duration-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Collapsible Bullet Points (Only text details collapse) */}
              <motion.div
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className="overflow-hidden z-10 relative"
              >
                <div className="pt-4 pl-8 md:pl-14 space-y-4 max-w-2xl">
                  {/* Mobile Duration display */}
                  <div className="text-[10px] font-mono text-slate-500 md:hidden flex items-center gap-2 pb-2">
                    <span>{item.duration}</span>
                    <span>•</span>
                    <span>{item.role.toLowerCase().includes('training') ? 'Training' : 'Remote'}</span>
                  </div>

                  {/* Bullet description points */}
                  <ul className="space-y-3">
                    {item.points.map((pt, ptIdx) => (
                      <li 
                        key={ptIdx} 
                        className="text-slate-400 text-sm font-sans font-light leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-slate-600 select-none mt-0.5 font-sans">—</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
