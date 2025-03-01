const jwt = require('jsonwebtoken');
const { errorHandler } = require('../utils/error');

const authenticateUser = (req, res, next) => {
  try {
    console.log('🔍 Checking Authorization Header:', req.headers.authorization);

    if (!req.headers.authorization) {
      console.log('❌ No Authorization header found');
      return next(errorHandler(401, 'Unauthorized - No token provided'));
    }

    const token = req.headers.authorization.split(' ')[1]; // Extract token
    console.log('📌 Extracted Token:', token);

    if (!token) {
      console.log('❌ No token found after split');
      return next(errorHandler(401, 'Unauthorized - Missing token'));
    }

    console.log('🔑 JWT Secret in Backend:', process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Decoded Token:', decoded);

    req.user = decoded; // Attach user to request
    next(); // Call next middleware
  } catch (error) {
    console.error('❌ Token Verification Failed:', error.message);
    return next(errorHandler(401, 'Unauthorized - Invalid token'));
  }
};

module.exports = { authenticateUser };
