// iqexpress-backend/routes/trackingRoutes.js

const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment'); // Import the Shipment model

// @route   GET /api/track/:trackingNumber
// @desc    Get shipment details by tracking number
// @access  Public
router.get('/:trackingNumber', async (req, res) => {
  try {
    const { trackingNumber } = req.params; // Get tracking number from URL parameters

    if (!trackingNumber) {
      return res.status(400).json({ message: 'Tracking number is required.' });
    }

    const shipment = await Shipment.findOne({
      where: { trackingNumber: trackingNumber }
    });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found with that tracking number.' });
    }

    // Send back the shipment data.
    // The locationHistory will automatically be parsed into an array by the getter.
    res.json(shipment);

  } catch (error) {
    console.error('Error tracking shipment:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;