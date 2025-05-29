const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new appointment
router.post('/', auth, async (req, res) => {
  try {
    const {
      doctorId,
      serviceId,
      appointmentDate,
      appointmentTime,
      reasonForVisit,
      symptoms,
      type = 'video'
    } = req.body;

    // Validate doctor exists and is active
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive) {
      return res.status(404).json({ message: 'Doctor not found or inactive' });
    }

    // Validate service exists
    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: 'Service not found or inactive' });
    }

    // Check for scheduling conflicts
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed', 'in-progress'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'Time slot already booked' });
    }

    // Calculate total amount
    const amount = doctor.consultationFee;

    const appointment = new Appointment({
      patient: req.user.userId,
      doctor: doctorId,
      service: serviceId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reasonForVisit,
      symptoms,
      type,
      payment: {
        amount,
        status: 'pending'
      }
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor')
      .populate('service');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's appointments
router.get('/my', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = { patient: req.user.userId };
    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('doctor')
      .populate('service')
      .sort({ appointmentDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get user appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor's appointments
router.get('/doctor', auth, async (req, res) => {
  try {
    // Find doctor profile for current user
    const doctor = await Doctor.findOne({ user: req.user.userId });
    if (!doctor) {
      return res.status(403).json({ message: 'Access denied. Doctor profile required.' });
    }

    const { status, date, page = 1, limit = 10 } = req.query;
    
    let query = { doctor: doctor._id };
    if (status) {
      query.status = status;
    }
    if (date) {
      const searchDate = new Date(date);
      query.appointmentDate = {
        $gte: searchDate,
        $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('service')
      .sort({ appointmentDate: 1, appointmentTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointment by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor')
      .populate('service');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is authorized to view this appointment
    if (appointment.patient._id.toString() !== req.user.userId && 
        appointment.doctor.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update appointment status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check authorization
    if (appointment.patient.toString() !== req.user.userId && 
        appointment.doctor.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    appointment.status = status;
    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor')
      .populate('service');

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add prescription (doctors only)
router.patch('/:id/prescription', auth, async (req, res) => {
  try {
    const { medications, notes } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the doctor for this appointment
    const doctor = await Doctor.findOne({ user: req.user.userId });
    if (!doctor || appointment.doctor.toString() !== doctor._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Only the assigned doctor can add prescriptions.' });
    }

    appointment.prescription = {
      medications,
      notes
    };

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor')
      .populate('service');

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Add prescription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add rating and review
router.patch('/:id/rating', auth, async (req, res) => {
  try {
    const { score, review } = req.body;

    if (score < 1 || score > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the patient for this appointment
    if (appointment.patient.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied. Only patients can rate appointments.' });
    }

    // Check if appointment is completed
    if (appointment.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed appointments' });
    }

    appointment.rating = {
      score,
      review,
      date: new Date()
    };

    await appointment.save();

    // Update doctor's overall rating
    const doctor = await Doctor.findById(appointment.doctor);
    const appointmentsWithRatings = await Appointment.find({
      doctor: appointment.doctor,
      'rating.score': { $exists: true }
    });

    const totalRating = appointmentsWithRatings.reduce((sum, apt) => sum + apt.rating.score, 0);
    const averageRating = totalRating / appointmentsWithRatings.length;

    doctor.rating.average = averageRating;
    doctor.rating.count = appointmentsWithRatings.length;
    await doctor.save();

    res.json(appointment);
  } catch (error) {
    console.error('Add rating error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 