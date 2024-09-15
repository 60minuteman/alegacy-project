import React from 'react';
import { fraunces, dmSans } from '../app/fonts';

interface PaymentInfo {
  amount: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

interface PaymentModalProps {
  paymentInfo: PaymentInfo;
  onClose: () => void;
}

export default function PaymentModal({ paymentInfo, onClose }: PaymentModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white p-8 rounded-xl shadow-lg max-w-md w-full ${dmSans?.className || ''}`}>
        <h2 className={`text-2xl font-bold mb-6 text-primary ${fraunces?.className || ''}`}>Payment Details</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Amount</p>
            <p className="font-semibold">NGN {parseFloat(paymentInfo.amount).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Bank Name</p>
            <p className="font-semibold">{paymentInfo.bankName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Account Name</p>
            <p className="font-semibold">{paymentInfo.accountName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Account Number</p>
            <p className="font-semibold">{paymentInfo.accountNumber}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-opacity-90 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
}