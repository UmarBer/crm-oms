const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    orderDate: { type: Date, required: true },
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'In Production', 'Completed']
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
