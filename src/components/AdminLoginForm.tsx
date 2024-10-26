'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { dmSans, fraunces } from '../app/fonts';
import Button from './Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if the user is an admin
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', email)
          .single();

        if (adminError || !adminData) {
          throw new Error('Not authorized as admin');
        }

        toast.success('Login successful!');
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-md bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 relative z-10 ${dmSans.className}`}>
      <h1 className={`text-3xl font-bold mb-6 text-center text-[#0c1618] ${fraunces.className}`}>
        Admin Login
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
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#0c1618] mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent text-[#001e1d] bg-[#f8f8f8] placeholder-gray-400"
            placeholder="Enter your password"
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