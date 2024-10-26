import React from 'react';

interface AboutSectionProps {
  title: string;
  content: string | React.ReactNode;
}

export function AboutSection({ title, content }: AboutSectionProps) {
  return (
    <section className="mb-12 bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-[#F9BC60]">{title}</h2>
      {typeof content === 'string' ? (
        <p className="text-lg">{content}</p>
      ) : (
        content
      )}
    </section>
  );
}
