'use client'

const React = require('react');
const { render } = require('@testing-library/react');
const InvestmentForm = require('../InvestmentForm').default;

jest.mock('../InvestmentForm');

describe('InvestmentForm', () => {
  test('renders form fields correctly', () => {
    const { getByTestId, getByText } = render(<InvestmentForm />);
    expect(getByTestId('mock-retro-grid')).toBeInTheDocument();
    expect(getByText('Investment Options')).toBeInTheDocument();
    // Add more assertions based on your mocked component structure
  });

  // Add more tests here...
});
