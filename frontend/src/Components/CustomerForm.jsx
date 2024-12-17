import { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

function CustomerForm({ onSubmit, initialData = {}, isEditing = false }) {
  const [name, setName] = useState(initialData.name || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [address, setAddress] = useState(initialData.address || '');
  const [notes, setNotes] = useState(initialData.notes || '');
  const [tags, setTags] = useState(initialData.tags || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, phone, address, notes, tags });
    // Reset the form fields if not editing
    if (!isEditing) {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setNotes('');
      setTags('');
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
        <label className="block text-gray-700">Tag</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isEditing ? 'Update Customer' : 'Add Customer'}
      </button>
    </form>
  );
}

// Define prop types
CustomerForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isEditing: PropTypes.bool
};

export default CustomerForm;
