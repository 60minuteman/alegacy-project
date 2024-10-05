"use client";

import { useState } from 'react';
import PaymentModal from '@/components/PaymentModal';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Spinner from '@/components/Spinner';

interface PaymentDetails {
  accountNumber: string;
  accountName: string;
  bank: string;
  amount: string;
}

interface PaymentDetailsProps {
  initialPaymentDetails: PaymentDetails;
}

export default function PaymentDetails({ initialPaymentDetails }: PaymentDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const verifyPayment = async () => {
    setIsVerifying(true);
    setVerificationMessage('');
    try {
      const response = await axios.post('/api/verify-payment', {
        account_number: initialPaymentDetails.accountNumber,
        amount: initialPaymentDetails.amount
      });
      
      if (response.data.success) {
        setIsSuccess(true);
        toast.success('Payment verified successfully!');
      } else {
        toast.error(response.data.message || 'Payment verification failed. Please try again.');
        setVerificationMessage(response.data.message || 'Payment verification failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      toast.error('An error occurred while verifying payment.');
      setVerificationMessage('An error occurred while verifying payment. Please try again later.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accountDetails={initialPaymentDetails}
      />
      {!isSuccess ? (
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Show Payment Details
          </button>
          <button
            onClick={verifyPayment}
            disabled={isVerifying}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isVerifying ? (
              <>
                <Spinner className="w-5 h-5 mr-2 inline" />
                Verifying...
              </>
            ) : (
              'Verify Payment'
            )}
          </button>
          {verificationMessage && (
            <div className="mt-4 text-red-500">
              {verificationMessage}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Payment Successful!</strong>
          <p className="block sm:inline">Your payment has been verified.</p>
          <p className="mt-2"><strong>Account Number:</strong> {initialPaymentDetails.accountNumber}</p>
          <p><strong>Account Name:</strong> {initialPaymentDetails.accountName}</p>
          <p><strong>Bank:</strong> {initialPaymentDetails.bank}</p>
          <p><strong>Amount:</strong> {initialPaymentDetails.amount}</p>
        </div>
      )}
    </div>
  );
}