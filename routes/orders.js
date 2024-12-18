const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const updateGoogleSheet = require('../utils/googleSheets');
const sendEmailWithSheetLink = require('../utils/sendEmail');

const router = express.Router();
// Define valid statuses and normalization utility
const validStatuses = ['Pending', 'In Production', 'Completed'];

const normalizeStatus = (status) => {
  // Normalize status by matching to valid options (case-insensitive) or defaulting to 'Pending'
  return (
    validStatuses.find(
      (s) => s.toLowerCase() === (status || '').toLowerCase()
    ) || 'Pending'
  );
};

// 1. Route to Create a New Order
// Endpoint: POST /api/orders
// Description: Adds a new order to the database.
router.post('/', async (req, res) => {
  const { clientName, productName, quantity, orderDate, status, customerId } =
    req.body;

  if (!clientName || !productName || !quantity || !customerId) {
    return res.status(400).json({
      message:
        'Client name, product name, quantity, and customerId are required.'
    });
  }

  try {
    const customerExists = await Customer.findById(customerId);
    if (!customerExists) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    const order = new Order({
      clientName,
      productName,
      quantity,
      orderDate: orderDate ? new Date(orderDate) : new Date(),
      status: normalizeStatus(status),
      customerId
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error });
  }
});

// 2. Route to Generate the Weekly Google Sheet and Send Email
// Endpoint: GET /api/orders/generate-sheet
// Description: Retrieves all orders from the database, appends them to the Google Sheet, and emails the sheet link.
router.get('/generate-sheet', async (req, res) => {
  try {
    console.log('Fetching orders from the database...');
    const orders = await Order.find(); // Fetch all orders
    console.log('Orders fetched:', orders);

    console.log('Updating Google Sheet...');
    await updateGoogleSheet(orders); // Update Google Sheet with orders
    console.log('Google Sheet updated successfully');

    console.log('Sending email...');
    await sendEmailWithSheetLink('umar@mirocoffee.co'); // Send email with sheet link
    console.log('Email sent successfully');

    res.send('Google Sheet updated and email sent');
  } catch (error) {
    console.error('Error in /generate-sheet:', error);
    res
      .status(500)
      .json({ message: 'Failed to update Google Sheet or send email', error });
  }
});

// 3. Route to retrieve all orders, optionally filtered by status
// Endpoint: GET /api/orders
// Description: Retrieves all orders from database, optionally they can be filtered by status
// Unified Route: GET /api/orders?status=...&customerId=...
router.get('/', async (req, res) => {
  const { status, customerId } = req.query; // Extract status and customerId from query
  // console.log('Received query parameters:', req.query);

  try {
    let filter = {}; // Start with an empty filter object

    // Add customerId to the filter if provided
    if (customerId) {
      filter.customerId = new mongoose.Types.ObjectId(customerId);
    }

    // Add status to the filter if provided
    if (status) {
      filter.status = status;
    }

    // console.log('Applying filter:', filter); // Log the filter being applied

    // Query the database with the filter
    const orders = await Order.find(filter);
    res.json(orders); // Return the filtered orders
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

// 4. Route to update status of a specific order.
// Endpoint: PUT /api/orders/:id/status
// Description: Updates the status of a specific order, useful for managing the order lifecycle
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const normalizedStatus = normalizeStatus(status);

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { status: normalizedStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error });
  }
});

// 5. Route to delete a specific order
// Endpoint: DELETE /api/orders/:id
// Description: This route allows users to delete an order by its ID

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully', order });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order', error });
  }
});

// Analytics Endpoimt
// Most Ordered Product Analytics
router.get('/analytics/most-ordered-product', async (req, res) => {
  try {
    const mostOrdered = await Order.aggregate([
      { $group: { _id: '$productName', count: { $sum: '$quantity' } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    res.json(mostOrdered[0] || { productName: 'No Data', count: 0 });
  } catch (error) {
    console.error('Error fetching most ordered product:', error);
    res.status(500).json({ message: 'Failed to fetch most ordered product' });
  }
});

router.get('/test', (req, res) => {
  console.log('GET /api/orders/test endpoint hit');
  res.status(200).json({ message: 'Test endpoint reached' });
});

module.exports = router;
