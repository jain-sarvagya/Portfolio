'use client';

import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

interface ContactFormClientProps {
  socials: {
    linkedin: string;
    github: string;
    email: string;
  };
  personalInfo: {
    name: string;
  };
}

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
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
    width="20"
    height="20"
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

export default function ContactFormClient({ socials, personalInfo }: ContactFormClientProps) {
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
      setTimeout(() => setStatus('idle'), 4000);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Social details (Left) */}
      <div className="lg:col-span-5 space-y-6">
        <h4 className="text-xl font-bold text-white tracking-wide">
          Let's create something <span className="text-slate-400">meaningful</span>
        </h4>
        <p className="text-slate-400 text-sm font-light leading-relaxed font-sans">
          I am open to discussions about Python dev, BI dashboards, data architecture, internships, and collaborative software projects.
        </p>

        <div className="space-y-4 pt-4">
          <a
            href={`mailto:${socials.email}`}
            className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-[#050505] hover:border-white/20 transition-all duration-300 group"
          >
            <div className="p-3 rounded-lg bg-white/5 text-slate-300 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-[10px] font-mono text-slate-500 uppercase">Email</h5>
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{socials.email}</span>
            </div>
          </a>

          <a
            href={socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-[#050505] hover:border-white/20 transition-all duration-300 group"
          >
            <div className="p-3 rounded-lg bg-white/5 text-slate-300 group-hover:scale-110 transition-transform">
              <LinkedinIcon />
            </div>
            <div>
              <h5 className="text-[10px] font-mono text-slate-500 uppercase">LinkedIn</h5>
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">sarvagya-jain</span>
            </div>
          </a>

          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.08] bg-[#050505] hover:border-white/20 transition-all duration-300 group"
          >
            <div className="p-3 rounded-lg bg-white/5 text-slate-300 group-hover:scale-110 transition-transform">
              <GithubIcon />
            </div>
            <div>
              <h5 className="text-[10px] font-mono text-slate-500 uppercase">GitHub</h5>
              <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">jain-sarvagya</span>
            </div>
          </a>
        </div>
      </div>

      {/* Form (Right) */}
      <div className="lg:col-span-7">
        <div className="p-6 md:p-8 rounded-2xl border border-white/[0.08] bg-[#050505] relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Name</label>
              <input
                type="text"
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-black border border-white/[0.08] focus:border-white/35 text-white placeholder-slate-600 outline-none transition-all duration-300 text-sm"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                id="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-black border border-white/[0.08] focus:border-white/35 text-white placeholder-slate-600 outline-none transition-all duration-300 text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-2">Message</label>
              <textarea
                id="message"
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-black border border-white/[0.08] focus:border-white/35 text-white placeholder-slate-600 outline-none transition-all duration-300 resize-none text-sm"
                placeholder="Type your message..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 border border-white/10 hover:border-white hover:bg-white/5 transition-all duration-300 text-white font-mono text-xs tracking-widest disabled:opacity-50 cursor-pointer active:scale-[0.98]"
            >
              {status === 'sending' ? (
                'TRANSMITTING...'
              ) : status === 'success' ? (
                <span className="flex items-center gap-1.5 text-green-400">
                  <CheckCircle className="w-4 h-4 text-green-400" /> MESSAGE TRANSMITTED!
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  SEND MESSAGE <Send className="w-3.5 h-3.5 text-slate-400" />
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
