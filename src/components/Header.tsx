import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="pt-[18px] px-4 fixed w-full z-50">
      <nav className="container mx-auto bg-white bg-opacity-80 border border-[#CECECE] rounded-full shadow-sm px-6 py-3 flex justify-between items-center max-w-6xl">
        <div className="flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-[#0F3D3E]">Home</a>
          <a href="#" className="text-gray-600 hover:text-[#0F3D3E]">About us</a>
          <a href="#" className="text-gray-600 hover:text-[#0F3D3E]">Contact</a>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Image src="/Logo.svg" alt="Legacy Project Logo" width={201.53} height={36.82} />
        </div>
        <button className="bg-[#0F3D3E] text-white px-6 py-2 rounded-full hover:bg-[#0D3233] transition duration-300">Log in</button>
      </nav>
    </header>
  );
}