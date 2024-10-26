import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fraunces, dmSans } from '@/app/fonts';

const benefitItems = [
  { image: '/1.png', title: 'Consistent Returns', description: 'Enjoy a guaranteed ₦50,000 annually as worst case scenario from the 5 investment packages combined, with growth potential up to ₦500,000 in the first decade.' },
  { image: '/2.png', title: 'Multiple Income Streams', description: 'Earn through returns, employment, and project contracts, diversifying your income sources within the Legacy Project ecosystem.' },
  { image: '/3.png', title: '50% Contracts for Investors', description: 'Take part in the development of properties through exclusive investor contracts in construction, interior design, electrical installations, and more.' },
];

const Benefits: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h3 className={`text-sm uppercase text-[#0F3D3E] font-semibold mb-4 ${dmSans.className}`}>BENEFITS</h3>
          <h2 className={`text-4xl text-[#0F3D3E] font-bold ${fraunces.className}`}>
            Benefits of Being a<br />Legacy Project Investor
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {benefitItems.map((item, index) => (
            <div key={index} className="flex flex-col h-full">
              <div className={`relative w-full h-80 rounded-lg overflow-hidden`}>
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  layout="fill" 
                  objectFit="cover"
                />
              </div>
              <div className="mt-2.5 bg-[#FAFAFA] rounded-lg p-6 flex-grow">
                <h3 className={`text-xl font-bold text-[#0F3D3E] mb-2 ${fraunces.className}`}>{item.title}</h3>
                <p className={`text-sm text-gray-600 ${dmSans.className}`}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link href="/invest">
            <button className={`bg-[#0F3D3E] text-white px-6 py-3 rounded-full hover:bg-[#1A5658] transition duration-300 ${dmSans.className}`}>
              Invest Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Benefits;