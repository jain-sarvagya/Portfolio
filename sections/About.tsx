'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { User, Terminal, Code, Cpu } from 'lucide-react';

interface AboutProps {
  personalInfo: {
    about: string;
  };
}

export default function About({ personalInfo }: AboutProps) {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Section Heading */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/10 backdrop-blur-md mb-3">
            <User className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">About Me</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Discover My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Journey</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded mt-4" />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Glass Description Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="lg:col-span-7 p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] relative overflow-hidden group hover:border-cyan-500/20 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-colors duration-500" />
            
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-sans relative z-10">
              {personalInfo.about || "I'm a Computer Science student passionate about Data Analytics, AI, Python, SQL, and Business Intelligence. I enjoy transforming raw data into meaningful insights while building intelligent applications."}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <Code className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-sm font-semibold text-white">Clean Code</h4>
                  <span className="text-xs text-slate-400">Python / SQL</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="text-sm font-semibold text-white">AI Dev</h4>
                  <span className="text-xs text-slate-400">Gemini & ML</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Terminal Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, type: 'spring', delay: 0.1 }}
            className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-slate-950/80 backdrop-blur-md shadow-2xl overflow-hidden font-mono text-sm text-slate-300"
          >
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-sans">
                <Terminal className="w-3.5 h-3.5" />
                bash
              </span>
              <div className="w-12" />
            </div>

            {/* Terminal Window Body */}
            <div className="p-6 space-y-4">
              <div>
                <span className="text-teal-400">sarvagya@portfolio</span>
                <span className="text-slate-400">:~$</span>
                <span className="text-white ml-2">cat skills.txt</span>
              </div>
              <div className="text-indigo-400 pl-4">
                Python, SQL, JavaScript, React, Next.js, Flask, AWS, Docker, Git.
              </div>

              <div>
                <span className="text-teal-400">sarvagya@portfolio</span>
                <span className="text-slate-400">:~$</span>
                <span className="text-white ml-2">cat mission.py</span>
              </div>
              <div className="text-cyan-400 pl-4 font-sans text-xs italic leading-relaxed">
                "To extract value from unstructured data and develop algorithms that automate operations and deliver impactful solutions."
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-teal-400">sarvagya@portfolio</span>
                <span className="text-slate-400">:~$</span>
                <span className="w-2 h-4 bg-cyan-400 animate-pulse ml-2" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
