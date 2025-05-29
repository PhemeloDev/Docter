const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    enum: ['General Practice', 'Mental Health', 'Pediatrics', 'Dermatology', 'Cardiology', 'Other']
  },
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: 0
  },
  qualifications: [{
    degree: String,
    institution: String,
    year: Number
  }],
  languages: [{
    type: String,
    default: ['English']
  }],
  bio: {
    type: String,
    maxlength: 1000
  },
  consultationFee: {
    type: Number,
    required: [true, 'Consultation fee is required'],
    min: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String,
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  licenseNumber: {
    type: String,
    required: [true, 'License number is required']
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }]
}, {
  timestamps: true
});

// Index for search optimization
doctorSchema.index({ specialty: 1, 'rating.average': -1 });

module.exports = mongoose.model('Doctor', doctorSchema); 