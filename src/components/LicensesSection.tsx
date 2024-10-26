import React from 'react';
import { fraunces, dmSans } from '@/app/fonts';

const licenses = [
  { name: 'CAC (Corporate Affairs Commission)', description: 'Registered entity operating under legal guidelines and adhering to best practices in corporate governance.' },
  { name: 'TIN (Tax Identification Number)', description: 'Compliant with all tax regulations and aligned with national tax laws.' },
  { name: 'SEC (Securities and Exchange Commission)', description: 'In the process of filing for SEC certification to ensure full compliance with Nigerian securities law and regulations.' },
  { name: 'EFCC SCUML', description: 'Registered under the Special Control Unit Against Money Laundering to adhere to anti-money laundering regulations.' },
];

export default function LicensesSection() {
  return (
    <section className="mb-8 px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 text-center">
      <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${fraunces.className}`}>Licenses & Certifications</h2>
      <p className={`mb-6 ${dmSans.className} text-sm sm:text-base max-w-xl mx-auto`}>
        At Legacy Project, we take regulatory compliance seriously. Our operations are
        built on a foundation of trust, transparency, and integrity.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {licenses.map((license, index) => (
          <div key={index} className={`${dmSans.className} bg-gray-100 p-4 rounded-lg`}>
            <h3 className="font-semibold text-base sm:text-lg mb-2">{license.name}</h3>
            <p className="text-sm">{license.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}