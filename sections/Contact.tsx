'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';

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

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface ContactProps {
  socials: {
    linkedin: string;
    github: string;
    email: string;
  };
  personalInfo: {
    name: string;
  };
}

export default function Contact({ socials, personalInfo }: ContactProps) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setStatus('sending');

    // Simulate sending network request
    setTimeout(() => {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <section id="contact" className="relative pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Section Heading */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 backdrop-blur-md mb-3">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Connect</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Touch</span>
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded mt-4" />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Social Information Grid (Left) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold text-white tracking-wide">
              Let's create something <span className="text-cyan-400">awesome</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              I am open to discussions about data projects, automation systems, internships, and collaborative software development. Feel free to reach out via the form or on socials.
            </p>

            <div className="space-y-4 pt-4">
              <a
                href={`mailto:${socials.email}`}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase">Email</h4>
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{socials.email}</span>
                </div>
              </a>

              <a
                href={socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md hover:border-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.05)] transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                  <LinkedinIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase">LinkedIn</h4>
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">sarvagya-jain</span>
                </div>
              </a>

              <a
                href={socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md hover:border-slate-500/35 hover:shadow-[0_0_15px_rgba(255,255,255,0.02)] transition-all duration-300 group"
              >
                <div className="p-3 rounded-lg bg-white/5 text-slate-300 group-hover:scale-110 transition-transform">
                  <GithubIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase">GitHub</h4>
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">jain-sarvagya</span>
                </div>
              </a>
            </div>
          </div>

          {/* Contact Form (Right) */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl shadow-xl relative overflow-hidden">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/65 border border-white/[0.08] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-500 outline-none transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/65 border border-white/[0.08] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-500 outline-none transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Message</label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/65 border border-white/[0.08] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-500 outline-none transition-all duration-300 resize-none"
                    placeholder="Type your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 disabled:opacity-50 cursor-pointer active:scale-[0.98]"
                >
                  {status === 'sending' ? (
                    'Transmitting...'
                  ) : status === 'success' ? (
                    <span className="flex items-center gap-1.5 text-slate-950">
                      <CheckCircle className="w-5 h-5 text-slate-950" /> Message Sent!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Send Message <Send className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/[0.06] mb-8" />

        {/* Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
          <p className="text-xs text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#about" className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors">About</a>
            <a href="#skills" className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors">Skills</a>
            <a href="#projects" className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors">Projects</a>
            <a href="#contact" className="text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </section>
  );
}
