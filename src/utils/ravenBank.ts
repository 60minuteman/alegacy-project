import axios from 'axios';

const RAVEN_API_BASE_URL = 'https://api.ravenpay.co/v1';
const RAVEN_PUBLIC_KEY = process.env.NEXT_PUBLIC_RAVEN_PUBLIC_KEY;
const RAVEN_SECRET_KEY = process.env.RAVEN_SECRET_KEY;

const ravenAxios = axios.create({
  baseURL: RAVEN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${RAVEN_SECRET_KEY}`,
  },
});

interface VirtualAccountPayload {
  first_name: string;
  last_name: string;
  phone: string;
  amount: string;
  email: string;
}

interface VirtualAccountResponse {
  status: string;
  message: string;
  data: {
    account_number: string;
    account_name: string;
    bank: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
      phone: string;
    };
    isPermanent: boolean;
    amount: string;
  };
}

export async function generateVirtualAccount(payload: VirtualAccountPayload): Promise<VirtualAccountResponse> {
  console.log('Generating virtual account with payload:', payload);

  try {
    const response = await fetch('/api/generate-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error response body:', errorBody);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const data = await response.json();
    console.log('Parsed response:', data);
    return data;
  } catch (error) {
    console.error('Error in generateVirtualAccount:', error);
    throw error;
  }
}

export const getVirtualAccountDetails = async (accountReference: string) => {
  try {
    const response = await ravenAxios.get(`/virtual-accounts/${accountReference}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching virtual account details:', error);
    throw error;
  }
};

// Add more Raven Bank API functions as needed