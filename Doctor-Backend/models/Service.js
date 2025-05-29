const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: 1000
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['General Consultations', 'Mental Health', 'Pediatrics', 'Dermatology', 'Prescription Refills', 'Specialist Care']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: 0
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required'],
    default: 30 // minutes
  },
  isActive: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  requirements: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', serviceSchema); 