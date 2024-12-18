const express = require('express');
const Customer = require('../models/Customer');
const Order = require('../models/Order'); // Ensure this is imported

const router = express.Router();

// Analytics Routes
router.get('/analytics/count', async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    res.json({ total: totalCustomers });
  } catch (error) {
    console.error('Error fetching customer count:', error);
    res.status(500).json({ message: 'Failed to fetch customer count' });
  }
});

router.get('/analytics/tags', async (req, res) => {
  try {
    const tagCounts = await Customer.aggregate([
      { $unwind: '$tags' }, // Flatten the tags array
      { $group: { _id: '$tags', count: { $sum: 1 } } } // Count customers per tag
    ]);
    res.json(tagCounts);
  } catch (error) {
    console.error('Error fetching customer tags:', error);
    res.status(500).json({ message: 'Failed to fetch customer tags' });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  const { search, tags } = req.query;
  try {
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } },
        { tags: { $regex: searchRegex } }
      ];
    }

    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $all: tagArray };
    }

    const customers = await Customer.find(query);
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
});

// Get a specific customer by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Failed to fetch customer' });
  }
});

// Update a customer
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, notes, tags } = req.body;

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        address,
        notes,
        tags: tags || []
      },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Failed to update customer', error });
  }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ message: 'Customer deleted successfully', customer });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Failed to delete customer', error });
  }
});

module.exports = router;
