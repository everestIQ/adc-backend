// iqexpress-backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const Shipment = require('../models/Shipment'); // Import the Shipment model
const auth = require('../middleware/authMiddleware'); // Import the authentication middleware

// --- Admin API Routes for Shipments ---
// Note: These routes are intended for administrative use, so they should be protected
// by authentication middleware to ensure only authorized users can access them.
// Apply the auth middleware to ALL routes in this file
// Any route defined after this line will require authentication
router.use(auth); // <--- ADD THIS LINE

// @route   POST /api/admin/shipments
// @desc    Create a new shipment
// @access  Private (ideally, would have admin authentication)
router.post('/', async (req, res) => {
  try {
    const {
      trackingNumber,
      status,
      origin,
      destination,
      senderName,
      receiverName,
      weight,
      dimensions,
      locationHistory
    } = req.body;

    // Basic validation
    if (!trackingNumber || !status || !origin || !destination || !receiverName || !weight) {
      return res.status(400).json({ message: 'Please include all required shipment fields: trackingNumber, status, origin, destination, receiverName, weight.' });
    }

    // Check if tracking number already exists
    const existingShipment = await Shipment.findOne({ where: { trackingNumber } });
    if (existingShipment) {
      return res.status(409).json({ message: 'Shipment with this tracking number already exists.' });
    }

    const shipment = await Shipment.create({
      trackingNumber,
      status,
      origin,
      destination,
      senderName,
      receiverName,
      weight,
      dimensions,
      locationHistory: locationHistory || [] // Ensure it's an array, even if empty
    });

    res.status(201).json(shipment); // 201 Created
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ message: 'Server error. Could not create shipment.' });
  }
});

// @route   GET /api/admin/shipments
// @desc    Get all shipments
// @access  Private (ideally, would have admin authentication)
router.get('/', async (req, res) => {
  try {
    const shipments = await Shipment.findAll(); // Find all records

    if (shipments.length === 0) {
      return res.status(404).json({ message: 'No shipments found.' });
    }

    res.json(shipments);
  } catch (error) {
    console.error('Error fetching all shipments:', error);
    res.status(500).json({ message: 'Server error. Could not retrieve shipments.' });
  }
});

// @route   PUT /api/admin/shipments/:trackingNumber  <-- Changed parameter name for clarity
// @desc    Update a shipment by tracking number
// @access  Private (ideally, would have admin authentication)
router.put('/:trackingNumber', async (req, res) => { // <--- Changed :id to :trackingNumber here
  const { trackingNumber: paramTrackingNumber } = req.params; // Get tracking number from URL parameters
  console.log('PUT /api/admin/shipments/:trackingNumber received trackingNumber:', paramTrackingNumber); // <--- Updated log

  try {
    // Find the shipment by trackingNumber instead of primary key (id)
    const shipment = await Shipment.findOne({
      where: { trackingNumber: paramTrackingNumber }
    });

    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found with that tracking number.' });
    }

    // ... (rest of your update logic remains the same below this) ...

    const {
      // ... (keep all the destructuring for req.body here) ...
      status,
      origin,
      destination,
      senderName,
      receiverName,
      weight,
      dimensions,
      locationHistory // This will be an array from frontend
    } = req.body;

    // Prepare update data, allowing partial updates
    const updateData = {};
    // *** IMPORTANT: You need to make sure the trackingNumber from req.body
    // is NOT updated if it conflicts with an existing one, unless it's the same shipment.
    // Let's refine this check.
    if (req.body.trackingNumber !== undefined && req.body.trackingNumber !== shipment.trackingNumber) {
        const existingShipmentWithNewTracking = await Shipment.findOne({ where: { trackingNumber: req.body.trackingNumber } });
        if (existingShipmentWithNewNewTracking) { // if another shipment already has this tracking number
            return res.status(409).json({ message: 'New tracking number already exists for another shipment.' });
        }
        updateData.trackingNumber = req.body.trackingNumber; // Only update if it's new and unique
    } else if (req.body.trackingNumber === shipment.trackingNumber) {
        // If trackingNumber is provided but it's the same as current, no change needed for trackingNumber field.
    } else if (req.body.trackingNumber === undefined) {
        // If trackingNumber is not provided in body, do nothing to it.
    }


    if (status !== undefined) updateData.status = status;
    if (origin !== undefined) updateData.origin = origin;
    if (destination !== undefined) updateData.destination = destination;
    if (senderName !== undefined) updateData.senderName = senderName;
    if (receiverName !== undefined) updateData.receiverName = receiverName;
    if (weight !== undefined) updateData.weight = weight;
    if (dimensions !== undefined) updateData.dimensions = dimensions;

    // Special handling for locationHistory: ensure it's a valid array
    if (locationHistory !== undefined) {
      if (!Array.isArray(locationHistory)) {
        return res.status(400).json({ message: 'locationHistory must be a valid JSON array.' });
      }
      updateData.locationHistory = locationHistory; // Our model setter will stringify this
    }


    // Apply updates
    await shipment.update(updateData);

    res.json(shipment); // Return the updated shipment
  } catch (error) {
    console.error('Error updating shipment:', error);
    res.status(500).json({ message: 'Server error. Could not update shipment.' });
  }
});


module.exports = router;
// Note: Ensure you have proper authentication and authorization middleware in place for these routes