'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import RetroGrid from '@/components/RetroGrid';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const packageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 6000); // Load for at least 6 seconds

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 60); // Update progress every 60ms to complete in 6 seconds

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#packages' && packageRef.current) {
        packageRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on initial load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loader"
          className="fixed inset-0 flex items-center justify-center z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <RetroGrid className="absolute inset-0" />
          <div className="relative z-10 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-primary transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`min-h-screen bg-white ${dmSans.className}`}
        >
          <Header />
          <main className="relative pt-[60px]"> {/* Adjust pt value based on your header height */}
            <Hero />
            <About />
            {/* <Statistics /> */}
            <Process />
            <div ref={packageRef}>
              <Package />
            </div>
            <ClientStories />
            <Benefits />
            <CTA />
            <Footer />
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}