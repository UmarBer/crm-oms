const express = require('express');
const MessageTemplate = require('../models/MessageTemplate');

const router = express.Router();
const axios = require('axios');
const { text } = require('body-parser');

// Create a new template
router.post('/', async (req, res) => {
  const { name, body, tags } = req.body;

  try {
    const template = new MessageTemplate({ name, body, tags });
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ message: 'Failed to create template', error });
  }
});

// Fetch all templates
router.get('/', async (req, res) => {
  try {
    const templates = await MessageTemplate.find();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Failed to fetch templates', error });
  }
});

// Update a template
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, body, tags } = req.body;

  try {
    const updatedTemplate = await MessageTemplate.findByIdAndUpdate(
      id,
      { name, body, tags },
      { new: true }
    );
    if (!updatedTemplate) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Failed to update template', error });
  }
});

// Delete a template
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const template = await MessageTemplate.findByIdAndDelete(id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res
      .status(200)
      .json({ message: 'Template deleted successfully', template });
  } catch (error) {
    console.error('Error deleting template:', template);
    res.status(500).json({ message: 'Failed to delete template', error });
  }
});

// WhatsApp API Endpoints

// Send a message
// Endpoint: POST /api/templates/:id/send
router.post('/:id/send', async (req, res) => {
  const { recipientPhone } = req.body; // Phone number of the recipient
  const { id } = req.params;

  try {
    // FEtch the template details from the database
    const template = await MessageTemplate.findById(id);

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Construct the message body with WhatsApp API requiements
    const messageBody = {
      messaging_product: 'whatsapp',
      to: recipientPhone,
      type: 'text',
      text: {
        body: template.content
      }
    };

    // Send the message to the WhatsApp Business API

    const response = await axios.post(
      `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}>/messages`,
      messageBody,
      {
        headers: {
          Authorization: `Bearer ${process.env.VITE_WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res
      .status(200)
      .json({ message: 'Message sent successfully', response: response.data });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message', error });
  }
});

module.exports = router;
