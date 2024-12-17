const express = require('express');
const Customer = require('../models/Customer');

const router = express.Router();

// Create a new customer
router.post('/', async (req, res) => {
  const { name, email, phone, address, notes, tags } = req.body;

  try {
    const customer = new Customer({
      name,
      email,
      phone,
      address,
      notes,
      tags: tags || []
    });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Failed to create customer', error });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  const { search, tags } = req.query;
  try {
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      query = {
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } },
          { phone: { $regex: searchRegex } },
          { tags: { $regex: searchRegex } }
        ]
      };
    }

    if (tags) {
      const tagArray = tags.split(','); // Split comma-separated tags into an array
      // If a $or query already exists, combine $or with $and
      if (query.$or) {
        query.$and = [{ tags: { $all: tagArray } }];
      } else {
        query.tags = { $all: tagArray }; // Match customers with all provided tags
      }
    }

    const customers = await Customer.find(query);
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
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
        tags: tags || [] // Default to an empty array if no tags are provided
      },
      { new: true } // Return the updated document
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
