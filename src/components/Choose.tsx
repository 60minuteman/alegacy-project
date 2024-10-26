import React from 'react';
import { fraunces, dmSans } from '@/app/fonts';

const reasons = [
  {
    number: '01',
    title: 'Guaranteed Returns',
    description: 'Earn consistent, growing returns starting with ₦100,000 annually from a ₦10,000 investment, with growth potential to ₦500,000 within the first decade.'
  },
  {
    number: '02',
    title: 'Multiple Income Streams',
    description: 'In addition to investment returns, earn as employees, contractors, or through our referral program. Project contracts will be awarded to investors, creating additional income opportunities.'
  },
  {
    number: '03',
    title: 'Career Growth & Development',
    description: `If selected for a leadership role, we'll sponsor your professional development to ensure you're equipped to succeed in construction, hospitality, or other industries.`
  },
  {
    number: '04',
    title: 'Transparency & Trust',
    description: `We are committed to 100% transparency. You'll be part of every stage, from land acquisition to the completion and grand opening of each project.`
  },
  {
    number: '05',
    title: 'Job Creation',
    description: 'Our developments will generate over 20,000 jobs across various industries, from construction to hospitality, with key leadership positions awarded based on referrals.'
  }
];

const Choose: React.FC = () => {
  return (
    <section className="bg-[#0F3D3E] text-white py-20 rounded-[0px]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16">
          <h3 className={`text-xs font-light mb-4 ${dmSans.className}`}>WHY CHOOSE US</h3>
          <h2 className={`text-xl md:text-4xl font-thin mb-8 ${fraunces.className}`}>Why Choose Legacy Project?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-[#0A2C2D] p-6 rounded-lg transition-all duration-300 hover:bg-[#082223] hover:shadow-lg">
              <div className={`text-2xl md:text-4xl font-bold mb-4 text-[#F3EFE0] ${fraunces.className}`}>{reason.number}</div>
              <h3 className={`text-sm md:text-base font-semibold mb-4 text-[#F3EFE0] ${dmSans.className}`}>{reason.title}</h3>
              <p className={`text-sm md:text-base font-light text-[#E0DCD0] ${dmSans.className}`}>{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Choose;
