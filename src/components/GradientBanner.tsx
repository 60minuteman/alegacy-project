import React from 'react';

interface GradientBannerProps {
  text: string;
}

const GradientBanner: React.FC<GradientBannerProps> = ({ text }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-300 to-green-600 text-white py-2 text-center">
      {text}
    </div>
  );
};

export default GradientBanner;
