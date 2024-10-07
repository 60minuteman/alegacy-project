import React from 'react';
import Link from 'next/link';
import { fraunces, dmSans } from '@/app/fonts';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F3D3E] text-white py-20" style={{ height: 'auto', minHeight: '720.68px' }}>
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <div className="mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${fraunces.className}`}>
            Ready to invest in your future?
          </h2>
          <p className={`text-xl mb-8 ${dmSans.className}`}>
            Join the Legacy Project today and build a lasting financial legacy for generations to come!
          </p>
          <button className={`bg-[#F9F5EB] text-[#0F3D3E] px-6 py-3 rounded-full hover:bg-white transition duration-300 ${dmSans.className}`}>
            Invest Now
          </button>
        </div>
        
        <div className="bg-[#0A2C2D] py-8 rounded-lg">
          <ul className={`flex flex-wrap justify-center space-x-4 mb-6 ${dmSans.className}`}>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/career">Career</Link></li>
          </ul>
          
          <div className="w-full h-px bg-gray-600 my-6"></div>
          
          <div className={`flex flex-col md:flex-row justify-between items-center px-6 md:px-24 ${dmSans.className}`}>
            <p className="mb-4 md:mb-0">&copy; 2024 Legacy Projects. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="#">Twitter</Link>
              <Link href="#">LinkedIn</Link>
              <Link href="#">Instagram</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;