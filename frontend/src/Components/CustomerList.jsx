import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function CustomerList({ customers, onEdit, onDelete }) {
  // console.log('Received customers:', customers); // Log received data
  return (
    <div className="bg-white p-6  rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Customer List</h2>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto hidden lg:block shadow-">
        <table className="min-w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2 hidden md:table-cell">Email</th>
              <th className="border px-4 py-2 hidden lg:table-cell">Phone</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">
                    <Link
                      to={`/customers/${customer._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{customer.email}</td>
                  <td className="border px-4 py-2">
                    {customer.phone || 'N/A'}
                  </td>
                  <td className="border px-4 py-2 flex flex-wrap gap-2 justify-center">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => onDelete(customer._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-4">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile view for small screens */}
      <div className="block lg:hidden">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div
              key={customer._id}
              className="border border-gray-300 rounded-lg p-4 mb-4"
            >
              <p className="font-semibold">{customer.name}</p>
              <p className="text-sm text-gray-600">{customer.email}</p>
              {customer.phone && (
                <p className="text-sm text-gray-600">Phone: {customer.phone}</p>
              )}
              <div className="flex gap-2 mt-2">
                <button
                  className="px-2 py-1 bg-green-500 text-white rounded"
                  onClick={() => onEdit(customer)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => onDelete(customer._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-4">No customers found.</p>
        )}
      </div>
    </div>
  );
}

CustomerList.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default CustomerList;
