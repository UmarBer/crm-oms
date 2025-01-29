const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');
const messageRoutes = require('./routes/messages');
const templateRoutes = require('./routes/templates');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to database'))
  .catch((error) => console.error('Database connection error: ', error));

app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/templates', templateRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
