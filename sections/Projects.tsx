'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Library, Layers } from 'lucide-react';
import Image from 'next/image';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

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

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  const [filter, setFilter] = useState<'all' | 'featured'>('featured');

  // Filter and sort projects by order index
  const visibleProjects = projects
    .filter((project) => project.status === 'published')
    .filter((project) => (filter === 'featured' ? project.featured : true))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="projects" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Heading */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 backdrop-blur-md mb-3">
            <Library className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">My Work</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Projects</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded mt-4" />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <button
            onClick={() => setFilter('featured')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold font-mono border transition-all duration-300 cursor-pointer ${
              filter === 'featured'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:text-white hover:border-white/[0.15]'
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold font-mono border transition-all duration-300 cursor-pointer ${
              filter === 'all'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                : 'bg-white/[0.02] text-slate-400 border-white/[0.06] hover:text-white hover:border-white/[0.15]'
            }`}
          >
            All Projects
          </button>
        </div>

        {/* Projects Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={project.id}
                className="group rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl shadow-xl overflow-hidden hover:border-cyan-500/20 hover:shadow-[0_8px_30px_rgba(6,182,212,0.05)] transition-all duration-500 flex flex-col h-full"
              >
                {/* Project Image Container */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-white/[0.06]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={project.featured}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
                  
                  {project.featured && (
                    <span className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 backdrop-blur-md text-[10px] font-mono text-cyan-400 uppercase tracking-widest shadow-md">
                      <Layers className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-white tracking-wide mb-3 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow font-sans">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* CTA Action Links */}
                  <div className="flex items-center gap-4 mt-auto">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15]"
                      >
                        <GithubIcon className="w-4 h-4 text-cyan-400" />
                        Code
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2 px-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15]"
                      >
                        <ExternalLink className="w-4 h-4 text-indigo-400" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
