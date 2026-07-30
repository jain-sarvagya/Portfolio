'use strict';

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, BarChart3, Server, Database, Cloud, Terminal } from 'lucide-react';

interface SkillCategory {
  category: string;
  items: string[];
}

interface SkillsProps {
  skills: SkillCategory[];
}

// Icon mapper for category headings
const categoryIcons: { [key: string]: React.ComponentType<any> } = {
  'programming': Code,
  'data analytics': BarChart3,
  'backend': Server,
  'database': Database,
  'cloud & devops': Cloud,
};

export default function Skills({ skills }: SkillsProps) {
  // Animation configurations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 80,
        damping: 15,
      },
    },
  };

  const getCategoryIcon = (category: string) => {
    const key = category.toLowerCase();
    return categoryIcons[key] || Terminal;
  };

  return (
    <section id="skills" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Heading */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 backdrop-blur-md mb-3">
            <Code className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">My Skills</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Core Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">Toolkit</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-teal-500 rounded mt-4" />
        </div>

        {/* Skill Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skills.map((skillGroup, index) => {
            const Icon = getCategoryIcon(skillGroup.category);
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl shadow-xl hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.05)] transition-all duration-300 overflow-hidden"
              >
                {/* Glowing radial gradient backdrop on card hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6 relative z-10">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-wide">
                    {skillGroup.category}
                  </h3>
                </div>

                {/* Skills Tag Cloud */}
                <div className="flex flex-wrap gap-2.5 relative z-10">
                  {skillGroup.items.map((skill, skillIdx) => (
                    <motion.span
                      key={skillIdx}
                      whileHover={{ 
                        scale: 1.06, 
                        backgroundColor: 'rgba(6, 182, 212, 0.08)',
                        borderColor: 'rgba(6, 182, 212, 0.3)',
                        color: '#22d3ee'
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-300 transition-all duration-200 cursor-default shadow-sm select-none"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
