// request.js
const express = require('express');
const router = express.Router();
const Request = require('../requestModel');

// Add a new request
router.post('/', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json(newRequest); // Respond with the created request
  } catch (error) {
    console.error('Error creating new request:', error);
    res.status(500).json({ message: 'Failed to create request' });
  }
});

// Fetch pending requests from the last 30 minutes
router.get('/pending', async (req, res) => {
  try {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); // Calculate 30 minutes ago
    const pendingRequests = await Request.find({
      status: 'pending',
      createdAt: { $gte: thirtyMinutesAgo },
    }).sort({ createdAt: -1 });

    res.status(200).json(pendingRequests);
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
});

// Update request status (accept/deny)
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body; // "accepted" or "denied"
    const updatedRequest = await Request.findByIdAndUpdate(req.params.id, { status }, { new: true });

    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Failed to update request status' });
  }
});

module.exports = router;
