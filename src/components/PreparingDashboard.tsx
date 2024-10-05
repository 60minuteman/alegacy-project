'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Spinner from '@/components/Spinner';

export default function PreparingDashboard() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/user-dashboard');
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-teal-500 to-blue-500">
      <Spinner className="w-16 h-16 text-white mb-4" />
      <h1 className="text-2xl font-bold text-white mb-2">Preparing Your Dashboard</h1>
      <p className="text-lg text-white">Please wait...</p>
    </div>
  );
}
