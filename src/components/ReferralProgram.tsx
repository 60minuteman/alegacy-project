import React from 'react';
import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';

export default function ReferralProgram() {
  return (
    <section className="relative bg-[#0F3D3E] text-white overflow-hidden py-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/2.png"
          alt="Referral Program Background"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
        />
        <div className="absolute inset-0 bg-[#0F3D3E] opacity-70"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className={`text-sm uppercase mb-4 ${dmSans.className}`}>REFERRAL PROGRAM</h3>
          <h2 className={`text-4xl mb-6 ${fraunces.className}`}>Earn More with Our Referral Program</h2>
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${dmSans.className}`}>
            Invite friends and family to join Legacy Project, and earn rewards for every successful referral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            'First 15,000 Referrers earn job opportunity working in the 5 investment packages/properties',
            'Top referrers earn head positions and leadership roles in our projects',
            'Top referrers stand a chance to be awarded development, design, etc. contract in their area of specialty',
            'Referral rewards are separate from annual investment returns, providing opportunity to lead project teams'
          ].map((item, index) => (
            <div key={index} className="bg-[#0A2C2D] p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-[#082223] hover:shadow-md">
              <p className={`${dmSans.className}`}>{item}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className={`bg-gray-400 text-white py-3 px-6 rounded-full font-semibold cursor-not-allowed ${dmSans.className}`} disabled>
            Coming Soon
          </button>
        </div>
      </div>
    </section>
  );
}
