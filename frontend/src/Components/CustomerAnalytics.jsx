import { useState, useEffect } from 'react';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function CustomerAnalytics() {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [tagData, setTagData] = useState([]);
  const [mostOrderedProduct, setMostOrderedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // ✅ Get token from localStorage
      const [customersRes, tagsRes, productRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/customers/analytics/count`, {
          method: 'GET',
          credentials: 'include' // 🔥 Ensures cookies (JWT token) are sent with the request
        }),
        fetch(`${API_BASE_URL}/api/customers/analytics/tags`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // ✅ Attach token
          },
          credentials: 'include'
        }),
        fetch(`${API_BASE_URL}/api/orders/analytics/most-ordered-product`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` // ✅ Attach token
          },
          credentials: 'include'
        })
      ]);

      if (!customersRes.ok || !tagsRes.ok || !productRes.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const customersData = await customersRes.json();
      const tagsData = await tagsRes.json();
      const productData = await productRes.json();

      setTotalCustomers(customersData.total);
      setTagData(tagsData);
      setMostOrderedProduct(productData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return <p>Loading analytics...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Customer Analytics</h2>
      <p className="mb-4">
        <strong>Total Customers:</strong> {totalCustomers}
      </p>
      <div className="mb-4">
        <h3 className="font-semibold">Customers by Tags:</h3>
        <ul>
          {tagData.map((tag) => (
            <li key={tag._id}>
              {tag._id}: {tag.count}
            </li>
          ))}
        </ul>
      </div>
      <p>
        <strong>Most Ordered Product:</strong>{' '}
        {mostOrderedProduct
          ? `${mostOrderedProduct._id} (${mostOrderedProduct.count} orders)`
          : 'No data'}
      </p>
    </div>
  );
}

export default CustomerAnalytics;
