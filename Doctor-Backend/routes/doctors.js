const express = require('express');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all doctors with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { specialty, page = 1, limit = 10, search, sortBy = 'rating.average' } = req.query;
    
    let query = { isActive: true };
    
    // Filter by specialty if provided
    if (specialty) {
      query.specialty = specialty;
    }
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: -1 },
      populate: {
        path: 'user',
        select: 'name email profilePicture'
      }
    };

    let doctors;
    if (search) {
      // Search in user names and doctor bios
      doctors = await Doctor.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $match: {
            $and: [
              query,
              {
                $or: [
                  { 'userInfo.name': { $regex: search, $options: 'i' } },
                  { bio: { $regex: search, $options: 'i' } },
                  { specialty: { $regex: search, $options: 'i' } }
                ]
              }
            ]
          }
        },
        { $sort: { [sortBy]: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: parseInt(limit) }
      ]);
    } else {
      doctors = await Doctor.find(query)
        .populate('user', 'name email profilePicture')
        .sort({ [sortBy]: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    }

    const total = await Doctor.countDocuments(query);

    res.json({
      doctors,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email profilePicture phone')
      .populate('services');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { date } = req.query;
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Get doctor's availability schedule
    const availability = doctor.availability;
    
    // Here you would implement logic to check actual availability
    // considering existing appointments, breaks, etc.
    // For now, returning the basic schedule
    
    res.json({ availability });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create doctor profile (for doctors only)
router.post('/profile', auth, async (req, res) => {
  try {
    // Check if user is already a doctor
    const existingDoctor = await Doctor.findOne({ user: req.user.userId });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    const {
      specialty,
      yearsOfExperience,
      qualifications,
      languages,
      bio,
      consultationFee,
      availability,
      licenseNumber,
      services
    } = req.body;

    const doctor = new Doctor({
      user: req.user.userId,
      specialty,
      yearsOfExperience,
      qualifications,
      languages,
      bio,
      consultationFee,
      availability,
      licenseNumber,
      services
    });

    await doctor.save();

    // Update user role to doctor
    await User.findByIdAndUpdate(req.user.userId, { role: 'doctor' });

    const populatedDoctor = await Doctor.findById(doctor._id)
      .populate('user', 'name email profilePicture');

    res.status(201).json(populatedDoctor);
  } catch (error) {
    console.error('Create doctor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update doctor profile
router.put('/profile', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.userId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const allowedUpdates = [
      'specialty', 'yearsOfExperience', 'qualifications', 'languages',
      'bio', 'consultationFee', 'availability', 'services'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctor._id,
      updates,
      { new: true, runValidators: true }
    ).populate('user', 'name email profilePicture');

    res.json(updatedDoctor);
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specialties
router.get('/meta/specialties', async (req, res) => {
  try {
    const specialties = await Doctor.distinct('specialty');
    res.json(specialties);
  } catch (error) {
    console.error('Get specialties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 