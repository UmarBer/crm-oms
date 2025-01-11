import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function BatchMessaging() {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  // Fetch tags and templates from the backend
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [tagsRes, templatesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/customers/analytics/tags`),
          fetch(`${API_BASE_URL}/api/templates`)
        ]);
        const tagsData = await tagsRes.json();
        const templatesData = await templatesRes.json();
        setTags(tagsData.map((tag) => tag._id)); // Extract tag names
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    fetchMetadata();
  }, []);

  // Handle filtering customers based on selected tags
  const handleFilter = async () => {
    if (selectedTags.length === 0) {
      alert('Please select at least one tag');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/customers?tags=${selectedTags.join(',')}`
      );
      if (!response.ok) {
        throw new Error('Error fetching filtered customers');
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sending batch messages
  const handleSendMessages = async () => {
    if (selectedTemplate === '' || customers.length === 0) {
      alert('Please select a template and filter customers first');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/messages/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tags: selectedTags,
          messageTemplate: selectedTemplate
        })
      });

      if (!response.ok) {
        throw new Error('Error sending batch messages');
      }

      const data = await response.json();
      alert(`Messages sent: ${data.results.length}`);
    } catch (error) {
      console.error('Error sending batch messages:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Batch Messaging</h2>

      {/* Select Tags */}
      <div className="mb-4">
        <h3 className="font-bold">Filter Customers by Tags:</h3>
        <select
          multiple
          value={selectedTags}
          onChange={(e) =>
            setSelectedTags(
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          className="w-full border p-2"
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <button
          onClick={handleFilter}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Filter Customers
        </button>
      </div>

      {/* Customers List */}
      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <div>
          <h3 className="font-bold">Selected Customers:</h3>
          <ul>
            {customers.map((customer) => (
              <li key={customer._id}>
                {customer.name} ({customer.phone})
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Select Template */}
      <div className="mt-4">
        <h3 className="font-bold">Select Template:</h3>
        <select
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="w-full border p-2"
        >
          <option value="">Select Template</option>
          {templates.map((template) => (
            <option key={template._id} value={template.metaTemplateName}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {/* Send Messages */}
      <button
        onClick={handleSendMessages}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Send Messages
      </button>
    </div>
  );
}

export default BatchMessaging;
