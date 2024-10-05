'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUserEmail } from '@/store/store';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import RetroGrid from '../../components/RetroGrid';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import Spinner from '@/components/Spinner';
import { DM_Sans, Fraunces } from 'next/font/google';
import axios from 'axios';
import Button from '@/components/Button';

const dmSans = DM_Sans({ subsets: ['latin'] });
const fraunces = Fraunces({ subsets: ['latin'] });

const verifyPayment = async (accountNumber: string, amount: string) => {
  try {
    console.log('Verifying payment:', { accountNumber, amount });
    const response = await axios.post('/api/verify-payment', {
      account_number: accountNumber,
      amount: amount
    });
    console.log('Verification response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Verification error:', error.response?.data || error.message);
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export default function PaymentPage() {
  const userEmail = useAppSelector((state) => state.user.email);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accountDetails, setAccountDetails] = useState({
    account_number: '',
    account_name: '',
    bank: '',
    amount: '',
  });
  const [sessionId, setSessionId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    const accountNumber = searchParams.get('account_number');
    const accountName = searchParams.get('account_name');
    const bank = searchParams.get('bank');
    const amount = searchParams.get('amount');
    const sessionIdParam = searchParams.get('sessionId');

    setAccountDetails({
      account_number: accountNumber || '',
      account_name: accountName || '',
      bank: bank || '',
      amount: amount || '',
    });
    setSessionId(sessionIdParam || '');
  }, [searchParams]);

  const handleVerifyPayment = async () => {
    setIsVerifying(true);
    setVerificationMessage('');

    try {
      const response = await verifyPayment(accountDetails.account_number, accountDetails.amount);
      console.log('Verification response:', response);

      if (response.success) {
        if (response.message === 'Payment already verified and user account exists') {
          // Payment already verified, redirect to dashboard
          toast.success('Payment already verified. Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        } else {
          // Normal success case
          setIsSuccess(true);
          toast.success('Payment verified successfully!');
          dispatch(setUserEmail(response.data.user.email));
          setTimeout(() => {
            router.push('/dashboard');
          }, 2000);
        }
      } else {
        setVerificationMessage(response.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during verification:', error);
      setVerificationMessage('An error occurred during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log('Copied to clipboard:', text);
        toast.success('Account number copied!', {
          duration: 2000,
          position: 'bottom-center',
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '14px',
            padding: '8px 12px',
            borderRadius: '20px',
          },
        });
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy. Please try again.', {
          duration: 2000,
          position: 'bottom-center',
        });
      });
  };

  return (
    <div className={`min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 ${dmSans.className} relative overflow-hidden`}>
      <RetroGrid />
      
      <div className="w-full max-w-md bg-[#FAFAFA] rounded-3xl shadow-lg p-8 relative z-10">
        {isSuccess ? (
          <div className="text-center">
            <h2 className={`text-2xl font-bold mb-4 text-green-600 ${fraunces.className}`}>Payment Successful!</h2>
            <p className="mb-4">Your payment has been verified. Redirecting to dashboard...</p>
            <Spinner className="w-8 h-8 mx-auto" />
          </div>
        ) : (
          <>
            <h1 className={`text-3xl font-bold mb-6 text-center text-[#0c1618] ${fraunces.className}`}>Payment Details</h1>
            <div className="space-y-6">
              <div className="bg-[#E6EFEE] p-4 rounded-lg text-center">
                <label className="block text-sm font-medium text-[#0c1618] mb-1">Amount</label>
                <p className={`text-3xl font-black text-primary ${fraunces.className}`}>
                  NGN {isNaN(parseFloat(accountDetails.amount)) ? '0' : parseFloat(accountDetails.amount).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0c1618] mb-1">Bank Name</label>
                <p className="text-lg text-[#001e1d] font-semibold">{accountDetails.bank}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0c1618] mb-1">Account Name</label>
                <p className="text-lg text-[#001e1d] font-semibold">{accountDetails.account_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0c1618] mb-1">Account Number</label>
                <div className="flex items-center">
                  <p className="text-lg text-[#001e1d] font-bold">{accountDetails.account_number}</p>
                  <button 
                    onClick={() => copyToClipboard(accountDetails.account_number)}
                    className="ml-2 text-primary hover:text-primary-dark"
                  >
                    <ClipboardIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            <Button
              onClick={handleVerifyPayment}
              disabled={isVerifying}
              isLoading={isVerifying}
            >
              I have made payment
            </Button>
            {verificationMessage && (
              <div className="mt-4 text-red-500">
                {verificationMessage}
              </div>
            )}
          </>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
}