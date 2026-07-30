'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Trophy, Bookmark, GraduationCap } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  count?: number;
  icon: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  'Award': Award,
  'Trophy': Trophy,
  'Bookmark': Bookmark,
  'GraduationCap': GraduationCap,
};

export default function Achievements({ achievements }: AchievementsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Award;
  };

  return (
    <section ref={ref} id="achievements" className="relative py-24 overflow-hidden animate-fade-in">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Section Heading */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 backdrop-blur-md mb-3">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Milestones</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Honors & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Achievements</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded mt-4" />
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl shadow-lg hover:border-cyan-500/20 hover:scale-[1.02] transition-all duration-300 text-center flex flex-col items-center justify-center min-h-[160px]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />

                {/* Animated Glowing Icon */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-cyan-400 mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>

                {/* Title */}
                <p className="text-xs font-mono font-medium text-slate-300 leading-relaxed group-hover:text-white transition-colors max-w-[180px] uppercase tracking-wide">
                  {item.title}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
