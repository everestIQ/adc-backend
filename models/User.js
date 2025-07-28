// iqexpress-backend/models/User.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import sequelize instance

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Basic email format validation
    },
  },
  password: { // This will store the hashed password
    type: DataTypes.STRING,
    allowNull: false,
  },
  // You can add roles here if you plan for different user types (e.g., 'admin', 'editor')
  role: {
    type: DataTypes.ENUM('admin', 'user'), // Example roles
    allowNull: false,
    defaultValue: 'user',
  }
}, {
  tableName: 'users', // Optional: specify table name
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports = User;