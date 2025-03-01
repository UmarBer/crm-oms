const express = require('express');
const Customer = require('../models/Customer');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

// ✅ Apply authentication middleware to all routes
router.use(authenticateUser);

// ✅ Get total customers for the logged-in user
router.get('/analytics/count', async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments({
      userId: req.user.id
    });
    res.json({ total: totalCustomers });
  } catch (error) {
    console.error('Error fetching customer count:', error);
    res.status(500).json({ message: 'Failed to fetch customer count' });
  }
});

// ✅ Get tag analytics for the logged-in user
router.get('/analytics/tags', async (req, res) => {
  try {
    const tagCounts = await Customer.aggregate([
      { $match: { userId: req.user.id } }, // Only fetch data for the logged-in user
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } }
    ]);
    res.json(tagCounts);
  } catch (error) {
    console.error('Error fetching customer tags:', error);
    res.status(500).json({ message: 'Failed to fetch customer tags' });
  }
});

// ✅ Get all customers for the logged-in user
router.get('/', async (req, res) => {
  const { search, tags } = req.query;
  try {
    let query = { userId: req.user.id }; // Ensure only the logged-in user's customers are fetched

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

// ✅ Get a specific customer by ID for the logged-in user
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findOne({ _id: id, userId: req.user.id });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Failed to fetch customer' });
  }
});

// ✅ Create a new customer for the logged-in user
router.post('/', async (req, res) => {
  try {
    console.log('Received customer data:', req.body);

    const { name, email, phone, address, notes, tags } = req.body;
    const userId = req.user?.id; // Ensure the user is correctly extracted
    console.log('User ID:', userId);

    if (!userId) {
      return res
        .status(401)
        .json({ message: 'Unauthorized. No user ID found' });
    }

    // ✅ Check if a customer with the same email already exists for this user
    const existingCustomer = await Customer.findOne({ email, user: userId });

    if (existingCustomer) {
      return res
        .status(400)
        .json({ message: 'A customer with this email already exists' });
    }

    // ✅ Create a new customer linked to the logged-in user
    const customer = new Customer({
      name,
      email,
      phone,
      address,
      notes,
      tags: tags || [],
      userId
    });

    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error('❌ Error creating customer:', error);

    // ✅ Handle duplicate email error from MongoDB
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: 'Customer with this email already exists' });
    }

    res.status(500).json({ message: 'Failed to create customer', error });
  }
});

// ✅ Update a customer for the logged-in user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, notes, tags } = req.body;

  try {
    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { name, email, phone, address, notes, tags: tags || [] },
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

// ✅ Delete a customer for the logged-in user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });
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
