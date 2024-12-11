const mongoose = require('mongoose');

const acceptedRequestSchema = new mongoose.Schema({
    requestId: { type: mongoose.Schema.Types.ObjectId, required: true },
    username1: { type: String, required: true }, // Maid's username
    maidPhone: { type: String, required: true }, // Maid's phone number
    username2: { type: String, required: true }, // User whose request is accepted
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, // User ID of username2
    phone: { type: String, required: true }, // User's phone number (username2)
    address: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    details: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AcceptedRequest', acceptedRequestSchema); // Ensure model is exported correctly
