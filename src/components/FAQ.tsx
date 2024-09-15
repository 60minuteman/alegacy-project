'use client';  // Add this line at the top of the file

import React, { useState } from 'react';
import { fraunces, dmSans } from '@/app/fonts';

const faqItems = [
  {
    number: '01',
    question: 'How involved can I be in the design process?',
    answer: 'We believe in collaboration and value your input throughout the design process. We encourage clients to actively participate in discussions, share their ideas, preferences, and feedback.'
  },
  {
    number: '02',
    question: 'What services do you offer?',
    answer: 'We offer a wide range of interior design services including space planning, color consultation, furniture selection, and project management.'
  },
  {
    number: '03',
    question: 'What is your design process?',
    answer: 'Our design process typically involves an initial consultation, concept development, design presentation, revisions, and implementation.'
  },
  {
    number: '04',
    question: 'How do you establish your design fees?',
    answer: `Our fees are based on the scope and complexity of the project. We offer both hourly rates and flat fee options depending on the client's needs.`
  },
  {
    number: '05',
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary depending on the scope of work. A typical room redesign might take 4-8 weeks, while a full home renovation could take several months.'
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <h3 className={`text-sm uppercase text-[#0F3D3E] font-semibold mb-4 ${dmSans.className}`}>FAQS</h3>
            <h2 className={`text-4xl text-[#0F3D3E] font-bold mb-8 ${fraunces.className}`}>Still Have A Question?</h2>
            <button className={`bg-[#0F3D3E] text-white px-6 py-3 rounded-full hover:bg-[#1A5658] transition duration-300 ${dmSans.className}`}>
              See all FAQs
              <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <div className="md:w-2/3">
            {faqItems.map((item, index) => (
              <div key={index} className="mb-4 border border-gray-200 rounded-lg">
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