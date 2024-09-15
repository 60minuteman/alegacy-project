import React from 'react';
import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';

const CTA: React.FC = () => {
  return (
    <section className="relative h-[892.98px]"> {/* Increased height */}
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/CTA.PNG" // Placeholder for "/CTA.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col items-start">
            <h2 className={`text-4xl md:text-5xl text-white font-bold mb-4 ${fraunces.className}`}>
              Unlock Your Dream<br />Home Today!
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-start w-full">
              <p className={`text-white text-lg mb-6 md:mb-0 md:mr-8 max-w-xl ${dmSans.className}`}>
                We encourage clients to actively participate in discussions,
                share their ideas, preferences, and feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className={`bg-[#0F3D3E] text-white px-6 py-3 rounded-full hover:bg-[#1A5658] transition duration-300 ${dmSans.className}`}>
                  Get in touch
                  <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <button className={`border-2 border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-[#0F3D3E] transition duration-300 ${dmSans.className}`}>
                  Call us: +1 483 944 954
                  <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;