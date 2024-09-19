'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { fraunces, dmSans } from '../fonts';

// Define the Package interface
interface Package {
  name: string;
  description: string;
  price: number;
}

// Define the packages array
const packages: Package[] = [
  { name: 'Basic', description: 'Basic package description', price: 100 },
  { name: 'Standard', description: 'Standard package description', price: 200 },
  { name: 'Premium', description: 'Premium package description', price: 300 },
  // Add more packages as needed
];

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  investmentPackages?: string[];
}

interface UpgradeInvestmentProps {
  userData: UserData | null;
  onClose: () => void;
}

export default function UpgradeInvestment({ userData, onClose }) {
  const router = useRouter();
  const [name, setName] = useState(`${userData?.firstName} ${userData?.lastName}`);
  const [email, setEmail] = useState(userData?.email);
  const [phone, setPhone] = useState(userData?.phoneNumber);
  const [selectedPackages, setSelectedPackages] = useState<string[]>(userData?.investmentPackages || []);
  const [isGeneratingAccount, setIsGeneratingAccount] = useState(false);

  const handlePackageSelection = (packageName: string) => {
    if (!isGeneratingAccount) {
      setSelectedPackages(prev => 
        prev.includes(packageName) 
          ? prev.filter(p => p !== packageName)
          : [...prev, packageName]
      );
    }
  };

  const totalInvestment = selectedPackages.length * 50;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAccount(true);
    console.log('Submit button clicked');

    try {
      const payload = {
        amount: totalInvestment,
        name,
        email,
        phone
      };
      console.log('Payload prepared:', payload);

      console.log('Sending request to backend...');
      const response = await axios.post('http://localhost:3001/api/generate-account', payload);

      console.log('Backend Response:', response.data);

      if (response.data.success && response.data.accountNumber) {
        console.log('Account number generated successfully');
        toast.success('Account number generated successfully!');
        const redirectUrl = `/payment?accountNumber=${response.data.accountNumber}&totalAmount=${totalInvestment}&phoneNumber=${encodeURIComponent(phone)}&bankName=${encodeURIComponent(response.data.bankName)}&accountName=${encodeURIComponent(response.data.accountName)}`;
        console.log('Redirecting to:', redirectUrl);
        router.push(redirectUrl);
      } else {
        console.error('Unexpected response structure:', response.data);
        throw new Error('Failed to generate account number: Unexpected response structure');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
        console.error('Axios error status:', error.response?.status);
        console.error('Axios error headers:', error.response?.headers);
        console.error('Axios error config:', error.config);
      }
      toast.error('Failed to generate account number. Please try again.');

      // Log error to the server
      try {
        await axios.post('http://localhost:3001/api/log-error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          componentName: 'UpgradeInvestment',
          action: 'handleSubmit'
        });
      } catch (logError) {
        console.error('Failed to log error to server:', logError);
      }
    } finally {
      setIsGeneratingAccount(false);
    }
  };

  return (
    <main className={`min-h-screen bg-gray-100 py-12 flex items-center justify-center ${dmSans.className}`}>
      <div className="bg-gray-100 rounded-xl p-8 max-w-4xl w-full">
        <h1 className={`text-2xl font-bold mb-6 text-primary ${fraunces.className}`}>Upgrade Investment</h1>
        <p className="mb-4 text-gray-800">Select one or more investment packages to upgrade your investment.</p>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <ul className="space-y-2">
              {packages.map((pkg) => (
                <li 
                  key={pkg.name} 
                  onClick={() => handlePackageSelection(pkg.name)}
                  className={`flex items-center bg-white rounded-xl shadow-sm p-2 cursor-pointer transition-all duration-300 ${
                    selectedPackages.includes(pkg.name) ? 'border-2 border-primary' : 'border-2 border-transparent hover:border-gray-200'
                  } ${isGeneratingAccount ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex-grow">
                    <span className={`${fraunces.className} font-bold text-gray-900 block`}>{pkg.name}</span>
                    <span className="font-bold text-primary text-sm">
                      NGN {pkg.price.toLocaleString()}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    selectedPackages.includes(pkg.name) 
                      ? 'border-primary bg-primary' 
                      : 'border-gray-300'
                  }`}>
                    {selectedPackages.includes(pkg.name) && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
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
              <p className="mb-4 text-gray-800">Confirm your details to proceed.</p>
              <div className="mb-4 bg-primary-50 border border-primary-200 text-primary px-4 py-3 rounded-xl relative">
                <strong className={`font-bold ${fraunces.className}`}>Total Investment:</strong>
                <span className="block sm:inline"> NGN {totalInvestment.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full p-2 border rounded-xl text-gray-900 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-white px-6 py-4 rounded-full font-semibold hover:bg-opacity-90 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isGeneratingAccount || selectedPackages.length === 0}
              >
                {isGeneratingAccount ? 'Generating Account...' : 'Generate Payment Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </main>
  );
}
