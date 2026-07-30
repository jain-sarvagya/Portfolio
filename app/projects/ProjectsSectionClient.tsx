'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  githubLink?: string;
  liveLink?: string;
  featured: boolean;
  status: 'published' | 'draft';
  order: number;
}

interface ProjectsSectionClientProps {
  projects: Project[];
}

export default function ProjectsSectionClient({ projects }: ProjectsSectionClientProps) {
  const [filter, setFilter] = useState<'all' | 'featured'>('featured');

  // Filter and sort projects by order index
  const visibleProjects = projects
    .filter((project) => project.status === 'published')
    .filter((project) => (filter === 'featured' ? project.featured : true))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-16 relative pt-6 select-none">
      {/* Watermark Section Title */}
      <div className="absolute -top-3 left-0 pointer-events-none opacity-[0.03] select-none">
        <span className="text-6xl md:text-8xl font-black tracking-widest font-sans uppercase">PROJECTS</span>
      </div>

      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/[0.08] pb-4">
        <h3 className="text-sm font-mono font-bold tracking-widest text-slate-400">PROJECTS</h3>
        
        {/* Toggle buttons */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setFilter('featured')}
            className={`text-xs font-mono font-semibold tracking-wider transition-colors cursor-pointer ${
              filter === 'featured' ? 'text-white underline underline-offset-4' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            FEATURED
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`text-xs font-mono font-semibold tracking-wider transition-colors cursor-pointer ${
              filter === 'all' ? 'text-white underline underline-offset-4' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            ALL PROJECTS
          </button>
        </div>
      </div>

      {/* Projects List (Stacked Split Rows) */}
      <motion.div 
        layout
        className="space-y-24"
      >
        <AnimatePresence mode="popLayout">
          {visibleProjects.map((project, idx) => {
            const formattedIndex = String(idx + 1).padStart(2, '0');

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-120px' }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                key={project.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start group"
              >
                {/* Left Column: Project Text Content (6 cols) */}
                <div className="lg:col-span-6 flex flex-col space-y-6 pt-2">
                  {/* Number Indicator */}
                  <span className="text-xs font-mono text-slate-600 font-bold">
                    {formattedIndex}
                  </span>

                  {/* Title & Divider */}
                  <div className="space-y-3">
                    <h4 className="text-2xl md:text-3xl font-light font-sans tracking-wide text-white leading-snug">
                      {project.title}
                    </h4>
                    <div className="w-full h-px bg-white/[0.08]" />
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm md:text-base font-sans font-light leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {project.techStack.map((tech, skillIdx) => (
                      <span
                        key={skillIdx}
                        className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-mono text-slate-300 bg-white/[0.01] group-hover:border-white/20 transition-colors duration-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* CTA Action Links */}
                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors group/cta"
                      >
                        View Project 
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors group/cta"
                      >
                        View Source Code
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column: Rounded Cover Card Image (6 cols) */}
                <div className="lg:col-span-6">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/[0.08] bg-[#050505] transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.02)]">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={project.featured}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
