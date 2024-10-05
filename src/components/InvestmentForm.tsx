'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import RetroGrid from './RetroGrid';
import Spinner from './Spinner';
import { dmSans, fraunces } from '@/app/fonts';
import { useAppDispatch } from '../store/hooks';
import { setUserEmail } from '../store/store';
import { sanitizeString } from '@/utils/sanitize';
import Button from './Button';

const PACKAGE_PRICE = 20;

const packages = [
  { id: 1, name: 'Elementary School' },
  { id: 2, name: 'Highschool' },
  { id: 3, name: 'University' },
  { id: 4, name: 'Hospital' },
  { id: 5, name: 'Hotel' },
];

const checkPaymentStatus = async (sessionId: string) => {
  try {
    const response = await axios.get(`/api/check-payment-status?sessionId=${sessionId}`);
    return response.data.status;
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

const pollPaymentStatus = async (sessionId: string) => {
  const maxAttempts = 10;
  const interval = 5000; // 5 seconds

  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkPaymentStatus(sessionId);
    if (status === 'PAID') {
      // Payment successful, proceed with next steps
      return true;
    } else if (status === 'FAILED') {
      // Payment failed, handle accordingly
      return false;
    }
    // Wait before next attempt
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  // Payment status still pending after all attempts
  throw new Error('Payment verification timeout');
};

const verifyPayment = async (accountNumber) => {
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ account_number: accountNumber }),
  });
  const data = await response.json();
  if (data.success) {
    console.log('Payment verified. Session ID:', data.data.sessionId);
    // Proceed with post-payment actions
  } else if (response.status === 202) {
    console.log('Payment not yet verified. Retrying...');
    // Implement retry logic here
  } else {
    console.error('Payment verification failed:', data.message);
  }
};

export default function InvestmentForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    amount: '',
  });
  const [formErrors, setFormErrors] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [selectedPackages, setSelectedPackages] = useState<number[]>([]);
  const [isGeneratingAccount, setIsGeneratingAccount] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitAttempted, setIsSubmitAttempted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [accountDetails, setAccountDetails] = useState<any>(null);

  const handlePackageSelection = (packageId: number) => {
    setSelectedPackages(prev => 
      prev.includes(packageId) 
        ? prev.filter(id => id !== packageId)
        : [...prev, packageId]
    );
  };

  const totalInvestment = selectedPackages.length * PACKAGE_PRICE;

  const validateForm = () => {
    const errors = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
    };

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{11}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid 11-digit phone number';
    }

    setFormErrors(errors);

    const isValid = Object.values(errors).every(error => error === '') && selectedPackages.length >= 3;
    setIsFormValid(isValid);
    return isValid;
  };

  useEffect(() => {
    validateForm();
  }, [formData, selectedPackages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, '').slice(0, 11);
      setFormData({ ...formData, [name]: phoneValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const selectedPackageDetails = selectedPackages.map(id => {
        const pkg = packages.find(p => p.id === id);
        return {
          packageId: id,
          packageName: pkg ? pkg.name : 'Unknown Package',
          investmentAmount: PACKAGE_PRICE
        };
      });

      const payload = {
        ...formData,
        amount: totalInvestment,
        selectedPackages: selectedPackageDetails
      };
      const response = await axios.post('/api/generate-account', payload);
      console.log('API Response:', response.data);
      
      if (response.data.status === true) {
        const accountDetails = response.data.message.details;
        const queryParams = new URLSearchParams({
          account_number: accountDetails.account[0].account_number,
          account_name: accountDetails.account[0].account_name,
          bank: accountDetails.account[0].bank_name,
          amount: totalInvestment.toString(),
          sessionId: response.data.sessionId // Assuming the API returns a sessionId
        }).toString();

        // Redirect to the payment page with query parameters
        router.push(`/payment?${queryParams}`);
      } else {
        throw new Error(response.data.description || 'Failed to generate account');
      }
    } catch (error) {
      console.error('Error generating account:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <RetroGrid opacity={10} />
      <main className={`relative z-10 min-h-screen py-12 flex items-center justify-center ${dmSans?.className || ''}`}>
        <div className="rounded-xl bg-[#FAFAFA] p-8 max-w-4xl w-full shadow-lg">
          <h1 className={`text-2xl font-bold mb-6 text-primary ${fraunces?.className || ''}`}>Investment Options</h1>
          <p className="mb-4 text-gray-800">Select at least 3 investment packages to get started.</p>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <ul className="space-y-2">
                {packages.map((pkg) => (
                  <li 
                    key={pkg.id} 
                    onClick={() => handlePackageSelection(pkg.id)}
                    className={`flex items-center bg-white rounded-xl shadow-sm p-2 cursor-pointer transition-all duration-300 ${
                      selectedPackages.includes(pkg.id) ? 'border-2 border-primary' : 'border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex-grow">
                      <span className={`${fraunces.className} font-bold text-gray-900 block`}>{pkg.name}</span>
                      <span className="font-bold text-primary text-sm">
                        NGN {PACKAGE_PRICE.toLocaleString()}
                      </span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPackages.includes(pkg.id) 
                        ? 'border-primary bg-primary' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPackages.includes(pkg.id) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2">
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md">
                <p className="mb-4 text-gray-800">Enter your details to proceed.</p>
                <div className="mb-4 bg-[#e6ecec] border border-[#004643] text-[#004643] px-4 py-3 rounded-xl relative">
                  <strong className={`font-bold ${fraunces.className}`}>Total Investment:</strong>
                  <span className="block sm:inline"> NGN {totalInvestment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email address"
                    className="w-full p-2 border rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary"
                  />
                  {isSubmitAttempted && formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Full Name
                  </label>
                  <div className="flex">
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      placeholder="First name"
                      className="w-1/2 p-2 border-t border-b border-l rounded-l-xl text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary"
                    />
                    <div className="w-px bg-gray-300"></div>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      placeholder="Last name"
                      className="w-1/2 p-2 border-t border-b border-r rounded-r-xl text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {isSubmitAttempted && (formErrors.first_name || formErrors.last_name) && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.first_name || formErrors.last_name}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your phone number"
                    className="w-full p-2 border rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary"
                  />
                  {isSubmitAttempted && formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                
                <Button
                  type="submit"
                  disabled={!isFormValid}
                  isLoading={isGeneratingAccount}
                  onClick={handleSubmit}
                >
                  Generate Payment Account
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}