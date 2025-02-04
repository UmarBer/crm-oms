const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const orderRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customers');
const messageRoutes = require('./routes/messages');
const templateRoutes = require('./routes/templates');
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to database'))
  .catch((error) => console.error('Database connection error: ', error));

app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
