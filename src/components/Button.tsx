import React from 'react';
import { DM_Sans } from 'next/font/google';
import Spinner from './Spinner';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['500'] });

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  children,
  type = 'button'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      type={type}
      className={`
        ${dmSans.className}
        w-full h-[54px] px-6 rounded-[60px] font-medium text-[16px]
        transition duration-300 flex items-center justify-center
        ${isLoading || disabled
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
          : 'bg-[#004643] text-[#FFFFFF] hover:bg-opacity-90 active:bg-[#003d3a]'
        }
      `}
    >
      {isLoading ? <Spinner className="w-6 h-6" /> : children}
    </button>
  );
};

export default Button;