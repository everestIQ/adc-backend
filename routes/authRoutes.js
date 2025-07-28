// iqexpress-backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// @route   POST /api/auth/register
// @desc    Register a new admin user (Use with caution in production: create one admin then disable/remove this route)
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    user = await User.findOne({ where: { username } });
    if (user) {
        return res.status(400).json({ message: 'Username already taken.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user' // Default to 'user' if not specified, or 'admin' for initial setup
    });

    // Generate token (optional on registration, typically done on login)
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ message: 'User registered successfully.', token });
      }
    );

  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Find user by email or username
    let user = await User.findOne({
        where: {
            [require('sequelize').Op.or]: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Create and return JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role, username: user.username }); // Return token and basic user info
      }
    );

  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

module.exports = router;