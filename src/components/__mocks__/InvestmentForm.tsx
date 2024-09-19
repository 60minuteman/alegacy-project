import React from 'react';

const mockRetroGrid = () => <div data-testid="mock-retro-grid" />;
const mockSpinner = () => <div data-testid="mock-spinner" />;

const mockDmSans = { className: 'mock-dm-sans' };
const mockFraunces = { className: 'mock-fraunces' };

const InvestmentForm: React.FC = () => {
  return (
    <div>
      {mockRetroGrid()}
      <main className={`mock-main ${mockDmSans.className}`}>
        <div>
          <h1 className={`mock-h1 ${mockFraunces.className}`}>Investment Options</h1>
          {/* Mock the rest of your component structure */}
        </div>
      </main>
    </div>
  );
};

export default InvestmentForm;
