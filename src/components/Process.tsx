import React from 'react';
import { fraunces, dmSans } from '@/app/fonts';

const objectives = [
  {
    number: '01',
    title: 'Empower Financial Freedom',
    description: 'Enable investors to earn consistent returns with minimal risk by providing high-quality real estate opportunities.'
  },
  {
    number: '02',
    title: 'Create Jobs',
    description: 'Develop properties that will create 20,000+ employment opportunities, supporting economic growth and financial empowerment.'
  },
  {
    number: '03',
    title: 'Transparency & Trust',
    description: 'Ensure 100% transparency throughout the investment and development process, from initial funding to property launch.'
  },
  {
    number: '04',
    title: 'Investor-Centric Growth',
    description: 'Increase annual return on investment from ₦50,000 to ₦500,000 within the first decade of operation.'
  },
  {
    number: '05',
    title: 'Inclusive Development',
    description: 'Allocate 50% of project contracts to investors, allowing them to earn as contractors or suppliers during the development phase.'
  },
  {
    number: '06',
    title: 'Education & Knowledge Transfer',
    description: 'Sponsor/train head referrals to top training institutions, providing skills and knowledge to lead our legacy projects effectively.'
  }
];

const Process: React.FC = () => {
  return (
    <section className="bg-[#0F3D3E] text-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16">
          <h3 className={`text-xs font-light mb-4 ${dmSans.className}`}>OBJECTIVES AND GOALS</h3>
          <h2 className={`text-xl md:text-4xl font-thin mb-8 ${fraunces.className}`}>Strategic Vision & Growth Objectives</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objectives.map((objective, index) => (
            <div key={index} className="bg-[#0A2C2D] p-6 rounded-lg transition-all duration-300 hover:bg-[#082223] hover:shadow-lg">
              <div className={`text-2xl md:text-4xl font-bold mb-4 text-[#F3EFE0] ${fraunces.className}`}>{objective.number}</div>
              <h3 className={`text-sm md:text-base font-semibold mb-4 text-[#F3EFE0] ${dmSans.className}`}>{objective.title}</h3>
              <p className={`text-sm md:text-base font-light text-[#E0DCD0] ${dmSans.className}`}>{objective.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
