const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const emailTemplates = {
  appointmentConfirmation: (appointment, doctor, patient) => ({
    subject: 'Appointment Confirmation - HealthHive',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background-color: #0288D1; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .appointment-details { background-color: #EEF6FB; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6B7280; }
          .btn { display: inline-block; padding: 12px 24px; background-color: #0288D1; color: white; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HealthHive</h1>
            <h2>Appointment Confirmed!</h2>
          </div>
          <div class="content">
            <p>Dear ${patient.name},</p>
            <p>Your appointment has been successfully confirmed. Here are the details:</p>
            
            <div class="appointment-details">
              <h3>Appointment Details</h3>
              <p><strong>Doctor:</strong> ${doctor.user.name}</p>
              <p><strong>Specialty:</strong> ${doctor.specialty}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
              <p><strong>Type:</strong> ${appointment.type}</p>
              <p><strong>Duration:</strong> ${appointment.duration} minutes</p>
            </div>
            
            <p>We'll send you a reminder 24 hours before your appointment.</p>
            <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
            
            <a href="${process.env.FRONTEND_URL}/appointments/${appointment._id}" class="btn">View Appointment</a>
          </div>
          <div class="footer">
            <p>HealthHive - Your Health, Our Priority</p>
            <p>If you have any questions, contact us at support@healthhive.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  appointmentReminder: (appointment, doctor, patient) => ({
    subject: 'Appointment Reminder - Tomorrow - HealthHive',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background-color: #0288D1; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .reminder-box { background-color: #FFF3CD; border: 1px solid #FFEAA7; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .appointment-details { background-color: #EEF6FB; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6B7280; }
          .btn { display: inline-block; padding: 12px 24px; background-color: #0288D1; color: white; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HealthHive</h1>
            <h2>Appointment Reminder</h2>
          </div>
          <div class="content">
            <div class="reminder-box">
              <h3>⏰ Your appointment is tomorrow!</h3>
            </div>
            
            <p>Dear ${patient.name},</p>
            <p>This is a friendly reminder about your upcoming appointment:</p>
            
            <div class="appointment-details">
              <h3>Appointment Details</h3>
              <p><strong>Doctor:</strong> ${doctor.user.name}</p>
              <p><strong>Date:</strong> ${new Date(appointment.appointmentDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
              <p><strong>Type:</strong> ${appointment.type}</p>
            </div>
            
            <p><strong>What to prepare:</strong></p>
            <ul>
              <li>Test your ${appointment.type} connection</li>
              <li>Have your ID ready</li>
              <li>Prepare any questions you want to ask</li>
              <li>Gather any relevant medical documents</li>
            </ul>
            
            <a href="${process.env.FRONTEND_URL}/appointments/${appointment._id}" class="btn">Join Appointment</a>
          </div>
          <div class="footer">
            <p>HealthHive - Your Health, Our Priority</p>
            <p>Need to reschedule? Contact us at support@healthhive.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  prescriptionReady: (prescription, patient) => ({
    subject: 'Your Prescription is Ready - HealthHive',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background-color: #0288D1; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .prescription-box { background-color: #E8F5E8; border: 1px solid #4CAF50; padding: 15px; border-radius: 8px; margin: 20px 0; }
          .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #6B7280; }
          .btn { display: inline-block; padding: 12px 24px; background-color: #0288D1; color: white; text-decoration: none; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>HealthHive</h1>
            <h2>Prescription Ready</h2>
          </div>
          <div class="content">
            <div class="prescription-box">
              <h3>💊 Your prescription is ready for pickup or delivery!</h3>
            </div>
            
            <p>Dear ${patient.name},</p>
            <p>Your prescription has been processed and is ready.</p>
            
            <p><strong>Important:</strong> Please follow the dosage and instructions provided by your doctor.</p>
            
            <a href="${process.env.FRONTEND_URL}/prescriptions" class="btn">View Prescription</a>
          </div>
          <div class="footer">
            <p>HealthHive - Your Health, Our Priority</p>
            <p>Questions about your prescription? Contact us at support@healthhive.com</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

const sendEmail = async (to, template) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"HealthHive" <${process.env.SMTP_USER}>`,
      to: to,
      subject: template.subject,
      html: template.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

const emailService = {
  sendAppointmentConfirmation: async (appointment, doctor, patient) => {
    const template = emailTemplates.appointmentConfirmation(appointment, doctor, patient);
    return await sendEmail(patient.email, template);
  },

  sendAppointmentReminder: async (appointment, doctor, patient) => {
    const template = emailTemplates.appointmentReminder(appointment, doctor, patient);
    return await sendEmail(patient.email, template);
  },

  sendPrescriptionReady: async (prescription, patient) => {
    const template = emailTemplates.prescriptionReady(prescription, patient);
    return await sendEmail(patient.email, template);
  },

  sendCustomEmail: async (to, subject, htmlContent) => {
    const template = { subject, html: htmlContent };
    return await sendEmail(to, template);
  }
};

module.exports = emailService; 