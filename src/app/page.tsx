'use client';

import React, { useState, useEffect } from 'react';
import { dmSans } from '@/app/fonts';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Statistics from '@/components/Statistics';
import Process from '@/components/Process';
import Package from '@/components/Package';
import ClientStories from '@/components/ReferralProgram';
import Benefits from '@/components/Benefits';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);

  useEffect(() => {
    const heroImage = new window.Image();
    heroImage.src = '/1.png'; // Replace with your hero image path
    heroImage.onload = () => {
      setHeroImageLoaded(true);
    };
  }, []);

  useEffect(() => {
    if (heroImageLoaded) {
      // Start loading other assets
      const assetsToPreload = [
        '/2.png',
        '/3.png',
        // Add other important asset paths here
      ];

      Promise.all(
        assetsToPreload.map(
          (src) =>
            new Promise((resolve) => {
              const img = new window.Image();
              img.src = src;
              img.onload = resolve;
            })
        )
      ).then(() => {
        setIsLoading(false);
      });
    }
  }, [heroImageLoaded]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F3D3E]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${dmSans.className}`}>
      <Header />
      <main className="relative">
        <Hero />
        <About />
        <Statistics />
        <Process />
        <Package />
        <ClientStories />
        <Benefits />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}