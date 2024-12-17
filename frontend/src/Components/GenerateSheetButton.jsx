// src/components/GenerateSheetButton.jsx
// eslint-disable-next-line no-unused-vars
import React from 'react';

function GenerateSheetButton() {
  const handleGenerate = async () => {
    try {
      await fetch('http://localhost:3000/api/orders/generate-sheet');
      alert('Google Sheet generated and email sent!');
    } catch (error) {
      console.error('Error generating sheet:', error);
    }
  };

  return (
    <div className="text-center mt-6">
      <button
        onClick={handleGenerate}
        className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200"
      >
        Generate Weekly Sheet
      </button>
    </div>
  );
}

export default GenerateSheetButton;
