import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getPortfolioData } from '../admin/actions';
import ExperienceAccordion from './ExperienceAccordion';

export const revalidate = 0; // Disable caching to show config changes instantly

export default async function ExperiencePage() {
  const data = await getPortfolioData();
  const { experience } = data;

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
        </div>

        {/* Experience Collapsible Timeline */}
        <ExperienceAccordion experience={experience || []} />
      </div>
    </div>
  );
}
