'use client';

import React, { useEffect, useState, useRef } from 'react';
import TeamMemberCard from '@/components/TeamMemberCard';
import { TeamMember } from '@/types/TeamMember';
import { fraunces, dmSans } from '@/app/fonts';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      const supabase = createClientComponentClient();

      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching team members:', error);
        setError('Error loading team members');
      } else {
        setTeamMembers(data || []);
      }
    };

    fetchTeamMembers();
  }, []);

  const getPublicUrl = (filePath: string) => {
    if (!filePath) return '/placeholder-image.jpg';
    try {
      const supabase = createClientComponentClient();
      const { data } = supabase.storage
        .from('team-member-images')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (err) {
      console.error('Unexpected error in getPublicUrl:', err);
      return '/placeholder-image.jpg';
    }
  };

  const filteredTeamMembers = selectedCategory === 'All' 
    ? teamMembers 
    : teamMembers.filter(member => member.category === selectedCategory);

  return (
    <section className="bg-white py-8 sm:py-16 w-full">
      <div className="container mx-auto px-4">
        <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-8 text-center text-[#0F3D3E] ${fraunces.className}`}>
          Our Team
        </h1>
        <p className="text-center text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
          At Legacy Project, our team is a group of passionate professionals driven by a shared commitment to excellence, innovation, and impact. We are led by experienced experts in real estate, finance, technology, and development who work closely together to ensure that each project is executed with the highest level of precision and transparency.
        </p>
        <div className="overflow-x-auto pb-4 mb-6 sm:mb-8">
          <div className="flex space-x-2 min-w-max">
            <button
              className={`flex-shrink-0 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-[40px] ${
                selectedCategory === 'All' ? 'bg-[#0F3D3E] text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setSelectedCategory('All')}
            >
              All
            </button>
            {teamCategories.map((category) => (
              <button
                key={category}
                className={`flex-shrink-0 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base rounded-[40px] ${
                  selectedCategory === category ? 'bg-[#0F3D3E] text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredTeamMembers.length > 0 ? (
            filteredTeamMembers.map((member: TeamMember) => (
              <TeamMemberCard key={member.id} member={member}>
                <div className="w-full pb-[100%] relative">
                  <Image
                    src={getPublicUrl(member.image_url)}
                    alt={`${member.name}'s profile`}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 w-full h-full object-cover border-2 border-gray-900 shadow-lg"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.jpg';
                    }}
                  />
                </div>
                <div className="text-center mt-2 sm:mt-4">
                  <h3 className="font-semibold text-sm sm:text-base">{member.name}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">{member.position}</p>
                </div>
              </TeamMemberCard>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              {error || (selectedCategory === 'All' ? 'No team members available.' : `This category is empty at the moment.`)}
            </div>
          )}
        </div>
        <div className="mt-8 sm:mt-12 text-center">
          <p className={`text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 ${dmSans.className}`}>
            Legacy Project—Powered by a team of visionary professionals and strengthened by the support of strategic partners, we are committed to delivering exceptional value and helping you build a lasting financial legacy. Join us and become part of a select community shaping the future of real estate across Africa.
          </p>
          <button className="bg-[#0F3D3E] text-white px-6 sm:px-8 py-2 sm:py-3 rounded-[40px] text-sm sm:text-base font-semibold hover:bg-[#0D3233] transition duration-300">
            Invest Now
          </button>
        </div>
      </div>
    </section>
  );
}