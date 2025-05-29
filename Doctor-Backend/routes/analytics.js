const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

const router = express.Router();

// Dashboard analytics for doctors
router.get('/doctor/dashboard', auth, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.userId });
    if (!doctor) {
      return res.status(403).json({ message: 'Access denied. Doctor profile required.' });
    }

    const { startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Basic stats
    const totalAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      ...dateFilter
    });

    const completedAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: 'completed',
      ...dateFilter
    });

    const upcomingAppointments = await Appointment.countDocuments({
      doctor: doctor._id,
      status: { $in: ['scheduled', 'confirmed'] },
      appointmentDate: { $gte: new Date() }
    });

    // Revenue calculation
    const revenueData = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          'payment.status': 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$payment.amount' },
          averageRevenue: { $avg: '$payment.amount' }
        }
      }
    ]);

    // Appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Monthly appointment trends
    const monthlyTrends = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          appointmentDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' }
          },
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ['$payment.status', 'completed'] },
                '$payment.amount',
                0
              ]
            }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Patient demographics (if available)
    const patientAgeGroups = await Appointment.aggregate([
      {
        $match: {
          doctor: doctor._id,
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'patient',
          foreignField: '_id',
          as: 'patientInfo'
        }
      },
      {
        $unwind: '$patientInfo'
      },
      {
        $addFields: {
          age: {
            $divide: [
              { $subtract: [new Date(), '$patientInfo.dateOfBirth'] },
              365.25 * 24 * 60 * 60 * 1000
            ]
          }
        }
      },
      {
        $bucket: {
          groupBy: '$age',
          boundaries: [0, 18, 30, 45, 60, 100],
          default: 'Unknown',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    res.json({
      overview: {
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments * 100).toFixed(2) : 0,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        averageRevenue: revenueData[0]?.averageRevenue || 0
      },
      appointmentsByStatus,
      monthlyTrends,
      patientAgeGroups
    });
  } catch (error) {
    console.error('Doctor analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Platform analytics (admin only)
router.get('/platform', auth, async (req, res) => {
  try {
    // For now, allow any authenticated user - in production, add admin role check
    const { startDate, endDate } = req.query;
    const dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // User statistics
    const totalUsers = await User.countDocuments();
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });

    // Appointment statistics
    const totalAppointments = await Appointment.countDocuments(dateFilter);
    const completedAppointments = await Appointment.countDocuments({
      status: 'completed',
      ...dateFilter
    });

    // Revenue statistics
    const revenueData = await Appointment.aggregate([
      {
        $match: {
          'payment.status': 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$payment.amount' },
          averageOrderValue: { $avg: '$payment.amount' }
        }
      }
    ]);

    // Most popular services
    const popularServices = await Appointment.aggregate([
      {
        $match: dateFilter
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceInfo'
        }
      },
      {
        $unwind: '$serviceInfo'
      },
      {
        $group: {
          _id: '$serviceInfo._id',
          name: { $first: '$serviceInfo.name' },
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [
                { $eq: ['$payment.status', 'completed'] },
                '$payment.amount',
                0
              ]
            }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Top performing doctors
    const topDoctors = await Appointment.aggregate([
      {
        $match: {
          status: 'completed',
          ...dateFilter
        }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      {
        $unwind: '$doctorInfo'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctorInfo.user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $group: {
          _id: '$doctorInfo._id',
          name: { $first: '$userInfo.name' },
          specialty: { $first: '$doctorInfo.specialty' },
          appointmentCount: { $sum: 1 },
          revenue: { $sum: '$payment.amount' },
          averageRating: { $avg: '$rating.score' }
        }
      },
      { $sort: { appointmentCount: -1 } },
      { $limit: 10 }
    ]);

    // Growth metrics
    const growthMetrics = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            role: '$role'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      userStats: {
        totalUsers,
        totalPatients,
        totalDoctors,
        patientToDoctorRatio: totalDoctors > 0 ? (totalPatients / totalDoctors).toFixed(2) : 0
      },
      appointmentStats: {
        totalAppointments,
        completedAppointments,
        completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments * 100).toFixed(2) : 0
      },
      revenueStats: {
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        averageOrderValue: revenueData[0]?.averageOrderValue || 0
      },
      popularServices,
      topDoctors,
      growthMetrics
    });
  } catch (error) {
    console.error('Platform analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Patient analytics
router.get('/patient/dashboard', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = { patient: req.user.userId };
    
    if (startDate && endDate) {
      dateFilter.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Basic stats
    const totalAppointments = await Appointment.countDocuments(dateFilter);
    const completedAppointments = await Appointment.countDocuments({
      ...dateFilter,
      status: 'completed'
    });

    const upcomingAppointments = await Appointment.countDocuments({
      patient: req.user.userId,
      status: { $in: ['scheduled', 'confirmed'] },
      appointmentDate: { $gte: new Date() }
    });

    // Spending analysis
    const spendingData = await Appointment.aggregate([
      {
        $match: {
          patient: req.user.userId,
          'payment.status': 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$payment.amount' },
          averageSpent: { $avg: '$payment.amount' }
        }
      }
    ]);

    // Services used
    const servicesUsed = await Appointment.aggregate([
      {
        $match: {
          patient: req.user.userId,
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceInfo'
        }
      },
      {
        $unwind: '$serviceInfo'
      },
      {
        $group: {
          _id: '$serviceInfo._id',
          name: { $first: '$serviceInfo.name' },
          count: { $sum: 1 },
          totalSpent: { $sum: '$payment.amount' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Favorite doctors
    const favoriteDoctors = await Appointment.aggregate([
      {
        $match: {
          patient: req.user.userId,
          status: 'completed'
        }
      },
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      {
        $unwind: '$doctorInfo'
      },
      {
        $lookup: {
          from: 'users',
          localField: 'doctorInfo.user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $group: {
          _id: '$doctorInfo._id',
          name: { $first: '$userInfo.name' },
          specialty: { $first: '$doctorInfo.specialty' },
          visitCount: { $sum: 1 },
          lastVisit: { $max: '$appointmentDate' }
        }
      },
      { $sort: { visitCount: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      overview: {
        totalAppointments,
        completedAppointments,
        upcomingAppointments,
        totalSpent: spendingData[0]?.totalSpent || 0,
        averageSpent: spendingData[0]?.averageSpent || 0
      },
      servicesUsed,
      favoriteDoctors
    });
  } catch (error) {
    console.error('Patient analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 