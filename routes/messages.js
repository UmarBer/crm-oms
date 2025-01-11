const express = require('express');
const { sendWhatsAppMessage } = require('../utils/sendWhatsAppMessage');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.post('/send-message', async (req, res) => {
  const { phone, message, languageCode } = req.body;

  if (!phone || !message) {
    return res
      .status(400)
      .json({ message: 'Phone number and message are required' });
  }

  try {
    const response = await sendWhatsAppMessage(phone, message, languageCode);
    res
      .status(200)
      .json({ message: 'Message sent successfully', data: response });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to send message',
      error: error.message
    });
  }
});

router.post('/send-first-message', async (req, res) => {
  const { phone } = req.body;
  console.log('Access Token:', process.env.VITE_WHATSAPP_API_TOKEN);

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v21.0/${process.env.VITE_PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: 'hello_customer',
          language: { code: 'en' }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.VITE_WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({
      message: 'First message sent successfully',
      data: response.data
    });
  } catch (error) {
    console.error(
      'Error sending first message:',
      error.response?.data || error.message
    );
    res.status(500).json({
      message: 'Failed to send first message',
      error: error.message
    });
  }
});

module.exports = router;
