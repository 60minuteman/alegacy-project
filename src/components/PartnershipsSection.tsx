import React from 'react';
import { fraunces, dmSans } from '@/app/fonts';
import Image from 'next/image';

const partners = [
  { name: 'Melfi Technologies', role: 'Tech Partner', description: 'Melfi Technologies powers our digital infrastructure, providing cutting-edge technology solutions that support our investment platform. From secure payment systems to seamless investor dashboards, Melfi ensures that our tech foundation is robust, user-friendly, and future-proof.' },
  { name: 'Lognetic', role: 'Tech Partner', description: 'Lognetic collaborates with us to deliver next-generation tech solutions, focusing on optimizing investor experiences, refining our platform\'s functionality, and ensuring that data security and performance are of the highest standards.' },
  { name: 'POD Imagery', role: 'Media Partner', description: 'POD Imagery is a leading media company specializing in visual storytelling and branding. They help bring our projects to life by documenting and showcasing every stage of development, ensuring that our investors are engaged and informed through high-quality content.' },
  { name: 'Sekofia', role: 'Health Insurance Partner', description: 'Sekofia is an innovative health insurance company that partners with us to provide our investors with comprehensive health coverage. Through Sekofia, our investors enjoy access to premium health insurance services, ensuring their well-being is protected while they grow their wealth.' },
  { name: 'Kater\'s Design', role: 'Architectural Firm', description: 'Kater\'s Design is an award-winning architectural firm that brings world-class design to our real estate projects. Their expertise ensures that each development is not only functional and aesthetically pleasing but also sustainable and in line with global architectural standards.' },
  { name: 'Genville', role: 'Real Estate and Construction Partner', description: 'Genville is our trusted partner for the construction and development of our real estate projects. Known for their excellence in building large-scale developments, Genville ensures that all projects are delivered on time, with the highest quality standards, and in line with our investors\' expectations.' }
];

export default function PartnershipsSection() {
  return (
    <section className="mb-16 bg-black text-white p-4 sm:p-6 md:p-8 lg:p-[100px] rounded-[0px]">
      <h2 className={`text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 ${fraunces.className} text-left`}>Our Partnerships</h2>
      <p className={`mb-6 sm:mb-8 ${dmSans.className} text-left text-sm sm:text-base`}>
        Our success at Legacy Project is driven by the collaborative efforts of our trusted partners. Together, we ensure that every project is delivered with excellence, from conceptualization to completion. Our partnerships extend across media, technology, architecture, construction, health insurance, and more. Here are our key partners:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {partners.map((partner, index) => (
          <div key={index} className="bg-gray-950 p-4 sm:p-6 rounded-lg flex flex-col items-start transition-all duration-300 hover:bg-gray-900 hover:shadow-lg hover:-translate-y-1">
            <div className="w-full h-32 sm:h-40 bg-gray-900 mb-3 sm:mb-4 rounded-lg flex items-center justify-center">
              <p className="text-gray-100 text-sm sm:text-base">Image of {partner.name}</p>
            </div>
            <h3 className={`text-lg sm:text-xl font-bold mb-1 sm:mb-2 ${fraunces.className} text-left`}>{partner.name}</h3>
            <p className={`text-xs sm:text-sm text-gray-300 mb-2 ${dmSans.className} text-left`}>{partner.role}</p>
            <p className={`text-xs sm:text-sm text-gray-400 ${dmSans.className} text-left`}>{partner.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}