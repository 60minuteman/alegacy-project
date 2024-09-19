'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import OtpInput from './OtpInput';
import toast from 'react-hot-toast';
import { dmSans, fraunces } from '../app/fonts';

export default function UserLoginForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send OTP to the user's email
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP sent successfully!');
        setShowOtpInput(true);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpComplete = async (otp: string) => {
    setIsVerifying(true);

    try {
      // Verify the OTP
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP verified successfully!');
        // Redirect to the user dashboard
        router.push('/user-dashboard');
      } else {
        toast.error(data.message || 'Failed to verify OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className={`w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 relative z-10 ${dmSans.className}`}>
      <h1 className={`text-3xl font-bold mb-2 text-center text-[#0c1618] ${fraunces.className}`}>
        {showOtpInput ? 'Enter OTP' : 'Log In or Sign Up'}
      </h1>
      {showOtpInput ? (
        <>
          <p className="text-sm text-center text-gray-600 mb-6">
            Enter 6-digit code sent to <span className="font-bold">{email}</span>
          </p>
          <OtpInput length={6} onComplete={handleOtpComplete} isVerifying={isVerifying} />
        </>
      ) : (
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-opacity-90 transition duration-300 disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? 'Sending OTP...' : 'Continue'}
          </button>
        </form>
      )}
    </div>
  );
}
