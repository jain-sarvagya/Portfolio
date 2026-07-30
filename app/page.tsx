import React from 'react';
import Image from 'next/image';
import { getPortfolioData } from './admin/actions';
import Hero from '../sections/Hero';

export const revalidate = 0; // Disable caching to show modifications instantly

export default async function Home() {
  const data = await getPortfolioData();
  const { personalInfo, socials, skills } = data;

  return (
    <div className="flex flex-col">
      {/* 1. Hero & About Page Split View */}
      <Hero personalInfo={personalInfo} socials={socials} />

      {/* 2. Motivation Section */}
      <section className="py-20 border-t border-white/[0.08] bg-black select-none">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Motivation Text */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
                MOTIVATION
              </h3>
              <div className="w-full h-px bg-white/[0.08]" />
              
              <div className="space-y-4 text-sm md:text-base text-slate-400 font-sans font-light leading-relaxed">
                <p>
                  My motivation comes from solving invisible problems—the kind users rarely complain about, but constantly feel. As a developer and data analyst, I focus on reducing cognitive load, guiding decisions, and crafting seamless flows.
                </p>
                <p>
                  Having worked across diverse datasets and code bases, I translate complexity into clarity, ensuring every analysis and application feels intuitive, purposeful, and effortless from the very first moment a user engages.
                </p>
              </div>
            </div>

            {/* Right Column: Greyscale Portrait */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-80 h-80 rounded-2xl overflow-hidden border border-white/[0.08] bg-slate-950">
                <Image
                  src={personalInfo.profileImage || '/profile.png'}
                  alt="Sarvagya Jain Profile"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Skills Section */}
      <section className="py-20 border-t border-white/[0.08] bg-black select-none">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Divider line */}
          <div className="relative flex items-center justify-between mb-16">
            <span className="text-sm font-sans font-light tracking-widest text-slate-400 uppercase pr-6 z-10 bg-black">
              SKILLS
            </span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* 3-Column dynamic Skills Cloud */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {skills.map((category: any, idx: number) => (
              <div key={idx} className="space-y-5">
                <h4 className="text-base md:text-lg font-sans font-light tracking-wide text-white uppercase pb-1">
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
      </section>
    </div>
  );
}
