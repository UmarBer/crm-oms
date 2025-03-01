const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    phone: {
      type: String,
      unique: true
    },
    address: {
      type: String
    },
    notes: {
      type: String
    },

    tags: { type: [String], default: ['Wholesale'] },
    createdAt: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
