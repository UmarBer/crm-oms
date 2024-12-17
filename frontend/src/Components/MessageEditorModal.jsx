import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const MessageEditorModal = ({ isOpen, onClose, onSend, defaultMessage }) => {
  const [message, setMessage] = useState(defaultMessage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Edit WhatsApp Message</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="5"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(message)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageEditorModal;
