'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { fraunces, dmSans } from '@/app/fonts';
import { useRouter } from 'next/navigation';

interface Stats {
  totalPatients: number;
  totalRevenue: number;
  totalAppointments: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  totalInvestmentAmount: number;
  numberOfPackagesInvested: number;
}

interface Investment {
  id: string;
  packageName: string;
  investmentAmount: number;
  investmentDate: string;
  userId: string;
}

interface Package {
  id: number;
  name: string;
  price: number;
}

interface TeamMember {
  id: number;
  name: string;
  image_url: string | null;
  position: string | null;
  description: string | null;
  created_at: string;
}

type TabType = 'users' | 'investments' | 'packages' | 'team_members';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    totalPatients: 259,
    totalRevenue: 3259,
    totalAppointments: 423
  });
  const [users, setUsers] = useState<User[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/admin/login');
        return;
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', user.email)
        .single();

      if (adminError || !adminData) {
        router.push('/admin/login');
        return;
      }

      setIsLoading(false);
    };

    checkAdminAuth();
  }, [router, supabase]);

  useEffect(() => {
    async function fetchData() {
      // Fetch users
      const { data: userData, error: userError } = await supabase
        .from('User')
        .select('*');
      if (userError) console.error('Error fetching users:', userError);
      else setUsers(userData);

      // Fetch investments
      const { data: investmentData, error: investmentError } = await supabase
        .from('Investment')
        .select('*');
      if (investmentError) console.error('Error fetching investments:', investmentError);
      else setInvestments(investmentData);

      // Fetch packages
      const { data: packageData, error: packageError } = await supabase
        .from('Package')
        .select('*');
      if (packageError) console.error('Error fetching packages:', packageError);
      else setPackages(packageData);

      // Fetch team members
      const { data: teamMemberData, error: teamMemberError } = await supabase
        .from('team_members')
        .select('*');
      if (teamMemberError) console.error('Error fetching team members:', teamMemberError);
      else setTeamMembers(teamMemberData);
    }

    fetchData();
  }, [supabase]);

  const handleAddTeamMember = () => {
    router.push('/admin/add-team-member');
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-8 bg-background text-foreground">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 sticky top-0 bg-background z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Search here..."
            className="pl-10 pr-4 py-2 rounded-full bg-input text-foreground w-64"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">🔍</span>
        </div>
        <div className="space-x-4">
          <button className="text-muted-foreground" onClick={() => window.location.reload()}>↻</button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">Export</button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg" onClick={handleAddTeamMember}>Add team member</button>
        </div>
      </div>

      {/* Dashboard content */}
      <h1 className={`text-3xl font-bold mb-2 ${fraunces.className}`}>Dashboard</h1>
      <p className="text-muted-foreground mb-6">View essential details about users, investments, and packages.</p>

      <div className="grid grid-cols-3 gap-6 mb-6 bg-[#FAFAFA] p-6 rounded-lg">
        <div className="flex flex-col items-center justify-center p-4 border-r border-gray-300">
          <span className="text-4xl mb-2">👥</span>
          <h3 className={`text-xl font-semibold mb-1 ${fraunces.className}`}>Total Users</h3>
          <p className="text-sm text-gray-600 mb-2">Total number of registered users.</p>
          <p className={`text-3xl font-bold mb-1 ${dmSans.className}`}>9</p>
          <p className="text-sm text-green-600">↑ 5% Up from last month</p>
        </div>
        <div className="flex flex-col items-center justify-center p-4 border-r border-gray-300">
          <span className="text-4xl mb-2">💰</span>
          <h3 className={`text-xl font-semibold mb-1 ${fraunces.className}`}>Total Investment</h3>
          <p className="text-sm text-gray-600 mb-2">Total amount invested by all users.</p>
          <p className={`text-3xl font-bold mb-1 ${dmSans.className}`}>₦1,000</p>
          <p className="text-sm text-green-600">↑ 8% Up from last month</p>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <span className="text-4xl mb-2">📦</span>
          <h3 className={`text-xl font-semibold mb-1 ${fraunces.className}`}>Total Packages</h3>
          <p className="text-sm text-gray-600 mb-2">Total number of investment packages available.</p>
          <p className={`text-3xl font-bold mb-1 ${dmSans.className}`}>0</p>
          <p className="text-sm text-green-600">↑ 2% Up from last month</p>
        </div>
      </div>

      {/* Tabs and Search/Filter Container */}
      <div className="bg-card text-card-foreground rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2 bg-secondary rounded-lg p-1">
            {['users', 'investments', 'packages', 'team_members'].map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 rounded-md transition-colors duration-200 ${
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary-foreground/10'
                }`}
                onClick={() => setActiveTab(tab as TabType)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <select className="px-4 py-2 rounded-lg bg-input text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-primary">
              <option>Filter</option>
              {/* Add filter options based on the active tab */}
            </select>
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="overflow-x-auto bg-[#FAFAFA] rounded-lg border border-gray-100">
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-[#FAFAFA]">
                <tr className="text-left text-sm font-medium text-muted-foreground border-b border-border">
                  {activeTab === 'users' && (
                    <>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Total Investment</th>
                      <th className="py-3 px-4">Packages Invested</th>
                    </>
                  )}
                  {activeTab === 'investments' && (
                    <>
                      <th className="py-3 px-4">Package Name</th>
                      <th className="py-3 px-4">Investment Amount</th>
                      <th className="py-3 px-4">Investment Date</th>
                      <th className="py-3 px-4">User ID</th>
                    </>
                  )}
                  {activeTab === 'packages' && (
                    <>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Price</th>
                    </>
                  )}
                  {activeTab === 'team_members' && (
                    <>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Position</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Added On</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'users' && users.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-white transition-colors duration-200">
                    <td className="py-3 px-4">{`${user.firstName} ${user.lastName}`}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.phoneNumber}</td>
                    <td className="py-3 px-4">₦{user.totalInvestmentAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">{user.numberOfPackagesInvested}</td>
                  </tr>
                ))}
                {activeTab === 'investments' && investments.map((investment) => (
                  <tr key={investment.id} className="border-b border-border hover:bg-white transition-colors duration-200">
                    <td className="py-3 px-4">{investment.packageName}</td>
                    <td className="py-3 px-4">₦{investment.investmentAmount.toLocaleString()}</td>
                    <td className="py-3 px-4">{new Date(investment.investmentDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">{investment.userId}</td>
                  </tr>
                ))}
                {activeTab === 'packages' && packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-border hover:bg-white transition-colors duration-200">
                    <td className="py-3 px-4">{pkg.id}</td>
                    <td className="py-3 px-4">{pkg.name}</td>
                    <td className="py-3 px-4">₦{pkg.price.toLocaleString()}</td>
                  </tr>
                ))}
                {activeTab === 'team_members' && teamMembers.map((member) => (
                  <tr key={member.id} className="border-b border-border hover:bg-white transition-colors duration-200">
                    <td className="py-3 px-4 flex items-center">
                      {member.image_url && (
                        <img src={member.image_url} alt={member.name} className="w-8 h-8 rounded-full mr-2 object-cover" />
                      )}
                      {member.name}
                    </td>
                    <td className="py-3 px-4">{member.position || 'N/A'}</td>
                    <td className="py-3 px-4">{member.description ? `${member.description.substring(0, 50)}...` : 'N/A'}</td>
                    <td className="py-3 px-4">{new Date(member.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
