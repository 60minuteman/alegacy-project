'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fraunces, dmSans } from '@/app/fonts';

interface DashboardStats {
  totalInvestors: number;
  totalInvestmentAmount: number;
  totalTeamMembers: number;
}

export default function PreparingDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInvestors: 0,
    totalInvestmentAmount: 0,
    totalTeamMembers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase.rpc('get_admin_stats');
        if (error) throw error;
        setStats(data[0] || {
          totalInvestors: 0,
          totalInvestmentAmount: 0,
          totalTeamMembers: 0
        });
      } catch (err) {
        setError('Failed to fetch dashboard stats');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [supabase]);

  if (isLoading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className={`text-4xl font-bold mb-12 text-center ${fraunces.className}`}>
        Preparing Your Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard
          title="Total Investors"
          value={stats.totalInvestors}
          icon="👥"
        />
        <StatCard
          title="Total Investment"
          value={`$${stats.totalInvestmentAmount.toLocaleString()}`}
          icon="💰"
        />
        <StatCard
          title="Team Members"
          value={stats.totalTeamMembers}
          icon="🤝"
        />
      </div>
      <p className={`text-center mt-12 text-lg ${dmSans.className}`}>
        We're setting up your personalized dashboard. This may take a few moments.
      </p>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className={`text-xl font-semibold mb-2 ${fraunces.className}`}>{title}</h3>
      <p className={`text-3xl font-bold ${dmSans.className}`}>{value}</p>
    </div>
  );
}
