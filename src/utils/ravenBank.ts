import axios from 'axios';
import fetch from 'node-fetch';
import { AbortController } from 'abort-controller';

const RAVEN_API_BASE_URL = 'https://integrations.getravenbank.com/v1';
const RAVEN_SECRET_KEY = process.env.RAVEN_SECRET_KEY;

const ravenAxios = axios.create({
  baseURL: RAVEN_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${RAVEN_SECRET_KEY}`,
    'accept': 'application/json'
  },
});

interface VirtualAccountPayload {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  amount: string;
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
  console.log('Generating virtual account with payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await ravenAxios.post('/pwbt/generate_account', payload);
    console.log('Exact Raven API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error in generateVirtualAccount:', {
        status: error.response?.status,
        data: JSON.stringify(error.response?.data, null, 2),
        message: error.message,
        config: error.config // Log the request configuration
      });
      throw new Error(`Raven API error: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    } else {
      console.error('Unexpected error in generateVirtualAccount:', error);
      throw new Error('Unexpected error occurred while generating virtual account');
    }
  }
}

export async function verifyPaymentWithRaven(account_number: string, amount: string) {
  const baseUrl = 'https://integrations.getravenbank.com/v1/collections';
  const url = `${baseUrl}?account_number=${encodeURIComponent(account_number)}`;
  const secretKey = process.env.RAVEN_SECRET_KEY;

  if (!secretKey) {
    throw new Error('RAVEN_SECRET_KEY is not set in environment variables');
  }

  try {
    console.log('Attempting to fetch collections from Raven API...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secretKey}`,
      },
    });

    const responseText = await response.text();
    console.log('Raven API response body:', responseText);

    if (!response.ok) {
      console.error('Raven API error:', responseText);
      throw new Error(`Failed to retrieve collections from Raven: ${response.status} ${response.statusText}`);
    }

    const data = JSON.parse(responseText);
    console.log('Parsed Raven API response:', JSON.stringify(data, null, 2));

    if (data.status !== 'success' || !data.data || !Array.isArray(data.data)) {
      console.error('Unexpected response structure from Raven API');
      throw new Error('Unexpected response structure from Raven API');
    }

    const matchingCollection = data.data.find(
      (collection: any) => collection.amount.toString() === amount
    );

    if (matchingCollection) {
      return {
        verified: true,
        transaction: matchingCollection,
      };
    } else {
      return {
        verified: false,
        message: 'No matching collection found',
      };
    }
  } catch (error) {
    console.error('Error in verifyPaymentWithRaven:', error);
    throw error;
  }
}

// ... other functions ...