'use client';

import React, { useState, useEffect } from 'react';
import { InformationCircleIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { fraunces, dmSans } from '@/app/fonts';
import GradientBanner from './GradientBanner';
import RetroGrid from './RetroGrid';
import * as Tooltip from '@radix-ui/react-tooltip';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Lottie from 'lottie-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useRouter } from 'next/navigation';
import { clearUserEmail } from '../store/store';

interface Investment {
  id: number;
  packageName: string;
  investmentAmount: number;
  investmentDate: string;
}

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  totalInvestmentAmount: number;
  numberOfPackagesInvested: number;
  referralCode: string;
  referralLink: string;
  investments: Investment[];
}

export default function UserDashboard() {
  const userEmail = useAppSelector((state) => state.user.email);
  console.log('UserEmail from Redux:', userEmail); // Add this line

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [countdown, setCountdown] = useState(6 * 30 * 24 * 60 * 60); // 6 months in seconds
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user-data?email=${userEmail}`);
        if (response.data && response.data.email) {
          setUser(response.data);
          console.log('Fetched user data:', response.data); // Add this line for debugging
        } else {
          throw new Error('User data not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    console.log('UserEmail in UserDashboard:', userEmail);
    if (userEmail) {
      fetchUserData();
    } else {
      setError('No user email found. Please log in again.');
      setLoading(false);
    }
  }, [userEmail]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(timer);
  }, [banners.length]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const banners = ['/nyra-logo.png', '/nyra1.png', '/nyra2.png', '/nyra3.png'];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      duration: 2000,
      position: 'bottom-center',
    });
  };

  const formatCountdown = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Create a function to get a default user object with empty data
  const getEmptyUser = (): User => ({
    id: 0,
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    totalInvestmentAmount: 0,
    numberOfPackagesInvested: 0,
    referralCode: '',
    referralLink: '',
    investments: [],
  });

  const handleLogout = () => {
    setIsLoggingOut(true);
    dispatch(clearUserEmail());
    // Add a slight delay to show the logout message
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  // Full-page loader for logout
  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="animate-spin h-10 w-10 text-gray-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-700">Logging out...</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="animate-spin h-10 w-10 text-gray-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  // Instead of returning early for errors, set an empty user
  const displayUser = user || getEmptyUser();

  console.log('Rendering dashboard with user:', displayUser);

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className={`min-h-screen ${dmSans.className} relative overflow-hidden`}>
        <RetroGrid className="absolute inset-0 z-0" />
        <div className="relative z-10">
          <Toaster />
          <GradientBanner text="Info text goes here" />
          
          {/* Remove the error banner */}
          
          <main className="container mx-auto px-4 py-8 md:max-w-[60%]">
            <div className="bg-[#FAFAFA] rounded-[20px] p-4 md:p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="bg-white rounded-[20px] p-4 md:p-6 relative">
                  <div className="flex flex-col items-start">
                    <div className="w-16 h-16 bg-teal-800 rounded-full flex items-center justify-center text-yellow-300 text-2xl font-bold mb-4">
                      {displayUser.firstName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h2 className={`text-lg font-normal text-gray-800 ${fraunces.className}`}>
                        {displayUser.firstName} {displayUser.lastName}
                      </h2>
                      <p className="text-sm text-gray-600">{displayUser.email}</p>
                      <p className="text-sm text-gray-600">{displayUser.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100">
                      Edit Profile
                    </button>
                    <button 
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-[20px] p-4 md:p-6 relative">
                  <div className="absolute inset-0 bg-black bg-opacity-85 flex items-center justify-center z-10 rounded-[20px]">
                    <p className="text-white text-xl font-bold">Coming Soon</p>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold text-gray-800">Your referrals</h3>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </Tooltip.Trigger>
                      <Tooltip.Content 
                        className="bg-gray-900 p-2 rounded shadow-lg text-xs text-white"
                        sideOffset={5}
                      >
                        Information about your referrals
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </div>
                  <p className={`text-2xl font-normal text-gray-900 ${fraunces.className}`}>
                    {displayUser.referrals?.toLocaleString() || '0'}
                  </p>
                  
                  <div className="mt-4 bg-[#004643] bg-opacity-10 rounded-lg p-4">
                    <div className="flex items-center bg-white rounded-lg p-2 mb-2">
                      <input 
                        type="text" 
                        value={displayUser.referralLink || 'Loading referral link...'}
                        readOnly 
                        className="bg-transparent flex-grow text-xs text-gray-600 outline-none"
                      />
                      <button 
                        onClick={() => copyToClipboard(displayUser.referralLink || '')}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <ClipboardIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-center">
                      <button className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-xs text-gray-400 cursor-not-allowed" disabled>
                        Refer friends
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="bg-white rounded-[20px] p-4 md:p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-semibold text-gray-800">Total Investment</h3>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </Tooltip.Trigger>
                      <Tooltip.Content 
                        className="bg-gray-900 p-2 rounded shadow-lg text-xs text-white"
                        sideOffset={5}
                      >
                        Information about your total investment
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </div>
                  <p className={`text-3xl font-bold text-gray-900 ${fraunces.className} mb-1`}>
                    ₦{displayUser.totalInvestmentAmount?.toLocaleString() || '0'}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">Total Investment Amount</p>
                  <button className="px-3 bg-gray-300 text-gray-500 rounded-full text-xs cursor-not-allowed h-[44px] w-full" disabled>
                    Upgrade Investment
                  </button>
                </div>
                
                <div className="bg-white rounded-[20px] p-4 md:p-6">
                  <div className="flex items-center mb-4">
                    <h3 className={`text-sm font-semibold text-gray-800 mr-2 ${dmSans.className}`}>Next Payment</h3>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </Tooltip.Trigger>
                      <Tooltip.Content 
                        className="bg-gray-900 p-2 rounded shadow-lg text-xs text-white"
                        sideOffset={5}
                      >
                        Information about your next payment
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </div>
                  <p className={`text-xl font-normal text-red-600 ${fraunces.className}`}>
                    {formatCountdown(6 * 30 * 24 * 60 * 60)} {/* 6 months in seconds */}
                  </p>
                  <div className="mt-4 bg-orange-100 rounded-lg p-3">
                    <p className="text-xs text-orange-800 font-medium">
                      Attention: This is the number of days left for you to upgrade your investment.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-[20px] overflow-hidden" style={{ height: '270px' }}>
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base font-semibold text-gray-800">Your Investments</h3>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                        </Tooltip.Trigger>
                        <Tooltip.Content 
                          className="bg-gray-900 p-2 rounded shadow-lg text-xs text-white"
                          sideOffset={5}
                        >
                          Information about your investments
                          <Tooltip.Arrow className="fill-gray-900" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </div>
                    <div className="overflow-y-auto flex-grow pr-2">
                      {displayUser.investments && displayUser.investments.length > 0 ? (
                        <div className="space-y-4">
                          {displayUser.investments.map((investment, index) => (
                            <div key={investment.id || index}>
                              <div className="flex items-center py-4">
                                <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center mr-4">
                                  <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-normal text-gray-800">{investment.packageName}</p>
                                  <p className="text-xs text-gray-500">
                                    {new Date(investment.investmentDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {index < (displayUser.investments?.length || 0) - 1 && (
                                <div className="border-b border-gray-200"></div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="w-11 h-11 mb-4">
                            <Lottie 
                              animationData={require('/public/empty.json')} 
                              loop={true}
                            />
                          </div>
                          <p className="text-sm font-semibold text-gray-800 mb-1">No investments yet.</p>
                          <p className="text-xs text-gray-600 text-center">
                            When you make an investment, they show up here.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-[20px] overflow-hidden relative border border-gray-200" style={{ height: '270px' }}>
                  <div className="absolute top-2 left-2 z-20">
                    <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full">
                      Sponsored Ad
                    </span>
                  </div>
                  <div className="relative w-full h-full overflow-hidden">
                    {banners.map((banner, index) => (
                      <a 
                        key={index}
                        href="https://www.nyrawallet.com/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`absolute inset-0 w-full h-full flex items-center justify-center bg-cover bg-center bg-no-repeat transition-transform duration-500 ease-in-out ${
                          index === currentBanner ? 'translate-x-0' : 'translate-x-full'
                        }`}
                        style={{ 
                          backgroundImage: `url("${banner}")`,
                          zIndex: index === currentBanner ? 1 : 0
                        }}
                      >
                        <span className="sr-only">Nyra Wallet</span>
                      </a>
                    ))}
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                    {banners.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full shadow-md ${
                          index === currentBanner ? 'bg-teal-600' : 'bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </Tooltip.Provider>
  );
}