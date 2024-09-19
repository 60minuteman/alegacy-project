import React from 'react';
import { dmSans } from '@/app/fonts';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Statistics from '@/components/Statistics';

import Process from '@/components/Process';
import Package from '@/components/Package';
import ClientStories from '@/components/ClientStories';
import Benefits from '@/components/Benefits';
import CTA from '@/components/CTA';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
// ... other imports

export default function LandingPage() {
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
        <FAQ />
        <Footer />
        {/* ... other components */}
      </main>
    </div>
  );
}