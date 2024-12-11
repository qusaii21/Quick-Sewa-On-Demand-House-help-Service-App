const express = require('express');
const router = express.Router();
const AcceptedRequest = require('./AcceptedRequest');

// GET route to fetch accepted requests for a specific user
router.get('/:username2', async (req, res) => {
    const { username2 } = req.params;

    // Calculate the time range for the past 24 hours
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    try {
        const acceptedRequests = await AcceptedRequest.find({
            username2,
            createdAt: { $gte: oneDayAgo },  // Only fetch requests within the last 24 hours
        });

        if (acceptedRequests.length === 0) {
            return res.status(404).json({ message: 'No accepted requests found within the last 24 hours' });
        }

        res.status(200).json(acceptedRequests);
    } catch (error) {
        console.error('Error fetching accepted requests:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
