// userModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  userType: { type: String, enum: ['user', 'maid'], required: true },
  address: { type: String }, // Optional for 'maid', required for 'user'
  requests: [{ // An array of request objects
    maidId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to maid
    requestTime: { type: Date, required: true },
    status: { type: String, default: 'pending' } // Status of the request
  }]
});

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Custom validation to ensure address is required for user type
userSchema.pre('validate', function (next) {
  if (this.userType === 'user' && !this.address) {
    return next(new Error('Address is required for user type'));
  }
  next();
});

// Create and export User model
const User = mongoose.model('User', userSchema);
module.exports = User;
