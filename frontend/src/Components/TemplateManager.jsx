import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function TemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({ name: '', body: '', tags: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/customers`);
        if (!response.ok) {
          throw new Error('Failed to fetch customers');
        }
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/templates`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isEditing
      ? `${API_BASE_URL}/api/templates/${currentTemplateId}`
      : `${API_BASE_URL}/api/templates`;

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((tag) => tag.trim())
        })
      });

      if (!response.ok) throw new Error('Failed to save template');
      fetchTemplates();
      setFormData({ name: '', body: '', tags: '' });
      setIsEditing(false);
      setCurrentTemplateId(null);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?'))
      return;

    try {
      await fetch(`${API_BASE_URL}/api/templates/${id}`, { method: 'DELETE' });
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSendMessage = async (templateId, recipientPhone) => {
    if (!recipientPhone) {
      alert('Please select a contact to send the message');
      return;
    }

    console.log('Templates Array:', templates);

    // Find the template by ID and get the WhatsApp template name
    const selectedTemplate = templates.find(
      (template) => template._id === templateId
    );
    if (!selectedTemplate) {
      alert('Template not found');
      return;
    }

    const templateBody = selectedTemplate.body; // WhatsApp template body
    console.log('Template Body:', templateBody);

    try {
      const response = await axios.post(
        `https://graph.facebook.com/v21.0/${
          import.meta.env.VITE_PHONE_NUMBER_ID
        }/messages`,
        {
          messaging_product: 'whatsapp',
          to: recipientPhone,
          text: { body: templateBody }
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_WHATSAPP_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert('Message sent successfully!');
      } else {
        throw new Error(`Failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Manage WhatsApp Templates</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Template Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="block w-full mb-2 p-2 border"
        />
        <textarea
          placeholder="Template Body"
          value={formData.body}
          onChange={(e) => setFormData({ ...formData, body: e.target.value })}
          className="block w-full mb-2 p-2 border"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="block w-full mb-2 p-2 border"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white">
          {isEditing ? 'Update Template' : 'Add Template'}
        </button>
      </form>

      <ul>
        {templates.map((template) => (
          <li key={template._id} className="mb-2 border p-2 rounded">
            <h3 className="font-bold">{template.name}</h3>
            <p>{template.body}</p>
            <p>
              <strong>Tags:</strong> {template.tags?.join(', ') || 'No tags'}
            </p>
            <br />
            <div>
              <button
                onClick={() => {
                  setFormData({
                    name: template.name,
                    body: template.body,
                    tags: template.tags ? template.tags.join(', ') : ''
                  });
                  setIsEditing(true);
                  setCurrentTemplateId(template._id);
                }}
                className="px-2 py-1 bg-yellow-500 text-white mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(template._id)}
                className="px-2 py-1 bg-red-500 text-white mr-2"
              >
                Delete
              </button>
              <br />
              <br />
              <strong>Send to:</strong>
              <select
                onChange={(e) =>
                  handleSendMessage(template._id, e.target.value)
                }
                className="border p-2 rounded w-40 m-2"
              >
                <option value="">Select Contact</option>
                {customers.map((customer) => (
                  <option key={customer._id} value={customer.phone}>
                    {customer.name} ({customer.phone})
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TemplateManager;
