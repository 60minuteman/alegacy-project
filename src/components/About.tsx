import React from 'react';
import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';

const teamImages = [
  { src: '/Team1.png', width: 384, height: 384 },
  { src: '/Team2.png', width: 384, height: 384 },
  { src: '/Team3.png', width: 384, height: 384 },
  { src: '/Team4.png', width: 384, height: 384 },
  { src: '/Team5.png', width: 384, height: 384 },
];

export default function About() {
  return (
    <section className="py-16 bg-white">
      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker-fast {
          animation: ticker 30s linear infinite;
        }
      `}</style>
      
      <div className="container mx-auto px-4 max-w-6xl">
        <h3 className={`text-sm font-light text-[#0F3D3E] mb-4 text-center ${dmSans.className}`}>ABOUT US</h3>
        
        <div className="mb-12 text-center">
          <h2 className={`text-2xl md:text-5xl font-thin text-[#0F3D3E] mb-8 ${fraunces.className}`}>
            Empowering Through<br />
            Real Estate Investment
          </h2>
          <p className={`text-sm md:text-lg font-light text-gray-800 max-w-3xl mx-auto ${dmSans.className}`}>
            We specialize in providing transparent and secure real estate investment opportunities, focusing on long-term wealth creation and fostering a lasting legacy for future generations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className={`text-base md:text-lg font-semibold text-[#0F3D3E] mb-2 ${dmSans.className}`}>Our Mission</h4>
            <p className={`text-sm font-light text-gray-600 ${dmSans.className}`}>Legacy Project aims to empower individuals from all backgrounds, especially the undeserved, by providing them with transparent, secure, and profitable real estate investment opportunities that not only generate long-term wealth but also create a lasting legacy for future generations.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg">
            <h4 className={`text-base md:text-lg font-semibold text-[#0F3D3E] mb-2 ${dmSans.className}`}>Our Vision</h4>
            <p className={`text-sm font-light text-gray-600 ${dmSans.className}`}>To be Africa's leading platform for transformative real estate investments, fostering financial stability, job creation, and innovation in property development, while promoting inclusivity, education, and cultural diversity.</p>
          </div>
        </div>
        
        {/* Team images section with full-width ticker */}
        <div className="relative overflow-hidden mt-16 ticker-container w-screen">
          <div className="flex animate-ticker-fast whitespace-nowrap">
            {[...teamImages, ...teamImages].map((image, index) => (
              <div key={index} className="inline-flex flex-shrink-0 mr-4 md:mr-8 w-[536px] h-[384px] relative">
                <Image 
                  src={image.src}
                  alt={`Team member ${index % teamImages.length + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}