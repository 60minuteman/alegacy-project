import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

interface GenerateAccountData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  amount: number;
}

const PAYSCRIBE_SECRET_KEY = process.env.PAYSCRIBE_SECRET_KEY;
const PAYSCRIBE_PUBLIC_KEY = process.env.PAYSCRIBE_PUBLIC_KEY;
const PAYSCRIBE_BASE_URL = process.env.PAYSCRIBE_BASE_URL;

if (!PAYSCRIBE_SECRET_KEY || !PAYSCRIBE_PUBLIC_KEY || !PAYSCRIBE_BASE_URL) {
  throw new Error('Payscribe configuration is missing');
}

const payscribeApi = axios.create({
  baseURL: PAYSCRIBE_BASE_URL,
  headers: {
    'Authorization': `Bearer ${PAYSCRIBE_PUBLIC_KEY}`,
    'Content-Type': 'application/json',
  },
});

export async function generateAccount(data: GenerateAccountData) {
  console.log('generateAccount called with:', JSON.stringify(data, null, 2));
  
  const payload = {
    account_type: "dynamic",
    ref: uuidv4(),
    currency: "NGN",
    order: {
      amount: data.amount,
      amount_type: "EXACT",
      description: `Legacy Investment for ${data.firstName} ${data.lastName} #${uuidv4()}`,
      expiry: {
        duration: 1,
        duration_type: "hours"
      }
    },
    customer: {
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone
    }
  };

  console.log('Payload being sent to Payscribe:', JSON.stringify(payload, null, 2));
  console.log('Payscribe API URL:', `${process.env.PAYSCRIBE_BASE_URL}/collections/virtual-accounts/create`);
  console.log('Payscribe Public Key:', process.env.PAYSCRIBE_PUBLIC_KEY);

  try {
    const response = await axios.post(`${process.env.PAYSCRIBE_BASE_URL}/collections/virtual-accounts/create`, payload, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSCRIBE_PUBLIC_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Payscribe API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Error generating account:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', JSON.stringify(error.response?.data, null, 2));
      console.error('Axios error status:', error.response?.status);
      console.error('Axios error headers:', JSON.stringify(error.response?.headers, null, 2));
    }
    throw error;
  }
};

export const verifyPayment = async (
  transId: string,
  sessionId: string,
  amount: number,
  accountNumber: string
) => {
  try {
    console.log('Verifying payment with Payscribe:', { transId, sessionId, amount, accountNumber });
    const response = await payscribeApi.post('/collections/virtual-accounts/confirm-payment', {
      trans_id: transId,
      session_id: sessionId,
      amount: amount,
      account_number: accountNumber
    });
    console.log('Payscribe verification response:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Payscribe error response:', error.response.data);
      return error.response.data;
    } else if (error.request) {
      console.error('Payscribe error request:', error.request);
      throw new Error('No response received from the server');
    } else {
      console.error('Payscribe error message:', error.message);
      throw error;
    }
  }
};