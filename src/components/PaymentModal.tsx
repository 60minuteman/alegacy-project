import React from 'react';

interface PaymentDetails {
  accountNumber: string;
  accountName: string;
  bank: string;
  amount: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountDetails: PaymentDetails;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, accountDetails }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Payment Details</h2>
        <p>Account Number: {accountDetails.accountNumber}</p>
        <p>Account Name: {accountDetails.accountName}</p>
        <p>Bank: {accountDetails.bank}</p>
        <p>Amount: {accountDetails.amount}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;