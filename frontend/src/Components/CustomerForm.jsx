import { useState } from 'react';
import PropTypes from 'prop-types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CustomerForm({ onSubmit, initialData = {}, isEditing = false }) {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [address, setAddress] = useState(initialData.address || '');
  const [notes, setNotes] = useState(initialData.notes || '');
  const [tags, setTags] = useState(initialData.tags?.join(', ') || ''); // Convert array to string

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const customerData = {
      name,
      email,
      phone,
      address,
      notes,
      tags: tags.split(',').map((tag) => tag.trim()) // Convert string to array
    };

    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing
      ? `${API_BASE_URL}/api/customers/${initialData._id}`
      : `${API_BASE_URL}/api/customers`;

    const token = localStorage.getItem('token');

    const requestOptions = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}) // Ensure Authorization is included only if token exists
      },
      credentials: 'include', // Ensure cookies & headers are sent
      body: JSON.stringify(customerData)
    };

    console.log('🚀 Sending Request To:', endpoint);
    console.log('📦 Payload:', customerData);
    console.log('🔑 Token:', token);
    console.log('📩 Headers:', requestOptions.headers);

    try {
      const response = await fetch(endpoint, requestOptions);

      console.log('🛠 Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Server Error:', errorData);
        throw new Error('Failed to save customer');
      }

      const result = await response.json();
      console.log('✅ Response Data:', result);
      onSubmit(result); // Callback to refresh customer list
    } catch (error) {
      console.error('❌ Error saving customer:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-6 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Customer' : 'Add New Customer'}
      </h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label className="block text-gray-700">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Phone</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Address</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Tags (comma-separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="e.g., VIP, Wholesale"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Saving...' : isEditing ? 'Update Customer' : 'Add Customer'}
      </button>
    </form>
  );
}

CustomerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isEditing: PropTypes.bool
};

export default CustomerForm;
