'use client';

import React from 'react';
import AdminLoginForm from '@/components/AdminLoginForm';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}