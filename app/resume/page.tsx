import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Download } from 'lucide-react';
import { getPortfolioData } from '../admin/actions';

export const revalidate = 0; // Disable caching to show modifications instantly

export default async function ResumePage() {
  const data = await getPortfolioData();
  const { personalInfo, skills, education, marquee, stats, achievements } = data;

  const marqueeItems = marquee && marquee.length > 0 ? marquee : [
    'PYTHON DEVELOPMENT',
    'DATA ANALYTICS',
    'SQL INFERENCE',
    'BUSINESS INTELLIGENCE',
    'FLASK REST APIS',
    'DOCKER & DEVOPS',
    'AI INTEGRATIONS',
    'MACHINE LEARNING',
  ];

  const statsItems = stats && stats.length > 0 ? stats : [
    { value: "12+", label: "Months Dev/Intern" },
    { value: "04", label: "Milestones Met" },
    { value: "02", label: "Projects Shipped" }
  ];

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

        {/* Page Subtitle */}
        <div className="text-center">
          <p className="text-sm font-light text-slate-400 font-sans italic">
            A condensed view of my work, skills, and journey so far.
          </p>
        </div>

        {/* Download Button */}
        <div className="flex justify-center py-4">
          <a
            href={personalInfo.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group px-10 py-5 border border-white/10 hover:border-white transition-colors duration-300 font-mono text-sm tracking-widest flex items-center gap-3 active:scale-95"
          >
            DOWNLOAD MY RESUME
            <Download className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </a>
        </div>

        {/* Marquee Banner */}
        <div className="w-full overflow-hidden border-y border-white/[0.08] py-4 relative bg-black">
          <div className="flex whitespace-nowrap gap-10 animate-[marquee_25s_linear_infinite] w-max">
            {/* Double the array to make it seamless */}
            {[...marqueeItems, ...marqueeItems].map((item, idx) => (
              <span key={idx} className="text-xs font-mono font-bold tracking-widest text-slate-500 flex items-center gap-2">
                {item} <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </span>
            ))}
          </div>
          
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </div>

        {/* Statistics Grid */}
        <div 
          className="grid border border-white/[0.08] divide-x divide-white/[0.08] text-center bg-[#050505]"
          style={{ gridTemplateColumns: `repeat(${statsItems.length}, minmax(0, 1fr))` }}
        >
          {statsItems.map((stat: any, idx: number) => (
            <div key={idx} className="py-8 px-4">
              <h4 className="text-3xl md:text-5xl font-black font-sans leading-none">{stat.value}</h4>
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-2">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Education Timeline */}
        <div className="space-y-8 relative pt-6">
          {/* Watermark Section Title */}
          <div className="absolute -top-3 left-0 pointer-events-none opacity-[0.03] select-none">
            <span className="text-6xl md:text-8xl font-black tracking-widest font-sans uppercase">EDUCATION</span>
          </div>

          <div className="border-b border-white/[0.08] pb-2">
            <h3 className="text-sm font-mono font-bold tracking-widest text-slate-400">EDUCATION</h3>
          </div>

          <div className="space-y-8 pl-4">
            {education.map((edu: any, idx: number) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-6 items-start">
                <div className="md:col-span-3 text-xs font-mono text-slate-500 font-semibold md:pt-1">
                  {edu.period}
                </div>
                <div className="md:col-span-9 space-y-1.5">
                  <h4 className="text-base font-semibold text-white font-sans">
                    {edu.degree}
                  </h4>
                  <h5 className="text-xs font-mono text-slate-400 font-bold">
                    {edu.institution}
                  </h5>
                  <p className="text-sm text-slate-400 font-light font-sans leading-relaxed">
                    {edu.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Honors & Certifications Section */}
        {achievements && achievements.length > 0 && (
          <div className="space-y-8 relative pt-6 animate-fade-in">
            {/* Watermark Section Title */}
            <div className="absolute -top-3 left-0 pointer-events-none opacity-[0.03] select-none">
              <span className="text-6xl md:text-8xl font-black tracking-widest font-sans uppercase">AWARDS</span>
            </div>

            <div className="border-b border-white/[0.08] pb-2">
              <h3 className="text-sm font-mono font-bold tracking-widest text-slate-400">HONORS & CERTIFICATIONS</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
              {achievements.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center py-3.5 px-5 rounded-xl bg-white/[0.01] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
                  <span className="text-xs font-mono font-medium text-slate-300 uppercase tracking-wide leading-relaxed">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Tag Clouds */}
        <div className="space-y-8 pt-6">
          <div className="border-b border-white/[0.08] pb-2">
            <h3 className="text-sm font-sans font-light tracking-widest text-slate-400">SKILLS</h3>
          </div>

          <div className="space-y-8">
            {skills.map((category: any, idx: number) => (
              <div key={idx} className="space-y-4">
                <h4 className="text-base font-sans font-light tracking-wide text-white uppercase">
                  {category.category}
                </h4>
                <div className="flex flex-wrap gap-2.5">
                  {category.items.map((skill: string, skillIdx: number) => (
                    <span
                      key={skillIdx}
                      className="px-4 py-1.5 rounded-full border border-white/10 text-xs font-sans font-light text-slate-300 bg-transparent hover:border-white/30 hover:text-white transition-colors duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
