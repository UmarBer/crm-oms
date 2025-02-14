const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { errorHandler } = require('../utils/error');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// 🛠 Sign In
const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate request body
    if (!email || !password) {
      return next(errorHandler(400, 'All fields are required'));
    }

    // ✅ Check if user exists
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(400, 'User not found'));
    }

    // ✅ Verify password
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'));
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // ✅ Remove password field from response
    const { password: pass, ...rest } = validUser._doc;

    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// 🛠 Sign Up
const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // ✅ Validate request body
    if (!username || !email || !password) {
      return next(errorHandler(400, 'All fields are required'));
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, 'User already exists'));
    }

    // ✅ Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // ✅ Create and save new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    next(error);
  }
};

// 🛠 Google Sign In
const google = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    // ✅ Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // ✅ Generate a random secure password
      const generatedPassword = crypto.randomBytes(8).toString('hex');
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      // ✅ Create new user with Google credentials
      user = new User({ username: name, email, password: hashedPassword });
      await user.save();
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // ✅ Remove password from response
    const { password, ...rest } = user._doc;

    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin, google };
