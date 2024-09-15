import axios from 'axios';

async function createUser() {
  try {
    console.log('Attempting to create user...');
    const response = await axios.post('http://localhost:3000/api/create-user');
    console.log('User created successfully:', response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error creating user:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

createUser().then(() => {
  console.log('Script execution completed.');
  // Keep the process alive for a moment to ensure all console output is displayed
  setTimeout(() => process.exit(0), 1000);
});
