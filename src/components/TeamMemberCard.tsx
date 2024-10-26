import React from 'react';
import Image from 'next/image';
import { TeamMember } from '@/types/TeamMember';
import { fraunces, dmSans } from '@/app/fonts';

type TeamMemberCardProps = {
  member: TeamMember;
};

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const bgColors = [
    'bg-[#004643]', 'bg-[#004643]', 'bg-[#004643]', 'bg-[#FFE5E5]',
    'bg-[#F0F0F0]', 'bg-[#E6F3FF]', 'bg-[#F0F0F0]', 'bg-[#E6FFE5]'
  ];

  const bgColor = bgColors[member.id % bgColors.length];

  return (
    <div className="w-full h-64 sm:h-80 relative overflow-hidden bg-white border-2 border-gray-100 rounded-lg mx-auto">
      <div className={`w-full h-full ${bgColor}`}>
        <Image
          src={member.image_url}
          alt={member.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 sm:p-4">
        <h2 className={`text-lg sm:text-xl font-bold mb-1 truncate ${fraunces.className}`}>{member.name}</h2>
        <p className={`text-sm sm:text-base text-gray-600 truncate ${dmSans.className}`}>{member.position}</p>
      </div>
    </div>
  );
}
