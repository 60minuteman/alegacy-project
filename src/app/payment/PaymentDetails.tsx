"use client";

import { useState } from 'react';
import PaymentModal from '../../components/PaymentModal';

interface PaymentDetails {
  accountNumber: string;
  bankName: string;
  accountName: string;
  amount: string;
  phoneNumber: string;
}

interface PaymentDetailsProps {
  initialPaymentDetails: PaymentDetails;
}

export default function PaymentDetails({ initialPaymentDetails }: PaymentDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Details</h1>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        accountDetails={initialPaymentDetails}
      />
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Show Payment Details
      </button>
    </div>
  );
}