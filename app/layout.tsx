import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sarvagya Jain | Data Analyst & Python Developer',
  description: 'Personal portfolio of Sarvagya Jain. Data Analyst, Python Developer, and AI Enthusiast. Discover project show-cases, training, and achievements.',
  keywords: ['Sarvagya Jain', 'Data Analyst', 'Python Developer', 'AI', 'SQL', 'Flask', 'Power BI', 'Portfolio'],
  authors: [{ name: 'Sarvagya Jain' }],
  metadataBase: new URL('http://localhost:3000'), // Fallback base URL for metadata
  openGraph: {
    title: 'Sarvagya Jain | Data Analyst & Python Developer',
    description: 'Computer Science student passionate about Data Analytics, AI, Python, SQL, and Business Intelligence.',
    url: 'https://jainsarvagya.com', // Replace with real domain when deployed
    siteName: 'Sarvagya Jain Portfolio',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sarvagya Jain | Data Analyst & Python Developer',
    description: 'Computer Science student passionate about Data Analytics, AI, Python, SQL, and Business Intelligence.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { getPortfolioData } from './admin/actions';
import Navbar from '../components/Navbar';
import CustomCursor from '../components/CustomCursor';
import CursorGlow from '../components/CursorGlow';
import AnimatedGrid from '../components/AnimatedGrid';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getPortfolioData();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white selection:bg-white/10 selection:text-white`}>
        {/* Interactive Global Elements */}
        <CustomCursor />
        <CursorGlow />
        <AnimatedGrid />
        
        {/* Responsive Sidebar Navigation */}
        <Navbar personalInfo={data.personalInfo} socials={data.socials} />
        
        {/* Main Content Container with Sidebar Padding on Desktop */}
        <div className="lg:pl-56 bg-black min-h-screen relative z-10 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
