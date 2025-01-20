/* eslint-disable no-unused-vars */
import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Replace with your actual API base URL

function GenerateSheetForm() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerateSheet = async () => {
    if (!email) {
      alert('Please provide a recipient email');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const queryParams = new URLSearchParams({
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        email
      });

      const response = await fetch(
        `${API_BASE_URL}/api/orders/generate-sheet?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error('Failed to generate sheet');
      }

      const data = await response.json();
      console.log('Sheet generated:', data);
      setMessage('Google sheet generated and email sent successfully');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
    console.log(message);
  };
  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Generate Weekly Production Sheet
      </h2>

      <div className="mb-4">
        <label className="block font-semibold">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Recipient Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        onClick={handleGenerateSheet}
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate and Send Sheet'}
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}

export default GenerateSheetForm;
