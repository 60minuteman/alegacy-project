import React from 'react';
import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';

const benefitItems = [
  { image: '/1.png', title: 'Home Decoraction', description: 'Efficient use of space is crucial in home interior design. Consider the layout of furniture.' },
  { image: '/2.png', title: 'Home Decoraction', description: 'Efficient use of space is crucial in home interior design. Consider the layout of furniture.' },
  { image: '/3.png', title: 'Home Decoraction', description: 'Efficient use of space is crucial in home interior design. Consider the layout of furniture.' },
];

const Benefits: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center mb-16">
          <div className="text-center mb-8">
            <h3 className={`text-sm uppercase text-[#0F3D3E] font-semibold mb-4 ${dmSans.className}`}>BENEFITS</h3>
            <h2 className={`text-4xl text-[#0F3D3E] font-bold ${fraunces.className}`}>
              Get your dream home<br />with expert help.
            </h2>
          </div>
          <button className={`bg-[#0F3D3E] text-white px-6 py-3 rounded-full hover:bg-[#1A5658] transition duration-300 ${dmSans.className}`}>
            Get in touch
            <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefitItems.map((item, index) => (
            <div key={index} className="flex flex-col h-full">
              <div className="flex-grow"></div>
              <div className={`relative w-full ${index === 1 ? 'h-96' : 'h-80'}`}>
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  layout="fill" 
                  objectFit="cover"
                />
              </div>
              <div className="text-center mt-6">
                <h3 className={`text-xl font-bold text-[#0F3D3E] mb-2 ${fraunces.className}`}>{item.title}</h3>
                <p className={`text-sm text-gray-600 ${dmSans.className}`}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;