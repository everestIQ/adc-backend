// iqexpress-backend/server.js
// This file sets up the Express server and connects to the database.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/database');

// Import your models here so Sequelize can find them and sync
require('./models/Shipment');
require('./models/User'); // Add this line for the User model

// Import your routes here
const trackingRoutes = require('./routes/trackingRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const adminRoutes = require('./routes/adminRoutes');// Add this line for admin routes
const authRoutes = require('./routes/authRoutes'); // Add this line for auth routes

// Call the database connection function, which also syncs models
// This will ensure that the database is connected before starting the server
connectDB().then(async () => {
  // You can add a block here to create an initial admin user if none exists
  // FOR INITIAL SETUP ONLY:
  // const User = require('./models/User');
  // const bcrypt = require('bcryptjs');
  // try {
  //   const adminExists = await User.findOne({ where: { username: 'admin' } });
  //   if (!adminExists) {
  //     const salt = await bcrypt.genSalt(10);
  //     const hashedPassword = await bcrypt.hash('adminpassword', salt); // Choose a strong password!
  //     await User.create({
  //       username: 'admin',
  //       email: 'admin@iqexpress.com',
  //       password: hashedPassword,
  //       role: 'admin'
  //     });
  //     console.log('Initial admin user created!');
  //   }
  // } catch (err) {
  //   console.error('Error creating initial admin user:', err);
  // }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('iQexpress Backend API is running!');
});

// Mount your API routes
app.use('/api/track', trackingRoutes);
app.use('/api/quote', quoteRoutes);
app.use('/api/admin/shipments', adminRoutes);
app.use('/api/auth', authRoutes); // Add this new line for authentication routes


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
});