import React from 'react';
import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';

const teamImages = [
  { src: '/Team1.png', height: 'h-96' },
  { src: '/Team2.png', height: 'h-112' },
  { src: '/Team3.png', height: 'h-96' },
  { src: '/Team4.png', height: 'h-112' },
  { src: '/Team5.png', height: 'h-96' },
];

export default function About() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h3 className={`text-sm font-light text-teal-700 mb-4 ${dmSans.className}`}>ABOUT US</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className={`text-4xl font-thin text-teal-800 mb-4 ${fraunces.className}`}>
              Expertly Curated<br />
              Real Estate<br />
              Opportunities:
            </h2>
          </div>
          <div>
            <p className={`text-gray-600 mb-4 ${dmSans.className}`}>We specialize in transforming visions into reality.</p>
            <p className={`text-xl text-teal-800 font-semibold ${dmSans.className}`}>
              Carefully selected investment packages tailored to ensure high returns and steady growth.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {['Secure & Transparent Transactions', 'Diverse Revenue Streams', 'Referrals with Impact', 'Cultural Diversity & Impact:'].map((title, index) => (
            <div key={index} className="bg-gray-100 p-6 rounded-lg">
              <h4 className={`text-lg font-semibold text-teal-800 mb-2 ${dmSans.className}`}>{title}</h4>
              <p className={`text-gray-600 ${dmSans.className}`}>Description for {title}</p>
            </div>
          ))}
        </div>
        
        {/* Team images section with full-width ticker */}
        <div className="relative overflow-hidden mt-16">
          <div className="flex animate-ticker space-x-8">
            {[...teamImages, ...teamImages].map((image, index) => (
              <div key={index} className={`flex-shrink-0 w-80 ${image.height}`}>
                <Image 
                  src={image.src}
                  alt={`Team member ${index % 5 + 1}`}
                  width={320}
                  height={image.height === 'h-112' ? 448 : 384}
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}