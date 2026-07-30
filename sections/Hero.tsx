'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface HeroProps {
  personalInfo: {
    name: string;
    about: string;
    titles: string[];
    resumeUrl: string;
  };
  socials: {
    linkedin: string;
    github: string;
    email: string;
  };
}

export default function Hero({ personalInfo, socials }: HeroProps) {
  // Split name into first and last
  const nameParts = personalInfo.name ? personalInfo.name.split(' ') : ['SARVAGYA', 'JAIN'];
  const firstName = nameParts[0].toUpperCase();
  const lastName = nameParts.slice(1).join(' ').toUpperCase() || 'JAIN';

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 lg:py-0 overflow-hidden bg-black select-none">
      {/* Scroll anchors */}
      <div id="home" className="absolute top-0 left-0 w-0 h-0" />
      <div id="about" className="absolute top-1/2 left-0 w-0 h-0" />

      {/* Main Split Grid */}
      <div className="container mx-auto px-6 max-w-6xl z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Hero (6 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between min-h-[50vh] lg:min-h-[60vh] py-4">
            
            {/* Name and Subtitle */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="flex flex-col tracking-tight"
              >
                {/* First Name (Thin) */}
                <span className="text-6xl md:text-8xl font-extralight text-white leading-none">
                  {firstName}
                </span>
                
                {/* Last Name (Outline) */}
                <span className="text-6xl md:text-8xl font-black leading-none uppercase tracking-wide text-transparent hero-outline-text">
                  {lastName}
                </span>
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-sm md:text-base font-mono text-slate-400 tracking-wider font-semibold"
              >
                {personalInfo.titles ? personalInfo.titles.join(' / ') : 'Data Analyst / Python Developer / AI Enthusiast'}
              </motion.p>
            </div>
            
            {/* Email Footer Footnote */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-xs font-mono text-slate-500 mt-auto leading-relaxed"
            >
              <span>For any inquiries, email me at: </span>
              <a 
                href={`mailto:${socials.email}`} 
                className="text-slate-300 hover:text-white underline transition-colors cursor-pointer"
              >
                {socials.email}
              </a>
            </motion.div>
          </div>

          {/* Right Column: About Me (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5 flex flex-col justify-center border-t lg:border-t-0 border-white/[0.08] pt-8 lg:pt-0"
          >
            <div className="space-y-6">
              {/* Section Heading */}
              <div>
                <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                  ABOUT ME
                </h3>
                <div className="w-full h-px bg-white/[0.08] mt-3" />
              </div>

              {/* Biography Text */}
              <p className="text-sm md:text-base text-slate-400 leading-relaxed font-sans font-light">
                {personalInfo.about}
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
