// requestModel.js
const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  details: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, default: 'pending' }, // Default status
}, { timestamps: true });

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
