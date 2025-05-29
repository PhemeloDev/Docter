const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify user owns this appointment
    if (appointment.patient.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(appointment.payment.amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        appointmentId: appointmentId,
        userId: req.user.userId
      }
    });

    // Update appointment with payment intent ID
    appointment.payment.paymentIntentId = paymentIntent.id;
    await appointment.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Payment setup failed' });
  }
});

// Confirm payment
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, appointmentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update appointment payment status
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          'payment.status': 'completed',
          'payment.transactionId': paymentIntent.id,
          status: 'confirmed'
        },
        { new: true }
      );

      res.json({
        success: true,
        appointment,
        paymentStatus: paymentIntent.status
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment not completed',
        paymentStatus: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Payment confirmation failed' });
  }
});

// Handle Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const appointmentId = paymentIntent.metadata.appointmentId;
      
      if (appointmentId) {
        await Appointment.findByIdAndUpdate(appointmentId, {
          'payment.status': 'completed',
          'payment.transactionId': paymentIntent.id,
          status: 'confirmed'
        });
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      const failedAppointmentId = failedPayment.metadata.appointmentId;
      
      if (failedAppointmentId) {
        await Appointment.findByIdAndUpdate(failedAppointmentId, {
          'payment.status': 'failed'
        });
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patient: req.user.userId,
      'payment.status': 'completed'
    })
    .populate('doctor', 'user')
    .populate('service', 'name')
    .sort({ createdAt: -1 })
    .select('appointmentDate payment createdAt');

    res.json(appointments);
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process refund
router.post('/refund', auth, async (req, res) => {
  try {
    const { appointmentId, reason } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify user owns this appointment or is the doctor
    if (appointment.patient.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (appointment.payment.status !== 'completed') {
      return res.status(400).json({ message: 'No payment to refund' });
    }

    // Process refund with Stripe
    const refund = await stripe.refunds.create({
      payment_intent: appointment.payment.paymentIntentId,
      reason: 'requested_by_customer',
      metadata: {
        appointmentId: appointmentId,
        reason: reason
      }
    });

    // Update appointment
    appointment.payment.status = 'refunded';
    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      refundId: refund.id,
      amount: refund.amount / 100
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Refund processing failed' });
  }
});

module.exports = router; 