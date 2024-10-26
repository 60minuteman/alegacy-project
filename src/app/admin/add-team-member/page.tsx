'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { fraunces, dmSans } from '@/app/fonts';

const teamCategories = [
  'Administrative Heads',
  'Legal Team',
  'Media and Publicity Team',
  'Financial Advisors Team',
  'Event management/planning Team',
  'Tech Team',
  'Education Team',
  'Medical Team',
  'Hospitality Team',
  'Creative Team',
  'Construction Team',
  'Marketing Team'
];

export default function AddTeamMember() {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(teamCategories[0]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!imageFile) {
      setError('Please select an image.');
      setIsLoading(false);
      return;
    }

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from('team-member-images')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        console.error('Storage error:', storageError);
        throw storageError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('team-member-images')
        .getPublicUrl(fileName);

      const { data, error: insertError } = await supabase
        .from('team_members')
        .insert({ name, image_url: publicUrl, position, description, category })
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error adding team member:', error);
      setError(error.message || 'An error occurred while adding the team member.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 bg-white">
      <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-center text-[#0F3D3E] ${fraunces.className}`}>Add Team Member</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-6">
          <label htmlFor="name" className={`block mb-2 text-lg text-gray-700 ${dmSans.className}`}>Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="category" className={`block mb-2 text-lg text-gray-700 ${dmSans.className}`}>Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
          >
            {teamCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="imageFile" className={`block mb-2 text-lg text-gray-700 ${dmSans.className}`}>Image</label>
          <input
            type="file"
            id="imageFile"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="position" className={`block mb-2 text-lg text-gray-700 ${dmSans.className}`}>Position</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="description" className={`block mb-2 text-lg text-gray-700 ${dmSans.className}`}>Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F3D3E] h-32"
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="w-full bg-[#0F3D3E] text-white px-6 py-3 rounded-[40px] hover:bg-[#0A2A2B] transition duration-300 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : null}
          {isLoading ? 'Adding...' : 'Add Team Member'}
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </form>
    </div>
  );
}
