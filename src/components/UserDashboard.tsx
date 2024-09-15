import React, { useState, useEffect } from 'react';
import { InformationCircleIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { fraunces, dmSans } from '@/app/fonts';
import GradientBanner from './GradientBanner';
import * as Tooltip from '@radix-ui/react-tooltip';
import toast, { Toaster } from 'react-hot-toast';

export default function UserDashboard() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    totalInvestment: 0,
    referrals: 0,
    referralLink: '',
    nextPaymentCountdown: '',
    investments: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = ['/nyra-logo.png', '/nyra1.png', '/nyra2.png', '/nyra3.png'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', {
      duration: 2000,
      position: 'bottom-center',
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className={`min-h-screen ${dmSans.className}`}>
        <Toaster />
        <GradientBanner text="Info text goes here" />
        
        <main className="container mx-auto px-4 py-8 max-w-[60%]">
          <div className="bg-[#FAFAFA] rounded-[20px] p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-[20px] p-6 relative">
                <div className="flex flex-col items-start">
                  <div className="w-16 h-16 bg-teal-800 rounded-full flex items-center justify-center text-yellow-300 text-2xl font-bold mb-4">
                    {userData.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold text-gray-800 ${fraunces.className}`}>{userData.name}</h2>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                    <p className="text-sm text-gray-600">{userData.phone}</p>
                  </div>
                </div>
                <button className="absolute top-6 right-6 px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100">
                  Edit Profile
                </button>
              </div>
              
              <div className="bg-white rounded-[20px] p-6">
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
                <p className={`text-2xl font-bold mb-2 text-gray-900 ${fraunces.className}`}>{userData.referrals.toLocaleString()}</p>
                <button className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100">
                  Refer friends
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-[20px] p-6">
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
                <p className={`text-2xl font-bold mb-2 text-gray-900 ${fraunces.className}`}>${userData.totalInvestment.toLocaleString()}</p>
                <button className="px-3 bg-teal-600 text-white rounded-full text-xs hover:bg-teal-700 h-[44px]">
                  Upgrade Investment
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-[20px] p-6">
                  <div className="flex items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-800 mr-2">Referral link</h3>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <InformationCircleIcon className="w-4 h-4 text-gray-400 cursor-pointer" />
                      </Tooltip.Trigger>
                      <Tooltip.Content 
                        className="bg-gray-900 p-2 rounded shadow-lg text-xs text-white"
                        sideOffset={5}
                      >
                        Information about your referral link
                        <Tooltip.Arrow className="fill-gray-900" />
                      </Tooltip.Content>
                    </Tooltip.Root>
                  </div>
                  <div className="flex items-center bg-white rounded-lg p-2 mb-4">
                    <input 
                      type="text" 
                      value={userData.referralLink} 
                      readOnly 
                      className="bg-transparent flex-grow text-xs text-gray-600 outline-none"
                    />
                    <button 
                      onClick={() => copyToClipboard(userData.referralLink)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <ClipboardIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <button className="px-3 py-1 border border-gray-300 rounded-full text-xs text-gray-700 hover:bg-gray-100 w-full">
                    Share referral link
                  </button>
                </div>

                <div className="bg-white rounded-[20px] p-6">
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
                  <p className={`text-xl font-bold text-red-600 ${fraunces.className}`}>{userData.nextPaymentCountdown}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="space-y-4">
                      {userData.investments.map((investment, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between py-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-purple-200 rounded-lg flex items-center justify-center mr-4">
                                <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-normal text-gray-800">{investment.name}</p>
                                <p className="text-xs text-gray-500">{investment.date}</p>
                              </div>
                            </div>
                            <button className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs hover:bg-gray-300 transition-colors">
                              view details
                            </button>
                          </div>
                          {index < userData.investments.length - 1 && (
                            <div className="border-b border-gray-200"></div>
                          )}
                        </div>
                      ))}
                    </div>
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
    </Tooltip.Provider>
  );
}