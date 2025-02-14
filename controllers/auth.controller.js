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
  const { username, email, password, googleAuth } = req.body;

  // ✅ Allow Google signups without password validation
  if (!username || !email || (!password && !googleAuth)) {
    return next(errorHandler(400, 'All fields are required'));
  }

  const hashedPassword = password ? bcryptjs.hashSync(password, 10) : null;

  const newUser = new User({
    username,
    email,
    password: hashedPassword
  });

  try {
    await newUser.save();
    res.json({ success: true, message: 'Signup successful' });
  } catch (error) {
    next(error);
  }
};

// 🛠 Google Sign In
const google = async (req, res, next) => {
  const { name, email, googleAuth } = req.body;
  try {
    let user = await User.findOne({ email });

    if (user) {
      // ✅ If user already exists, generate a token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });

      const { password, ...rest } = user._doc;
      return res
        .status(200)
        .cookie('access_token', token, { httpOnly: true })
        .json(rest);
    }

    // ✅ If user does NOT exist, create one
    const generatedPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

    const newUser = new User({
      username: name,
      email,
      password: hashedPassword,
      googleAuth: true // ✅ Add this flag
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    const { password, ...rest } = newUser._doc;

    res
      .status(200)
      .cookie('access_token', token, { httpOnly: true })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json({ message: 'Signout successful' });
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, signin, google, signout };
