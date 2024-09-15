import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  onComplete: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ onComplete }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(parseInt(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && element.value !== '') {
      handleVerify();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && index > 0 && otp[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setIsVerifying(true);
      await onComplete(otpString);
      setIsVerifying(false);
    }
  };

  return (
    <div>
      <div className="flex justify-center gap-2 mb-4">
        {otp.map((data, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded focus:border-primary focus:ring-2 focus:ring-primary"
          />
        ))}
      </div>
      <button
        onClick={handleVerify}
        disabled={otp.some((digit) => digit === '') || isVerifying}
        className="w-full px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-opacity-90 transition duration-300 disabled:opacity-50 flex items-center justify-center"
      >
        {isVerifying ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Verifying...
          </>
        ) : (
          'Verify OTP'
        )}
      </button>
    </div>
  );
};

export default OTPInput;
