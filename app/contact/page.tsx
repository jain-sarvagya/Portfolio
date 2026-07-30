import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPortfolioData } from '../admin/actions';
import ContactFormClient from './ContactFormClient';

export const revalidate = 0; // Disable caching

export default async function ContactPage() {
  const data = await getPortfolioData();
  const { socials, personalInfo } = data;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 lg:px-12 select-none">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-white transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
          
          <div className="w-12 h-6 rounded-full border border-white/20 p-1 flex items-center justify-start cursor-not-allowed opacity-60">
            <div className="w-4 h-4 rounded-full bg-white" />
          </div>
        </div>

        {/* Contact Form and Details Container */}
        <div className="space-y-12 relative pt-6">
          {/* Watermark Section Title */}
          <div className="absolute -top-3 left-0 pointer-events-none opacity-[0.03] select-none">
            <span className="text-6xl md:text-8xl font-black tracking-widest font-sans uppercase">CONTACT</span>
          </div>

          <div className="border-b border-white/[0.08] pb-2">
            <h3 className="text-sm font-mono font-bold tracking-widest text-slate-400">CONTACT</h3>
          </div>

          {/* Client contact wrapper */}
          <ContactFormClient socials={socials} personalInfo={personalInfo} />
        </div>
      </div>
    </div>
  );
}
