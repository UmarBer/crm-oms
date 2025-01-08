const axios = require('axios');

const sendWhatsAppMessage = async (phone, message) => {
  const apiUrl = `https://graph.facebook.com/v21.0/${process.env.VITE_PHONE_NUMBER_ID}/messages`;
  const token = process.env.VITE_WHATSAPP_API_TOKEN; // Store your token in the .env file

  const payload = {
    messaging_product: 'whatsapp',
    to: phone,
    text: { body: message }
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Message sent successfully:', response.data);
    console.log(payload);
    return response.data;
  } catch (error) {
    console.error('Error sending WhatsApp mesage:', error.response);
    throw error;
  }
};

module.exports = { sendWhatsAppMessage };
