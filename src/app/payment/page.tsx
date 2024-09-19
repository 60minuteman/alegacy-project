'use client';
import { useAppDispatch } from '@/store/hooks';
import { setUserEmail } from '@/store/store';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import RetroGrid from '../../components/RetroGrid';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import Spinner from '@/components/Spinner';
import { DM_Sans, Fraunces } from 'next/font/google';
import axios from 'axios';
import { useAppSelector } from '@/store/hooks';

const dmSans = DM_Sans({ subsets: ['latin'] });
const fraunces = Fraunces({ subsets: ['latin'] });

const verifyPayment = async (accountNumber: string, router: any) => {
  try {
    const response = await axios.get(`/api/verify-payment?account_number=${accountNumber}`);
    const { success, message } = response.data;

    if (success) {
      console.log('Verification response:', response.data);
      // Redirect to user login page
      router.push('/user-login');
    } else {
      console.error('Payment verification failed:', message);
      // Handle the failure case
      toast.error(message || 'Payment verification failed');
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    // Handle the error case
    toast.error('An unexpected error occurred. Please try again.');
  }
};

export default function PaymentPage() {
  const userEmail = useAppSelector((state) => state.user.email);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [accountDetails, setAccountDetails] = useState({
    account_number: '',
    account_name: '',
    bank: '',
    amount: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const accountNumber = searchParams.get('account_number');
  const accountName = searchParams.get('account_name');
  const bank = searchParams.get('bank');
  const amount = searchParams.get('amount');

  useEffect(() => {
    console.log('Retrieved from searchParams:', { accountNumber, accountName, bank, amount });

    setAccountDetails({
      account_number: accountNumber || '',
      account_name: accountName || '',
      bank: bank || '',
      amount: amount || ''
    });
  }, [searchParams]);

  const handleVerifyPayment = async () => {
    console.log('accountDetails', accountDetails);
    setIsVerifying(true);
    try {
      console.log('Verifying payment with data:', { 
        account_number: accountDetails.account_number, 
        amount: accountDetails.amount
      });
      await verifyPayment(accountDetails.account_number, router);
    } catch (error) {
      console.error('Error verifying payment:', error);
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
        <button
          onClick={handleVerifyPayment}
          disabled={isVerifying}
          className="mt-8 w-full px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-opacity-90 transition duration-300 disabled:opacity-50 flex items-center justify-center"
        >
          {isVerifying ? (
            <>
              <Spinner className="w-5 h-5 mr-2" />
              Verifying...
            </>
          ) : (
            'I have made payment'
          )}
        </button>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
