const { google } = require('googleapis');
require('dotenv').config();

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

async function updateGoogleSheet(orders, startDate, endDate) {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  // Format the start and end dates
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  const title = `Orders from ${formattedStartDate} to ${formattedEndDate}`;

  // Update the sheet title
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    resource: {
      requests: [
        {
          updateSpreadsheetProperties: {
            properties: {
              title
            },
            fields: 'title'
          }
        }
      ]
    }
  });

  console.log(`Sheet title updated to: ${title}`);

  const range = 'Orders!A2:Z'; // Adjust as needed

  // Clear the existing data
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range
  });
  console.log('Cleared existing data from the sheet');

  // Prepare new data to append with formatted dates
  const values = orders.map((order) => [
    order.clientName,
    order.productName,
    order.quantity,
    formatDate(order.orderDate)
  ]);

  // Append the new data
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: 'Orders!A2', // Adjust as needed
    valueInputOption: 'USER_ENTERED',
    resource: { values }
  });
}

module.exports = updateGoogleSheet;
