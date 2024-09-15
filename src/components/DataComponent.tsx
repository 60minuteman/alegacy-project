'use client';

import { useState, useEffect } from 'react';
import { fetchData } from '../service/api';  // Updated import path

export default function DataComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await fetchData('/some-endpoint'); // Replace with your actual endpoint
        setData(result);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
      }
    }
    loadData();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return <div>{JSON.stringify(data)}</div>;
}
