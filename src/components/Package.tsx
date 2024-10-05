import React from 'react';
import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';

const packages = [
  { name: 'Elementary School', location: 'Low Risk, Steady Returns', image: '/4.png' },
  { name: ' Highschool', location: 'Medium Risk, Steady Returns', image: '/6.png' },
  { name: 'University', location: 'Diversified Portfolio for Balanced Growth', image: '/3.png' },
  { name: 'Hospital', location: 'Diversified Portfolio for Balanced Growth', image: '/7.png' },
  { name: 'Hotel', location: 'Diversified Portfolio for Balanced Growth', image: '/5.png' },
];

const Package: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 max-w-6xl"> {/* Adjusted max-width to match header */}
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-[48%]">
            <div className="mb-12">
              <h3 className={`text-sm uppercase text-[#0F3D3E] font-semibold mb-4 ${dmSans.className}`}>WORKS</h3>
              <h2 className={`text-4xl text-[#0F3D3E] font-bold mb-8 ${fraunces.className}`}>Our Investment<br />Packages</h2>
            </div>
            <div className="space-y-8 mt-[298px]"> {/* Added margin-top to push content down */}
              <PackageItem pkg={packages[0]} />
              <PackageItem pkg={packages[1]} />
            </div>
          </div>
          <div className="w-full md:w-[48%] space-y-8">
            <PackageItem pkg={packages[2]} />
            <PackageItem pkg={packages[3]} />
            <PackageItem pkg={packages[4]} />
          </div>
        </div>
        <div className="mt-12">
          <button className={`border-2 border-[#0F3D3E] text-[#0F3D3E] font-semibold px-6 py-3 rounded-full hover:bg-[#0F3D3E] hover:text-white transition duration-300 ${dmSans.className}`}>
            See more projects
          </button>
        </div>
      </div>
    </section>
  );
};

const PackageItem: React.FC<{ pkg: { name: string; location: string; image: string } }> = ({ pkg }) => (
  <div className="relative">
    <div className="relative w-full h-[596px] mb-4">
      <Image 
        src={pkg.image} 
        alt={pkg.name} 
        layout="fill" 
        objectFit="cover"
      />
    </div>
    <div className="flex justify-between items-center">
      <div>
        <h3 className={`text-lg font-bold text-[#0F3D3E] ${dmSans.className}`}>{pkg.name}</h3>
        <p className={`text-sm font-medium text-gray-700 ${dmSans.className}`}>{pkg.location}</p>
      </div>
      <button className="text-[#0F3D3E] hover:text-[#1A5658] transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </div>
);

export default Package;