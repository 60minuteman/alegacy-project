'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';
import Link from 'next/link';
import NumberTicker from "@/components/magicui/number-ticker";
import { getUserCount } from '@/utils/supabaseUtils';

export default function Hero() {
  const [count, setCount] = useState(1);
  const [dbCount, setDbCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const userCount = await getUserCount();
        setDbCount(userCount);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user count:', error);
        setIsLoading(false);
      }
    };

    fetchUserCount();

    const interval = setInterval(() => {
      setCount(prevCount => {
        if (dbCount > 0 && prevCount >= dbCount) {
          return dbCount;
        }
        return prevCount + 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [dbCount]);

  const displayCount = isLoading ? count : Math.min(count, dbCount || 1);

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <Image src="/1.png" alt="Hero image" fill style={{ objectFit: "cover" }} priority />
      </div>

      <div className="relative z-20 container mx-auto px-4 max-w-3xl w-full">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8 flex flex-col items-center">
            <NumberTicker 
              value={displayCount} 
              className={`text-3xl md:text-5xl font-bold bg-gradient-to-r from-[#115e59] to-[#FDE047] bg-clip-text text-transparent ${fraunces.className}`}
            />
            <div className="inline-block bg-white bg-opacity-20 rounded-full px-4 py-1 mt-2">
              <p className={`text-base text-white ${dmSans.className}`}>Investors Joined</p>
            </div>
          </div>

          <h1 className={`text-3xl md:text-7xl font-thin text-white mb-8 ${fraunces.className}`}>
            Invest in the Future,<br />
            Build Your Legacy
          </h1>
          
          <p className={`text-base md:text-xl font-light text-white mb-8 ${dmSans.className}`}>
            Unlock financial freedom and secure your future through our transparent, high-yield real estate investment platform. Join thousands of investors and take part in revolutionary opportunities.
          </p>
          <Link href="/invest" passHref>
            <button className={`bg-[#F3EFE0] text-[#0F3D3E] px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-[#E5E1D3] transition duration-300 ${dmSans.className} text-lg md:text-xl`}>
              Invest Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
