import React from 'react';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import TeamMemberCard from '@/components/TeamMemberCard';
import { TeamMember } from '@/types/TeamMember';
import { fraunces, dmSans } from '@/app/fonts';
import Image from 'next/image';

export default async function TeamsPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: teamMembers, error } = await supabase
    .from('team_members')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching team members:', error);
    return <div>Error loading team members</div>;
  }

  const emptyContainers = Array(12).fill(null);

  // Function to get public URL
  const getPublicUrl = (filePath: string) => {
    if (!filePath) return '/placeholder-image.jpg';
    try {
      const { data, error } = supabase.storage
        .from('team-member-images')
        .getPublicUrl(filePath);
      
      if (error) {
        console.error('Error getting public URL:', error);
        return '/placeholder-image.jpg';
      }
      
      console.log('Public URL for', filePath, ':', data.publicUrl);
      return data.publicUrl;
    } catch (err) {
      console.error('Unexpected error in getPublicUrl:', err);
      return '/placeholder-image.jpg';
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className={`text-4xl md:text-5xl font-bold mb-16 text-center text-[#0F3D3E] ${fraunces.className}`}>
        The right skills, the right people.
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {teamMembers && teamMembers.length > 0 ? (
          teamMembers.map((member: TeamMember) => (
            <TeamMemberCard key={member.id} member={member}>
              <Image
                src={getPublicUrl(member.image_url)}
                alt={`${member.name}'s profile`}
                width={200}
                height={200}
                className="rounded-full"
                loading="lazy"
                onError={(e) => {
                  console.error(`Error loading image for ${member.name}:`, e);
                  console.error('Image URL:', getPublicUrl(member.image_url));
                  e.currentTarget.src = '/placeholder-image.jpg';
                }}
              />
            </TeamMemberCard>
          ))
        ) : (
          emptyContainers.map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-400">Empty</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
