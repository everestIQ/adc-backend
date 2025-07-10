// iqexpress-backend/config/database.js

const { Sequelize } = require('sequelize');
const path = require('path');

// Define the path to your SQLite database file
// It will be created in the iqexpress-backend directory
const databasePath = path.join(__dirname, '..', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath, // Path to the SQLite database file
  logging: false, // Set to true to see SQL queries in the console
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to SQLite database has been established successfully.');
    // This will create the tables if they don't exist
    // Use { force: true } carefully, it DROPS existing tables
    await sequelize.sync();
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or sync models:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { sequelize, connectDB };