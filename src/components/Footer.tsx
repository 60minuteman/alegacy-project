import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fraunces, dmSans } from '@/app/fonts';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F3D3E] text-white py-20" style={{ height: '720.68px' }}>
      <div className="container mx-auto px-4 max-w-6xl"> {/* Adjust max-width to match navbar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h2 className={`text-4xl md:text-5xl font-bold mb-8 ${fraunces.className}`}>
              Ready To Build Your<br />Dream Project?
            </h2>
            <button className={`bg-[#F9F5EB] text-[#0F3D3E] px-6 py-3 rounded-full hover:bg-white transition duration-300 ${dmSans.className}`}>
              Get in touch
              <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${dmSans.className}`}>Company</h3>
            <ul className={`space-y-2 ${dmSans.className}`}>
              <li><Link href="/projects">Projects</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/career">Career</Link></li>
            </ul>
          </div>
          <div>
            <h3 className={`text-xl font-semibold mb-4 ${dmSans.className}`}>Pages</h3>
            <ul className={`space-y-2 ${dmSans.className}`}>
              <li><Link href="/terms">Terms & Condition</Link></li>
              <li><Link href="/policies">Policies</Link></li>
              <li><Link href="/faqs">FAQs</Link></li>
              <li><Link href="/404">404</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center">
              <Image src="/pogo.svg" alt="Nextspace" width={201.53} height={36.82} />
             
            </div>
            <div className={dmSans.className}>
              <p>Develops conceptual design ideas, refines</p>
              <p>them into detailed plans.</p>
            </div>
            <div className={dmSans.className}>
              <p>70 University Ave</p>
              <p>Palo Alto, CA 94301</p>
              <p>6506711706</p>
              <p>hello@dvlpmedicines.com</p>
            </div>
          </div>
          <div className={`mt-8 flex justify-between items-center ${dmSans.className}`}>
            <p>&copy; 2023 Nextspace. All rights reserved.</p>
            <div className="space-x-4">
              <Link href="#">Discord</Link>
              <Link href="#">Twitter</Link>
              <Link href="#">LinkedIn</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;