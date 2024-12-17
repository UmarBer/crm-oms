const { google } = require('googleapis');
require('dotenv').config();

async function updateGoogleSheet(orders) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const values = orders.map((order) => [
    order.clientName,
    order.productName,
    order.quantity,
    order.orderDate
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Orders!A2', // Adjust as needed
    valueInputOption: 'USER_ENTERED',
    resource: { values }
  });
}

module.exports = updateGoogleSheet;
