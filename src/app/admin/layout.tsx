import React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <nav className="w-16 bg-black flex flex-col items-center py-8 space-y-8 fixed h-screen">
        <div className="w-8 h-8 bg-white rounded-lg"></div>
        <span className="text-white text-2xl">⊞</span>
        <span className="text-white text-2xl">👤</span>
        <span className="text-white text-2xl">🕒</span>
        <span className="text-white text-2xl">💬</span>
        <span className="text-white text-2xl">📄</span>
        <div className="flex-grow"></div>
        <span className="text-white text-2xl">⇥</span>
      </nav>
      <main className="flex-1 ml-16">
        {children}
      </main>
    </div>
  );
}
