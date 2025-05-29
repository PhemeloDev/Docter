const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Notification = require('../models/Notification');
const emailService = require('../utils/emailService');

// Schedule appointment reminders to run every hour
const scheduleAppointmentReminders = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running appointment reminder job...');
    
    try {
      // Find appointments for tomorrow that haven't had reminders sent
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
      
      const appointmentsToRemind = await Appointment.find({
        appointmentDate: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow
        },
        status: { $in: ['scheduled', 'confirmed'] },
        reminderSent: false
      })
      .populate('patient', 'name email')
      .populate('doctor')
      .populate('service', 'name');

      console.log(`Found ${appointmentsToRemind.length} appointments to remind`);

      for (const appointment of appointmentsToRemind) {
        try {
          // Get doctor user info
          const doctorUser = await User.findById(appointment.doctor.user);
          
          // Send email reminder
          await emailService.sendAppointmentReminder(
            appointment,
            { ...appointment.doctor.toObject(), user: doctorUser },
            appointment.patient
          );

          // Create notification
          await Notification.create({
            recipient: appointment.patient._id,
            type: 'appointment_reminder',
            title: 'Appointment Reminder',
            message: `Your appointment with ${doctorUser.name} is tomorrow at ${appointment.appointmentTime}`,
            data: {
              appointmentId: appointment._id,
              doctorId: appointment.doctor._id
            },
            priority: 'high'
          });

          // Mark reminder as sent
          appointment.reminderSent = true;
          await appointment.save();

          console.log(`Reminder sent for appointment ${appointment._id}`);
        } catch (error) {
          console.error(`Error sending reminder for appointment ${appointment._id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in appointment reminder job:', error);
    }
  });
};

// Schedule review requests for completed appointments
const scheduleReviewRequests = () => {
  // Run once a day at 10 AM
  cron.schedule('0 10 * * *', async () => {
    console.log('Running review request job...');
    
    try {
      // Find completed appointments from 2 days ago that haven't been rated
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      twoDaysAgo.setHours(0, 0, 0, 0);
      
      const oneDayAgo = new Date(twoDaysAgo);
      oneDayAgo.setDate(oneDayAgo.getDate() + 1);
      
      const appointmentsForReview = await Appointment.find({
        appointmentDate: {
          $gte: twoDaysAgo,
          $lt: oneDayAgo
        },
        status: 'completed',
        'rating.score': { $exists: false }
      })
      .populate('patient', 'name email')
      .populate('doctor')
      .populate('service', 'name');

      console.log(`Found ${appointmentsForReview.length} appointments for review requests`);

      for (const appointment of appointmentsForReview) {
        try {
          // Get doctor user info
          const doctorUser = await User.findById(appointment.doctor.user);
          
          // Create notification for review request
          await Notification.create({
            recipient: appointment.patient._id,
            type: 'review_request',
            title: 'Rate Your Recent Appointment',
            message: `How was your appointment with ${doctorUser.name}? Your feedback helps us improve.`,
            data: {
              appointmentId: appointment._id,
              doctorId: appointment.doctor._id,
              url: `/appointments/${appointment._id}/review`
            },
            priority: 'medium'
          });

          console.log(`Review request sent for appointment ${appointment._id}`);
        } catch (error) {
          console.error(`Error sending review request for appointment ${appointment._id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error in review request job:', error);
    }
  });
};

// Clean up old notifications
const scheduleNotificationCleanup = () => {
  // Run once a week on Sunday at 2 AM
  cron.schedule('0 2 * * 0', async () => {
    console.log('Running notification cleanup job...');
    
    try {
      // Delete read notifications older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const result = await Notification.deleteMany({
        isRead: true,
        createdAt: { $lt: thirtyDaysAgo }
      });

      console.log(`Cleaned up ${result.deletedCount} old notifications`);
    } catch (error) {
      console.error('Error in notification cleanup job:', error);
    }
  });
};

// Update appointment statuses for missed appointments
const scheduleAppointmentStatusUpdates = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running appointment status update job...');
    
    try {
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      
      // Mark appointments as no-show if they're 30 minutes past appointment time and still scheduled/confirmed
      const missedAppointments = await Appointment.updateMany(
        {
          status: { $in: ['scheduled', 'confirmed'] },
          appointmentDate: { $lte: thirtyMinutesAgo }
        },
        {
          status: 'no-show'
        }
      );

      if (missedAppointments.modifiedCount > 0) {
        console.log(`Updated ${missedAppointments.modifiedCount} appointments to no-show status`);
      }
    } catch (error) {
      console.error('Error in appointment status update job:', error);
    }
  });
};

// Analytics data aggregation job
const scheduleAnalyticsAggregation = () => {
  // Run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running analytics aggregation job...');
    
    try {
      // This would aggregate daily statistics for faster dashboard queries
      // For now, just log that the job is running
      console.log('Analytics aggregation completed');
    } catch (error) {
      console.error('Error in analytics aggregation job:', error);
    }
  });
};

const startScheduler = () => {
  console.log('Starting scheduled jobs...');
  
  scheduleAppointmentReminders();
  scheduleReviewRequests();
  scheduleNotificationCleanup();
  scheduleAppointmentStatusUpdates();
  scheduleAnalyticsAggregation();
  
  console.log('All scheduled jobs started successfully');
};

module.exports = {
  startScheduler,
  scheduleAppointmentReminders,
  scheduleReviewRequests,
  scheduleNotificationCleanup,
  scheduleAppointmentStatusUpdates,
  scheduleAnalyticsAggregation
}; 