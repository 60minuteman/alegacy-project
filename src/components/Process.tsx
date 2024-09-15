import React from 'react';
import { fraunces, dmSans } from '@/app/fonts';

const steps = [
  {
    number: '01',
    title: 'Initial Consultation',
    description: 'The process often begins with an initial consultation between the designer/architect. Get started from here.'
  },
  {
    number: '02',
    title: 'Concept Development',
    description: 'In this stage, the designer/architect gathers detailed information about the project requirements.'
  },
  {
    number: '03',
    title: 'Design Development',
    description: 'Depending on the project scope and location, the designer/architect may assist the client in obtaining.'
  },
  {
    number: '04',
    title: 'Permitting & Approvals',
    description: 'Depending on the project scope and location, the designer/architect may assist the client. We work to make you 100% happy.'
  },
  {
    number: '05',
    title: 'Project Closeout',
    description: 'Once construction is complete, the designer/architect conducts a final inspection of the project.'
  }
];

const Process: React.FC = () => {
  return (
    <section className="bg-[#0F3D3E] text-white py-20">
      <div className="container mx-auto px-4 max-w-6xl"> {/* Set max-width */}
        <div className="mb-16">
          <h3 className={`text-sm uppercase mb-4 ${dmSans.className}`}>SERVICES</h3>
          <h2 className={`text-5xl mb-8 ${fraunces.className}`}>Our Working<br />Process</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {steps.map((step, index) => (
            <div key={index}>
              <div className={`text-xl mb-4 ${dmSans.className}`}>{step.number}</div>
              <h3 className={`text-2xl mb-4 ${fraunces.className}`}>{step.title}</h3>
              <p className={`text-gray-300 ${dmSans.className}`}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
