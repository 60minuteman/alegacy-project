'use client';

import React from 'react';
import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative h-screen">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <Image src="/1.png" alt="Hero image" layout="fill" objectFit="cover" priority />
      </div>

      <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center pt-20">
        <div className="max-w-3xl">
          <h1 className={`text-7xl font-thin text-white mb-4 ${fraunces.className}`}>
            Invest in the Future,<br />
            Build Your Legacy
          </h1>
          <div className="flex items-end space-x-8">
            <p className={`text-xl font-light text-white flex-grow ${dmSans.className}`}>
              Unlock financial freedom and secure your future through our transparent, high-yield real estate investment platform. Join thousands of investors and take part in revolutionary opportunities.
            </p>
            <Link href="/invest" passHref>
              <button className={`bg-[#F3EFE0] text-[#0F3D3E] px-8 py-3 rounded-full hover:bg-[#E5E1D3] transition duration-300 whitespace-nowrap ${dmSans.className}`}>
                Invest Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
