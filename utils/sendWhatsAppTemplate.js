const axios = require('axios');

const sendWhatsAppTemplate = async (
  phone,
  templateName,
  languageCode = 'en_US'
) => {
  const apiUrl = `https://graph.facebook.com/v15.0/<YOUR_PHONE_NUMBER_ID>/messages`;
  const token = process.env.WHATSAPP_API_TOKEN;

  const payload = {
    messaging_product: 'whatsapp',
    to: phone,
    template: {
      name: templateName,
      language: { code: languageCode }
    }
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Template message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error sending template message:',
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = { sendWhatsAppTemplate };