// iqexpress-backend/models/Shipment.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database'); // Import the sequelize instance

const Shipment = sequelize.define('Shipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending', // Default status
  },
  origin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderName: {
    type: DataTypes.STRING,
    allowNull: true, // Can be null if not provided
  },
  receiverName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT, // Use FLOAT for decimal weights
    allowNull: false,
  },
  dimensions: {
    type: DataTypes.STRING, // e.g., "10x20x30 cm"
    allowNull: true,
  },
  // You can store location history as JSON or a separate table.
  // For simplicity, let's store it as JSON string for now.
  // Sequelize handles JSON data types for some databases, but for SQLite, it's often best stored as TEXT.
  locationHistory: {
    type: DataTypes.TEXT, // Store as string, parse/stringify as JSON
    allowNull: true,
    defaultValue: '[]', // Default to an empty JSON array string
    get() {
      const rawValue = this.getDataValue('locationHistory');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('locationHistory', JSON.stringify(value));
    }
  },
  // Sequelize automatically adds createdAt and updatedAt by default if `timestamps: true` (which it is by default)
}, {
  // Model options
  timestamps: true, // Adds createdAt and updatedAt fields
  tableName: 'shipments' // Optional: Define the table name explicitly
});

module.exports = Shipment;