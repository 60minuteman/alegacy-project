import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Adjust this to your backend URL

export const generateAccount = async (userId: string, amount: number) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/generate-payment-account`, {
      userId,
      amount
    });
    return response.data;
  } catch (error) {
    console.error('Error generating account:', error);
    throw error;
  }
};