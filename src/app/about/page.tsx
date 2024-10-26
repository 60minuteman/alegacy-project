'use client';

import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AboutSection } from '@/components/AboutSection';
import ValueSection from '@/components/ValueSection';
import TeamSection from '@/components/TeamSection';
import PartnershipsSection from '@/components/PartnershipsSection';
import LicensesSection from '@/components/LicensesSection';
import { fraunces, dmSans } from '@/app/fonts';
import Choose from '@/components/Choose';
import { Section1 } from '@/components/Section1';
import { Section2 } from '@/components/Section2';
import { Join } from '@/components/Join';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Header />
      <main className='pt-[100px]'>
        <section className="container mx-auto px-4 py-8 sm:py-16">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center text-[#0F3D3E] mb-4 sm:mb-6 ${fraunces.className}`}>
            Welcome to Legacy Project
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto mb-8 sm:mb-16">
            An exclusive, groundbreaking investment platform under Loyal Xtream Talents Ltd (LXT). 
            Legacy Project is designed to empower individuals from all walks of life by providing 
            access to lucrative real estate investments that create financial freedom and lasting wealth. 
            With a cap of just 5 million investors, this unique opportunity ensures that each participant 
            benefits from personalized attention, significant returns, and multiple avenues for growth.
          </p>

          <div className="w-full h-auto mb-6 sm:mb-8 relative">
            <Image
              src="/team5.png"
              alt="Legacy Project Team"
              width={1200}
              height={600}
              layout="responsive"
              className="rounded-[20px] sm:rounded-[30px]"
            />
          </div>

          <div className={`bg-[#F0F0F0] p-4 sm:p-8 rounded-[20px] sm:rounded-[30px] mb-8 sm:mb-16 ${dmSans.className}`}>
            <p className="text-base sm:text-lg text-center text-gray-700">
              At the heart of Legacy Project is a mission to uplift those often overlooked by traditional investment opportunities, offering them the chance to secure their financial futures. We believe that everyone, regardless of background or income level, deserves the opportunity to build wealth and create a legacy that can be passed down through generations.
            </p>
          </div>

          <div className="bg-[#004643] p-4 sm:p-8 rounded-[20px] sm:rounded-[30px] mb-8 sm:mb-16 flex flex-col items-center">
            <div className="w-full mb-4 sm:mb-8">
              <Image
                src="/team4.png"
                alt="Legacy Project"
                width={500}
                height={300}
                layout="responsive"
                className="rounded-[20px] sm:rounded-[30px]"
              />
            </div>
            <div className="w-full">
              <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white ${fraunces.className}`}>
                A Flagship of Loyal Xtream Talents Ltd (LXT)
              </h2>
              <p className={`text-white mb-4 sm:mb-6 text-sm sm:text-base ${dmSans.className}`}>
                Legacy Project is the flagship product of Loyal Xtream Talents Ltd (LXT), a visionary company dedicated to transforming lives through innovative, socially impactful investment opportunities. Our platform focuses on real estate developments across Africa, giving investors a chance to grow their wealth while contributing to large-scale projects that stimulate job creation, community development, and economic growth.
              </p>
              <button className={`w-full sm:w-auto bg-[#F3EFE0] text-[#004643] px-4 sm:px-6 py-2 sm:py-3 rounded-[20px] sm:rounded-[40px] font-semibold hover:bg-[#E0DCD0] transition duration-300 ${dmSans.className}`}>
                Invest Now
              </button>
            </div>
          </div>
        </section>

        <ValueSection />
        
        <Choose />
        <Section1 />
        <Section2 />
        <div className="h-[50vh] sm:h-[70vh]">
          <Join />
        </div>
        <TeamSection />
        <PartnershipsSection />
        <LicensesSection />
      </main>
      <Footer />
    </div>
  );
}
