import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface PaymentModalProps {
  accountNumber: string
  totalAmount: number
  sessionId: string
  onClose: () => void
  onPaymentConfirmed: () => void
}

export default function PaymentModal({ accountNumber, totalAmount, sessionId, onClose, onPaymentConfirmed }: PaymentModalProps) {
  const [isChecking, setIsChecking] = useState(false)

  const handlePaymentCheck = async () => {
    setIsChecking(true)
    try {
      const response = await axios.post('/api/check-payment', { sessionId, expectedAmount: totalAmount })
      if (response.data.success) {
        toast.success('Payment confirmed successfully!')
        onPaymentConfirmed()
      } else {
        toast.error('Payment not found or incorrect amount. Please try again.')
      }
    } catch (error) {
      console.error('Error checking payment:', error)
      toast.error('Failed to check payment. Please try again.')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Payment Instructions</h2>
        <p className="mb-4">Please pay the correct amount into the account below to validate your investment.</p>
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p><strong>Account Number:</strong> {accountNumber}</p>
          <p><strong>Amount to Pay:</strong> NGN {totalAmount.toLocaleString()}</p>
        </div>
        <button 
          onClick={handlePaymentCheck}
          disabled={isChecking}
          className="w-full bg-[#504CFF] text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed mb-2"
        >
          {isChecking ? 'Checking Payment...' : 'I Have Made Payment'}
        </button>
        <button 
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  )
}
