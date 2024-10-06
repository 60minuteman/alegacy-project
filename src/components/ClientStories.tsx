import React from 'react';
import Image from 'next/image';
import { fraunces, dmSans } from '@/app/fonts';

export default function ClientStories() {
  return (
    <section className="bg-[#0F3D3E] text-white overflow-hidden">
      <div className="container mx-auto max-w-6xl relative"> {/* Adjust max-w-6xl to match your navbar width */}
        <div className="flex flex-col md:flex-row">
          {/* Left side - Text content */}
          <div className="w-full md:w-1/2 p-12 md:p-24 flex flex-col justify-center">
            <h3 className={`text-sm uppercase mb-4 ${dmSans.className}`}>TESTIMONIALS</h3>
            <h2 className={`text-5xl mb-8 ${fraunces.className}`}>Client Stories</h2>
            <blockquote className={`text-xl mb-8 ${dmSans.className}`}>
              &quot;Working with Legacy&apos;s Project has been a game-changer for our business. Their innovative approach and dedication to excellence have truly set them apart.&quot;
            </blockquote>
            <div className={`${dmSans.className}`}>
              <p className="font-semibold">Jhon Doe</p>
              <p className="text-sm opacity-70">Founder, BramBram</p>
            </div>
            <div className="mt-8 flex space-x-4">
              <button className="p-2 border border-white rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 border border-white rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="w-full md:w-1/2 absolute right-0 top-0 bottom-0">
            <Image
              src="/2.png"
              alt="Interior Design"
              layout="fill"
              objectFit="cover"
              objectPosition="left"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
