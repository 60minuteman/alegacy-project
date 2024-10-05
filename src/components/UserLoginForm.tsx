'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { dmSans, fraunces } from '../app/fonts';
import { useAppDispatch } from '@/store/hooks';
import { setUserEmail } from '@/store/store';
import Button from './Button';

export default function UserLoginForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user exists in the database
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful!');
        dispatch(setUserEmail(email));
        console.log('Email stored in Redux:', email);
        router.push('/user-dashboard');
      } else {
        toast.error(data.message || 'User not found');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 relative z-10 ${dmSans.className}`}>
      <h1 className={`text-3xl font-bold mb-6 text-center text-[#0c1618] ${fraunces.className}`}>
        Log In or Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#0c1618] mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-[#001e1d] bg-[#f8f8f8] placeholder-gray-400"
            placeholder="Enter your email"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          isLoading={isLoading}
        >
          Log In
        </Button>
      </form>
    </div>
  );
}
