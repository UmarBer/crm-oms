import { useState, useEffect } from 'react';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = filter ? `?status=${filter}` : '';
      const response = await fetch(`${API_BASE_URL}/api/orders${query}`);
      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.statusText}`);
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update the status of an order
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error(`Error updating order status: ${response.statusText}`);
      }
      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  // Delete an order
  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return; // Exit if the user cancels
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Error deleting order: ${response.statusText}`);
      }
      // Remove the deleted order from the UI
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Order List</h2>

      <div className="mb-4 flex justify-between items-center">
        <select
          className="border p-2 rounded"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="In Production">In Production</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Loading and Error States */}
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Responsive Table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Client Name</th>
                <th className="border px-4 py-2">Product</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Order Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              )}

              {orders.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="text-gray-500 text-center py-4">
                    No orders available. Add some using the `Add New Order`
                    form!
                  </td>
                </tr>
              )}

              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{order.clientName}</td>
                  <td className="border px-4 py-2">{order.productName}</td>
                  <td className="border px-4 py-2">{order.quantity}</td>
                  <td className="border px-4 py-2">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{order.status}</td>
                  <td className="border px-4 py-2 flex justify-around">
                    <select
                      className="border px-2 py-1 rounded"
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Production">In Production</option>
                      <option value="Completed">Completed</option>
                    </select>

                    <button
                      className="px-2  py-1 bg-red-500 text-white rounded"
                      onClick={() => handleDeleteOrder(order._id)}
                    >
                      Delete order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderList;
