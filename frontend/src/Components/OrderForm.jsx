import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function OrderForm() {
  const [formData, setFormData] = useState({
    clientName: '',
    productName: '',
    quantity: '',
    orderDate: '',
    customerId: '' // Add customerId to the form data
  });
  const [customers, setCustomers] = useState([]); // State to store customer options

  // Fetch customers for the dropdown
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/customers`);
        const data = await response.json();
        setCustomers(data); // Populate the dropdown options
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      alert('Order submitted successfully!');
      setFormData({
        clientName: '',
        productName: '',
        quantity: '',
        orderDate: '',
        customerId: '' // Reset the form
      });
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Order</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Name */}
        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={formData.clientName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Product Name */}
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Quantity */}
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Order Date */}
        <input
          type="date"
          name="orderDate"
          value={formData.orderDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Customer Dropdown */}
        <select
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="" disabled>
            Select a Customer
          </option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.name}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
}

export default OrderForm;
