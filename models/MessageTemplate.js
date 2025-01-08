const mongoose = require('mongoose');

const messageTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    body: { type: String, required: true },
    name: { type: String, default: [] }, // Optional: Use tags for filtering templates
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('MessageTemplate', messageTemplateSchema);
