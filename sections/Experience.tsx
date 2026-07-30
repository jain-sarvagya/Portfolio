'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';

interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  points: string[];
}

interface ExperienceProps {
  experience: ExperienceItem[];
}

export default function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Section Heading */}
        <div className="flex flex-col items-center mb-20 text-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/5 border border-violet-500/10 backdrop-blur-md mb-3">
            <Briefcase className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Timeline</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Experience & <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">Training</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded mt-4" />
        </div>

        {/* Vertical Timeline */}
        <div className="relative border-l border-white/[0.08] ml-4 md:ml-8 pl-8 md:pl-12 space-y-12">
          {experience.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, type: 'spring', delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Point (Glowing dot) */}
              <span className="absolute -left-[45px] md:-left-[61px] top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-950 border border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
              </span>

              {/* Experience Card */}
              <div className="group relative p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl shadow-xl hover:border-violet-500/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

                {/* Header Information */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4 relative z-10">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-violet-300 transition-colors">
                      {item.role}
                    </h3>
                    <h4 className="text-sm font-semibold text-slate-300 font-mono mt-1">
                      {item.company}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    {item.duration}
                  </div>
                </div>

                {/* Bullets/Skills Description */}
                <ul className="space-y-2.5 relative z-10">
                  {item.points.map((point, bulletIdx) => (
                    <li key={bulletIdx} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
