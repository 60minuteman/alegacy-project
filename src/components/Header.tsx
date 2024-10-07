'use client';  // Add this line at the top of the file

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="pt-[18px] px-4 fixed w-full z-50">
      <nav className="container mx-auto bg-white bg-opacity-80 border border-[#CECECE] rounded-full shadow-sm px-6 py-3 flex justify-between items-center max-w-6xl">
        {/* Navigation links - hidden on mobile, visible on desktop */}
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-[#0F3D3E]">Home</a>
          <a href="#" className="text-gray-600 hover:text-[#0F3D3E]">About us</a>
          <a href="#" className="text-gray-600 hover:text-[#0F3D3E]">Contact</a>
        </div>

        {/* Logo - centered on desktop */}
        <div className="flex items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
          <Image src="/Logo.svg" alt="Legacy Project Logo" width={100} height={18} />
        </div>

        {/* Login button */}
        <div>
          <Link href="/user-login" passHref>
            <button className="bg-[#0F3D3E] text-white px-4 py-2 text-sm md:px-6 md:py-2 md:text-base rounded-full hover:bg-[#0D3233] transition duration-300">
              Log in
            </button>
          </Link>
        </div>
      </nav>
    </header>
  );
}