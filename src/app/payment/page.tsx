'use client';

import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { fraunces, dmSans } from '../fonts';
import toast from 'react-hot-toast';
import RetroGrid from '../../components/RetroGrid';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import Spinner from '../../components/Spinner';
import CustomToast from '../../components/CustomToast';

export default function PaymentPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const accountNumber = searchParams.account_number as string;
  const accountName = searchParams.account_name as string;
  const bank = searchParams.bank as string;
  const amount = searchParams.amount as string;

  if (!accountNumber || !accountName || !bank || !amount) {
    notFound();
  }

  const handlePaymentMade = async () => {
    setIsVerifying(true);
    try {
      const response = await fetch(`/api/verify-payment?accountNumber=${accountNumber}&amount=${amount}`);
      
      const data = await response.json();
      console.log('Payment verification response:', data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(data)}`);
      }

      if (data.success) {
        showCustomToast('Payment verified successfully!', 'success');
        setIsRedirecting(true);
        setTimeout(() => router.push('/user-login'), 3000);
      } else {
        showCustomToast(data.message || 'Payment verification failed', 'error');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      showCustomToast(`Failed to verify payment: ${error.message}`, 'error');
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

  const showCustomToast = (message: string, type: 'success' | 'error') => {
    toast.custom((t) => (
      <CustomToast t={t} message={message} type={type} />
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const handlePaymentConfirmation = async () => {
    console.log('Payment confirmation started');
    try {
      // ... your payment confirmation logic ...
      console.log('Payment confirmed, about to show success toast');
      toast.success('Payment confirmed successfully!');
    } catch (error) {
      console.error('Error confirming payment:', error);
      console.log('About to show error toast');
      toast.error('Failed to confirm payment. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center p-4 ${dmSans.className} relative overflow-hidden`}>
      <RetroGrid />
      
      <div className="w-full max-w-md bg-[#FAFAFA] rounded-3xl shadow-lg p-8 relative z-10">
        <h1 className={`text-3xl font-bold mb-6 text-center text-[#0c1618] ${fraunces.className}`}>Payment Details</h1>
        <div className="space-y-6">
          <div className="bg-[#E6EFEE] p-4 rounded-lg text-center">
            <label className="block text-sm font-medium text-[#0c1618] mb-1">Amount</label>
            <p className={`text-3xl font-black text-primary ${fraunces.className}`}>NGN {parseFloat(amount).toLocaleString()}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0c1618] mb-1">Bank Name</label>
            <p className="text-lg text-[#001e1d] font-semibold">{bank}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0c1618] mb-1">Account Name</label>
            <p className="text-lg text-[#001e1d] font-semibold">{accountName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0c1618] mb-1">Account Number</label>
            <div className="flex items-center">
              <p className="text-lg text-[#001e1d] font-bold">{accountNumber}</p>
              <button 
                onClick={() => copyToClipboard(accountNumber)}
                className="ml-2 text-primary hover:text-primary-dark"
              >
                <ClipboardIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handlePaymentMade}
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
      {isRedirecting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <Spinner className="w-10 h-10 mb-4" />
            <p className="text-lg font-semibold">Redirecting to login...</p>
          </div>
        </div>
      )}
    </div>
  );
}
