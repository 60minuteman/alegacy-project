import React from 'react';
import { fraunces, dmSans } from '@/app/fonts';

export const Join: React.FC = () => {
  return (
    <section
      className="flex items-center justify-center bg-cover bg-center h-[56vh] text-white"
      style={{ backgroundImage: "url('/join.jpg')" }}
    >
      <div className="bg-black bg-opacity-50 px-6 sm:px-8 py-4 sm:py-8 rounded-[24px] text-center w-full sm:max-w-xl mx-auto flex flex-col items-center">
        <h2 className={`text-3xl sm:text-4xl font-bold mb-4 sm:mb-5 ${fraunces.className}`}>
          Join the Legacy
        </h2>
        <p className={`text-sm sm:text-base mb-6 ${dmSans.className}`}>
          By joining Legacy Project, you are not just investing in real estate—you are investing in your future, your family, and the communities around you. This is your chance to be part of a transformative movement that is reshaping the landscape of African real estate and creating sustainable wealth for generations to come.
        </p>
        <button className={`bg-[#0F3D3E] text-white px-6 sm:px-7 py-2 sm:py-3 rounded-[32px] text-sm sm:text-base font-semibold hover:bg-[#0D3233] transition duration-300 ${dmSans.className}`}>
          Get Started
        </button>
      </div>
    </section>
  );
};
