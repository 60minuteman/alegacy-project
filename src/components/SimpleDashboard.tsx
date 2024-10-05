'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppSelector } from '../store/hooks';
import { dmSans, fraunces } from '@/app/fonts';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  totalInvestmentAmount: number;
  numberOfPackagesInvested: number;
  referralCode: string;
  referralLink: string | null;
}

export default function SimpleDashboard() {
  const userEmail = useAppSelector((state) => state.user.email);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userEmail) {
          throw new Error('No email found');
        }
        console.log('Fetching user data for email:', userEmail);
        const response = await axios.get(`/api/user-data?email=${encodeURIComponent(userEmail)}`);
        console.log('User data response:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (axios.isAxiosError(error)) {
          console.error('Axios error details:', error.response?.data);
        }
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    console.log('UserEmail in SimpleDashboard:', userEmail);
    if (userEmail) {
      fetchUserData();
    } else {
      setError('No user email found. Please log in again.');
      setLoading(false);
    }
  }, [userEmail]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;

  return (
    <div className={`min-h-screen ${dmSans.className} bg-gray-100 py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-teal-600">
          <h3 className={`text-lg leading-6 font-medium text-white ${fraunces.className}`}>User Dashboard</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.firstName} {user.lastName}</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Phone number</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phoneNumber}</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total investment amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">₦{user.totalInvestmentAmount.toLocaleString()}</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Number of packages invested</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.numberOfPackagesInvested}</dd>
            </div>
            <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Referral code</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.referralCode}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
