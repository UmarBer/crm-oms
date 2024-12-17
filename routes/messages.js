const express = require('express');
const { sendWhatsAppMessage } = require('../utils/sendWhatsAppMessage');

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

module.exports = router;
