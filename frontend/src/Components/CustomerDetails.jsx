import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerForm from './CustomerForm';
import MessageEditorModal from './MessageEditorModal';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function CustomerDetails() {
  const { id } = useParams(); // Get customer ID from the URL
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchCustomerAndOrders = async () => {
      try {
        // Fetch Customer Details
        const customerResponse = await fetch(
          `${API_BASE_URL}/api/customers/${id}`
        );
        if (!customerResponse.ok) throw new Error('Failed to fetch customer');
        const customerData = await customerResponse.json();
        setCustomer(customerData);

        // Fetch Orders for Customer
        const ordersResponse = await fetch(
          `${API_BASE_URL}/api/orders?customerId=${id}`
        );
        if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);

        // console.log('Fetched orders:', ordersData);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerAndOrders();
  }, [id]);

  const handleUpdate = async (updatedCustomer) => {
    try {
      const normalizedCustomer = {
        ...updatedCustomer,
        tags: Array.isArray(updatedCustomer.tags)
          ? updatedCustomer.tags
          : [updatedCustomer.tags] // Ensure tags is always an array
      };

      // console.log('Normalized customer data:', normalizedCustomer); // Debug log

      const response = await fetch(`${API_BASE_URL}/api/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizedCustomer)
      });

      if (!response.ok) {
        throw new Error('Failed to update customer');
      }

      const updatedData = await response.json();
      // console.log('Backend response:', updatedData); // Debug log
      setCustomer(updatedData); // Update the state with the new customer details
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error('Error updating customer:', error);
      setError(error.message);
    }
  };

  const sendTemplateMessage = async (message) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/messages/send-message`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: customer.phone,
            message: message, // Replace with your template name
            languageCode: 'en_US'
          })
        }
      );

      if (response.ok) {
        alert('Template message sent successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to send message: ${error.message}`);
      }
    } catch (err) {
      console.error('Error sending template message:', err);
      alert('An error occurred while sending the message.');
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500">Loading customer details...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500">
        {error}{' '}
        <button
          onClick={() => navigate('/customers')}
          className="text-blue-500 underline"
        >
          Go back
        </button>
      </p>
    );
  }

  if (!customer) {
    return (
      <p className="text-center text-red-500">
        Customer not found.{' '}
        <button
          onClick={() => navigate('/customers')}
          className="text-blue-500 underline"
        >
          Go back
        </button>
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-gray-50 p-6 rounded-lg shadow-md">
      {isEditing ? (
        <CustomerForm
          onSubmit={handleUpdate}
          initialData={customer}
          isEditing={true}
        />
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-4">Customer Details</h2>
          <p>
            <strong>Name:</strong> {customer.name}
          </p>
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
          <p>
            <strong>Phone:</strong> {customer.phone || 'N/A'}
          </p>
          <p>
            <strong>Address:</strong> {customer.address || 'N/A'}
          </p>
          <p>
            <strong>Notes:</strong> {customer.notes || 'N/A'}
          </p>
          <p>
            <strong>Tags:</strong> {customer.tags || 'N/A'}
          </p>

          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Send WhatsApp Message
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg"
            >
              Edit
            </button>
            <button
              onClick={() => navigate('/customers')}
              className="bg-gray-500 text-white px-4 py-2 mt-4 rounded-lg"
            >
              Back
            </button>

            <MessageEditorModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSend={sendTemplateMessage}
              defaultMessage={`Hello ${customer.name}, thank you for being our customer!`}
            />
          </div>
          <h3 className="text-xl font-semibold mt-6">Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders found for this customer.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full mt-4 border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Product Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Quantity
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Order Date
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">
                        {order.productName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.quantity}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {order.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CustomerDetails;
