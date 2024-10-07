import React from 'react';
import { fraunces, dmSans } from '@/app/fonts';

const stats = [
  { number: '8k', label: 'Investors Joined', description: 'Designs we have finished in last 32 years.' },
  { number: '12K', label: 'Satisfied Clients', description: 'Designs we have finished in last 32 years.' },
  { number: '97%', label: 'Happy Rate', description: 'Designs we have finished in last 32 years.' },
];

export default function Statistics() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h2 className={`text-3xl md:text-5xl font-bold text-[#0F3D3E] mb-2 ${fraunces.className}`}>
                {stat.number}
              </h2>
              <h3 className={`text-base md:text-xl font-semibold text-[#0F3D3E] mb-2 ${dmSans.className}`}>
                {stat.label}
              </h3>
              <p className={`text-base md:text-xl font-light text-gray-600 ${dmSans.className}`}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
