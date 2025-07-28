// iqexpress-backend/routes/quoteRoutes.js

const express = require('express');
const router = express.Router();

// @route   POST /api/quote
// @desc    Calculate a free quote based on shipment details
// @access  Public
router.post('/', (req, res) => {
  try {
    // Extract shipment details from the request body
    const { origin, destination, weight, dimensions } = req.body;

    // --- Simple Placeholder Quote Logic ---
    // In a real application, this would be much more sophisticated:
    // - Look up rates based on origin/destination zones
    // - Factor in weight, dimensions (volume), service type (express/standard)
    // - Add fuel surcharges, taxes, etc.

    if (!origin || !destination || !weight) {
      return res.status(400).json({ message: 'Origin, Destination, and Weight are required for a quote.' });
    }

    let basePrice = 1000; // Base price in NGN
    let weightFactor = parseFloat(weight) * 200; // NGN 200 per kg
    let distanceFactor = 500; // Placeholder for distance factor (e.g., local vs inter-state)

    // Simple logic for destination
    if (destination.toLowerCase().includes('lagos')) {
      distanceFactor = 1500; // Higher for Lagos
    } else if (destination.toLowerCase().includes('abuja')) {
      distanceFactor = 2000; // Even higher for Abuja
    } else if (destination.toLowerCase().includes('onitsha')) {
        distanceFactor = 700; // Lower for local
    }


    let estimatedQuote = basePrice + weightFactor + distanceFactor;

    // Add a small handling fee if dimensions are provided
    if (dimensions) {
      estimatedQuote += 100;
    }

    // Return the calculated quote
    res.json({
      origin,
      destination,
      weight: parseFloat(weight),
      dimensions,
      estimatedQuote: estimatedQuote.toFixed(2), // Format to 2 decimal places
      currency: 'NGN',
      message: 'Estimated quote calculated successfully.'
    });

  } catch (error) {
    console.error('Error calculating quote:', error);
    res.status(500).json({ message: 'Server error. Unable to calculate quote.' });
  }
});

module.exports = router;