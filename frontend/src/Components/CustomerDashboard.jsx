import { useState, useEffect } from 'react';
import CustomerList from './CustomerList';
import CustomerForm from './CustomerForm';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function CustomerDashboard() {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchCustomers = async () => {
    try {
      // Combine search term and tags into query parameters
      const queryParams = new URLSearchParams({
        search: searchTerm
      });
      const response = await fetch(
        `${API_BASE_URL}/api/customers?${queryParams}` //search=${encodeURIComponent(search)
      );

      const data = await response.json();
      setCustomers(data);
      console.log('Updated customers state:', data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers(); // Fetch customers initially
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs on component mount

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers(); // Fetch customers whenever the search form is submitted
  };

  const handleAddOrUpdate = async (customer) => {
    const method = editingCustomer ? 'PUT' : 'POST';
    const endpoint = editingCustomer
      ? `${API_BASE_URL}/api/customers/${editingCustomer._id}`
      : `${API_BASE_URL}/api/customers`;

    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });

    if (response.ok) {
      setEditingCustomer(null);
      fetchCustomers();
      setIsFormOpen(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await fetch(`${API_BASE_URL}/api/customers/${id}`, { method: 'DELETE' });
      fetchCustomers();
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto p-6 space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4 flex">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow border p-2 rounded-l"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
        >
          Search
        </button>
      </form>
      {/* Add Customer Button */}
      <button
        onClick={() => setIsFormOpen(!isFormOpen)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        {isFormOpen ? 'Cancel' : 'Add Customer'}
      </button>

      {/* Customer Form */}
      {isFormOpen && (
        <CustomerForm
          onSubmit={handleAddOrUpdate}
          initialData={editingCustomer || {}}
          isEditing={!!editingCustomer}
        />
      )}

      {/* Customer List */}
      <CustomerList
        customers={customers}
        onEdit={setEditingCustomer}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default CustomerDashboard;
