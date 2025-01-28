// backend/src/routes/authRoutes.js
const express = require('express');
const verifyFirebaseToken = require('../middlewares/authMiddlewares');

const router = express.Router();

router.get('/protected', verifyFirebaseToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
