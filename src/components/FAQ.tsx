'use client';

import React, { useState, useCallback } from 'react';
import { fraunces, dmSans } from '@/app/fonts';

const faqItems = [
  {
    number: '01',
    question: 'What is the Legacy Project?',
    answer: 'The Legacy Project is a real estate investment platform that offers carefully curated investment packages designed to provide high returns and steady growth. We focus on transforming visions into reality through secure and transparent transactions.'
  },
  {
    number: '02',
    question: 'How can I invest in the Legacy Project?',
    answer: "Currently, our investment platform is in development. Once launched, you'll be able to create an account, browse available investment packages, and invest directly through our secure online platform. Stay tuned for our launch announcement!"
  },
  {
    number: '03',
    question: 'What types of properties does the Legacy Project invest in?',
    answer: 'We invest in a diverse range of properties, including residential, commercial, and mixed-use developments. Our team carefully selects projects with high potential for returns and positive community impact.'
  },
  {
    number: '04',
    question: 'How does the referral program work?',
    answer: 'Our referral program rewards you for bringing new investors to the Legacy Project. You can earn job opportunities, leadership roles, and even contract awards based on your referral performance. Specific details will be available when we launch the program.'
  },
  {
    number: '05',
    question: 'What are the minimum investment amounts?',
    answer: 'Investment minimums will vary depending on the specific project or package. We aim to offer opportunities for investors at various levels, from beginners to experienced real estate investors. Exact figures will be provided when our investment platform launches.'
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleQuestion = useCallback((index: number) => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <h3 className={`text-sm uppercase text-[#0F3D3E] font-semibold mb-4 ${dmSans.className}`}>FAQS</h3>
            <h2 className={`text-4xl text-[#0F3D3E] font-bold mb-8 ${fraunces.className}`}>Still Have A Question?</h2>
          </div>
          <div className="md:w-2/3">
            {faqItems.map((item, index) => (
              <div key={item.number} className="mb-4 border border-gray-200 rounded-lg">
                <button
                  className="w-full text-left p-4 focus:outline-none flex justify-between items-center"
                  onClick={() => toggleQuestion(index)}
                >
                  <div className="flex items-center">
                    <span className={`text-sm text-gray-400 mr-4 ${dmSans.className}`}>{item.number}</span>
                    <span className={`text-lg font-semibold text-[#0F3D3E] ${dmSans.className}`}>{item.question}</span>
                  </div>
                  <svg
                    className={`w-6 h-6 transform transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <div className="p-4 pt-0">
                    <p className={`text-gray-600 ${dmSans.className}`}>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;