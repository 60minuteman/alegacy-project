'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RetroGrid from '../../components/RetroGrid';
import OtpInput from '../../components/OtpInput';
import toast from 'react-hot-toast';
import { dmSans, fraunces } from '../fonts';

export default function UserLoginPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timer, setTimer] = useState(25);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtpInput && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOtpInput, timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendOtp();
  };

  const sendOtp = async () => {
    setIsLoading(true);
    setCanResend(false);
    setTimer(25);

    try {
      const response = await fetch('/api/auth/login-or-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        setShowOtpInput(true);
      } else {
        throw new Error(data.error || 'An error occurred');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpComplete = async (otp: string) => {
    try {
      // For now, we're using a default OTP of 123456
      if (otp === '123456') {
        toast.success('OTP verified successfully');
        router.push('/user-dashboard');
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleResendOtp = async () => {
    if (canResend) {
      await sendOtp();
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <RetroGrid />
      </div>
      <div className={`w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 relative z-10 ${dmSans.className}`}>
        <h1 className={`text-3xl font-bold mb-2 text-center text-[#0c1618] ${fraunces.className}`}>
          {showOtpInput ? 'Enter OTP' : 'Log In or Sign Up'}
        </h1>
        {showOtpInput && (
          <>
            <p className="text-sm text-center text-gray-600 mb-6">
              Enter 6-digit code sent to <span className="font-bold">{email}</span>
            </p>
            <OtpInput onComplete={handleOtpComplete} />
            <div className="mt-4 text-center">
              {timer > 0 ? (
                <p className="text-sm text-gray-500">Resend OTP in {timer} seconds</p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  className="text-sm font-bold text-primary hover:text-primary-dark"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </>
        )}
        {!showOtpInput && (
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
              {isLoading ? 'Processing...' : 'Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
