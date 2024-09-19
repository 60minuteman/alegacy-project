import React, { useState, useRef, useEffect } from 'react';
import Spinner from './Spinner';

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  isVerifying: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onComplete, isVerifying }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(newOtp);

    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      if (inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = () => {
    if (otp.every(val => val !== '')) {
      onComplete(otp.join(''));
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex justify-center space-x-2">
        {otp.map((_, index) => (
          <input
            key={index}
            type="text"
            ref={el => inputRefs.current[index] = el}
            maxLength={1}
            value={otp[index]}
            onChange={e => handleChange(e.target, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-md focus:border-primary focus:outline-none bg-white text-gray-800 font-semibold focus:ring-2 focus:ring-primary focus:ring-opacity-50"
          />
        ))}
      </div>
      <button
        className={`w-full px-6 py-3 rounded-full font-semibold transition duration-300 flex items-center justify-center ${
          otp.every(val => val !== '') && !isVerifying
            ? 'bg-primary text-white hover:bg-opacity-90'
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
        }`}
        disabled={!otp.every(val => val !== '') || isVerifying}
        onClick={handleVerify}
      >
        {isVerifying ? <Spinner /> : 'Verify OTP'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default OTPInput;
