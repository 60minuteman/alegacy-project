import React from 'react';
import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';

const packages = [
  { name: 'Elementary School', location: 'Low Risk, Steady Returns', image: '/4.png' },
  { name: 'Highschool', location: 'Medium Risk, Steady Returns', image: '/6.png' },
  { name: 'University', location: 'Diversified Portfolio for Balanced Growth', image: '/3.png' },
  { name: 'Hospital', location: 'Diversified Portfolio for Balanced Growth', image: '/7.png' },
  { name: 'Hotel', location: 'Diversified Portfolio for Balanced Growth', image: '/5.png' },
];

const Package: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className={`text-4xl text-[#0F3D3E] font-bold mb-4 ${fraunces.className}`}>Our Investment Packages</h2>
          <p className={`text-lg text-gray-700 max-w-3xl mx-auto ${dmSans.className}`}>
            Explore a diverse range of Strategic investment opportunities with High Growth Potential and Diversified Portfolio for Balanced Growth that align with your financial goals.
          </p>
        </div>
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-7/12 px-4">
            <div className="space-y-7"> {/* Adjusted spacing */}
              <PackageItem pkg={packages[0]} large />
              <PackageItem pkg={packages[1]} large />
            </div>
          </div>
          <div className="w-full md:w-5/12 px-4">
            <div className="space-y-7"> {/* Adjusted spacing */}
              <PackageItem pkg={packages[2]} />
              <PackageItem pkg={packages[3]} />
              <PackageItem pkg={packages[4]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface PackageItemProps {
  pkg: { name: string; location: string; image: string };
  large?: boolean;
}

const PackageItem: React.FC<PackageItemProps> = ({ pkg, large = false }) => (
  <div className="relative bg-gray-100 rounded-lg p-3.5"> {/* 14px padding */}
    <div className={`relative w-full overflow-hidden rounded-lg ${large ? 'h-[372px]' : 'h-[212px]'}`}>
      <Image 
        src={pkg.image} 
        alt={pkg.name} 
        layout="fill" 
        objectFit="cover"
        className="transition-transform duration-300 ease-in-out hover:scale-110"
      />
    </div>
    <div className="mt-4">
      <h3 className={`text-lg font-bold text-[#0F3D3E] ${fraunces.className}`}>{pkg.name}</h3>
      <p className={`text-sm font-medium text-gray-700 ${dmSans.className}`}>{pkg.location}</p>
    </div>
  </div>
);

export default Package;