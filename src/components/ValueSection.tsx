import React from 'react';
import { fraunces, dmSans } from '@/app/fonts';

const ValueSection: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl md:text-4xl font-bold mb-8 text-left text-[#0F3D3E] ${fraunces.className}`}>
          A Unique Opportunity for 5 Million Visionaries
        </h2>
        <div className={`text-lg text-gray-700 space-y-6 ${dmSans.className} text-left`}>
          <p>
            Legacy Project offers a limited opportunity for up to 5 million investors to be part of something transformative. This exclusive community of investors will earn guaranteed, consistent returns starting at ₦100,000 annually on a modest ₦10,000 investment, with potential growth to ₦500,000 annually within the first decade.
          </p>
          <p>
            In addition to financial growth, investors will have access to multiple revenue streams, including opportunities to work as employees or contractors for our projects. Leadership roles will be filled through referrals, ensuring that key positions are held by individuals with deep personal investment in the success of the project.
          </p>
          <p>
            As an investor, you're not only securing your future but also contributing to the creation of over 20,000 jobs across a variety of sectors.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;