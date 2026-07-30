'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Settings, Mail } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  personalInfo: {
    name: string;
    resumeUrl: string;
  };
  socials: {
    linkedin: string;
    github: string;
    email: string;
    whatsapp?: string;
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

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="currentColor"
    {...props}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Navbar({ personalInfo, socials }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'HOME' },
    { href: '/resume', label: 'RESUME' },
    { href: '/projects', label: 'PROJECTS' },
    { href: '/experience', label: 'WORK EXP.' },
  ];

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* DESKTOP SIDEBAR NAV */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-56 border-r border-white/[0.08] p-10 bg-black flex-col justify-between z-40">
        {/* Menu Items */}
        <div className="flex flex-col gap-10 mt-8">
          <Link
            href="/"
            className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest hover:text-white"
          >
            PORTFOLIO
          </Link>
          
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] font-mono font-semibold tracking-widest text-left select-none relative transition-colors ${
                  isLinkActive(item.href) ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {item.label}
                {isLinkActive(item.href) && (
                  <span className="absolute -left-4 top-1.5 w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Social Icons & Admin Panel */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon />
            </a>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon />
            </a>
            <a
              href={`mailto:${socials.email}`}
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            {socials.whatsapp && (
              <a
                href={socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsappIcon />
              </a>
            )}
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-mono text-slate-600 tracking-wider">THEME</span>
            <ThemeToggle />
          </div>

          <div className="w-full h-px bg-white/[0.08]" />

          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-[10px] font-mono text-slate-600 hover:text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>CONTROL PANEL</span>
          </Link>
        </div>
      </aside>

      {/* MOBILE TOP HEADER BAR */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-16 border-b border-white/[0.08] bg-black/95 backdrop-blur-md flex items-center justify-between px-6 z-45">
        <Link
          href="/"
          className="text-xs font-mono font-bold text-white tracking-widest"
        >
          PORTFOLIO
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/admin"
            className="text-slate-500 hover:text-white transition-colors"
            aria-label="Admin Control"
          >
            <Settings className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black pt-20 px-8 flex flex-col justify-between pb-10">
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`text-sm font-mono tracking-widest font-semibold ${
                  isLinkActive(item.href) ? 'text-white' : 'text-slate-500'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white">
              <LinkedinIcon />
            </a>
            <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white">
              <GithubIcon />
            </a>
            <a href={`mailto:${socials.email}`} className="text-slate-500 hover:text-white">
              <Mail className="w-5.5 h-5.5" />
            </a>
            {socials.whatsapp && (
              <a href={socials.whatsapp} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white">
                <WhatsappIcon />
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}
