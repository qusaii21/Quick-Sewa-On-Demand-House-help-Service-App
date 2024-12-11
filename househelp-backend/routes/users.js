//routes/users.js

const express = require('express');
const User = require('../userModel');

const router = express.Router();

// Route to get user info by username instead of ID
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }); // Find user by username
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
