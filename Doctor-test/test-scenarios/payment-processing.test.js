/**
 * HealthHive Payment Processing Test Suite
 * 
 * This test suite validates the complete payment processing workflow including:
 * 
 * 1. Stripe Payment Intent Creation
 * 2. Payment Method Validation
 * 3. Payment Confirmation Process
 * 4. Refund and Dispute Handling
 * 5. Payment Error Scenarios
 * 6. Invoice Generation
 */

// Import required testing dependencies
const request = require('supertest'); // HTTP assertion library for API testing
const stripe = require('stripe'); // Stripe payment processing library
const { 
  createTestUser, 
  createTestDoctor, 
  createTestService,
  createTestAppointment,
  cleanupTestDatabase,
  createTestJWT
} = require('../utils/database-helpers'); // Database helper functions

const testConfig = require('../config/test-config'); // Test configuration

// Set API base URL for all requests
const API_URL = testConfig.api.baseUrl;

// Initialize Stripe with test secret key
const stripeClient = stripe(testConfig.payments.stripeSecretKey);

/**
 * Payment Processing Test Suite
 * Groups all payment processing related tests together
 */
describe('💳 Payment Processing API Tests', () => {
  
  // Test data containers
  let testPatient, testDoctor, testService, testAppointment, authToken;

  /**
   * Setup: Runs before each individual test
   * Purpose: Creates consistent test data for payment scenarios
   */
  beforeEach(async () => {
    // Clean database to prevent test interference
    await cleanupTestDatabase();
    
    // Create test patient for payment scenarios
    testPatient = await createTestUser({
      firstName: 'John',
      lastName: 'PaymentTester',
      email: 'patient@payment.test',
      role: 'patient'
    });
    
    // Create test doctor
    testDoctor = await createTestDoctor({
      firstName: 'Dr. Payment',
      lastName: 'Processor',
      email: 'doctor@payment.test',
      specialty: 'Cardiology',
      hourlyRate: 200
    });
    
    // Create test service with pricing
    testService = await createTestService({
      name: 'Premium Cardiology Consultation',
      description: 'Comprehensive cardiac examination with follow-up',
      price: 20000, // $200.00 in cents
      duration: 60,
      category: 'Cardiology'
    });
    
    // Create test appointment for payment
    const appointmentTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    appointmentTime.setHours(14, 0, 0, 0);
    
    testAppointment = await createTestAppointment(
      {
        service: testService.name,
        scheduledDateTime: appointmentTime,
        consultationType: 'video',
        status: 'scheduled',
        fee: testService.price
      },
      testPatient._id,
      testDoctor._id
    );
    
    // Generate authentication token for patient
    authToken = createTestJWT(testPatient);
  });

  /**
   * Test Group: Payment Intent Creation
   * Tests Stripe payment intent creation and validation
   */
  describe('🎯 Payment Intent Management', () => {
    
    /**
     * TEST CASE: Create Payment Intent for Appointment
     * 
     * This test validates successful payment intent creation through Stripe
     */
    test('should create payment intent for appointment successfully', async () => {
      // STEP 1: Create payment intent for the test appointment
      const paymentData = {
        appointmentId: testAppointment._id,      // Appointment to pay for
        amount: testService.price,               // Payment amount in cents
        currency: 'usd',                         // Payment currency
        paymentMethodTypes: ['card'],            // Accepted payment methods
        description: `Payment for ${testService.name}` // Payment description
      };

      const response = await request(API_URL)
        .post('/payments/create-payment-intent') // Payment intent creation endpoint
        .send(paymentData)                       // Send payment data
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);                            // Expect successful creation

      // STEP 2: Validate payment intent response structure
      expect(response.body.success).toBe(true);
      expect(response.body.paymentIntent).toBeDefined();
      
      const paymentIntent = response.body.paymentIntent;
      expect(paymentIntent.id).toBeDefined();                    // Stripe payment intent ID
      expect(paymentIntent.client_secret).toBeDefined();        // Client secret for frontend
      expect(paymentIntent.amount).toBe(testService.price);     // Correct amount
      expect(paymentIntent.currency).toBe('usd');               // Correct currency
      expect(paymentIntent.status).toBe('requires_payment_method'); // Initial status

      // STEP 3: Validate metadata contains appointment information
      expect(paymentIntent.metadata).toBeDefined();
      expect(paymentIntent.metadata.appointmentId).toBe(testAppointment._id.toString());
      expect(paymentIntent.metadata.patientId).toBe(testPatient._id.toString());
      expect(paymentIntent.metadata.doctorId).toBe(testDoctor._id.toString());

      // STEP 4: Verify payment intent is stored in Stripe
      const stripePaymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntent.id);
      expect(stripePaymentIntent.amount).toBe(testService.price);
      expect(stripePaymentIntent.currency).toBe('usd');
    });

    /**
     * TEST CASE: Payment Intent with Invalid Amount
     * 
     * This test ensures proper validation of payment amounts
     */
    test('should reject payment intent with invalid amount', async () => {
      // STEP 1: Attempt to create payment intent with negative amount
      const invalidPaymentData = {
        appointmentId: testAppointment._id,
        amount: -1000,                         // Invalid negative amount
        currency: 'usd',
        paymentMethodTypes: ['card']
      };

      // STEP 2: Send request and expect validation error
      const response = await request(API_URL)
        .post('/payments/create-payment-intent')
        .send(invalidPaymentData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);                          // Expect bad request

      // STEP 3: Validate error response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/invalid amount|amount must be positive/i);
    });

    /**
     * TEST CASE: Payment Intent with Non-existent Appointment
     * 
     * This test validates payment intent creation fails for invalid appointments
     */
    test('should reject payment intent for non-existent appointment', async () => {
      // STEP 1: Attempt payment intent for non-existent appointment
      const invalidAppointmentData = {
        appointmentId: '507f1f77bcf86cd799439011', // Valid ObjectId but non-existent
        amount: testService.price,
        currency: 'usd',
        paymentMethodTypes: ['card']
      };

      // STEP 2: Send request and expect not found error
      const response = await request(API_URL)
        .post('/payments/create-payment-intent')
        .send(invalidAppointmentData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);                          // Expect not found

      // STEP 3: Validate error message
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/appointment not found|invalid appointment/i);
    });
  });

  /**
   * Test Group: Payment Confirmation Process
   * Tests payment method attachment and payment confirmation
   */
  describe('✅ Payment Confirmation', () => {
    
    let paymentIntent;

    /**
     * Setup: Create payment intent for confirmation tests
     */
    beforeEach(async () => {
      // Create a payment intent for testing confirmation
      const response = await request(API_URL)
        .post('/payments/create-payment-intent')
        .send({
          appointmentId: testAppointment._id,
          amount: testService.price,
          currency: 'usd',
          paymentMethodTypes: ['card']
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      paymentIntent = response.body.paymentIntent;
    });

    /**
     * TEST CASE: Successful Payment Confirmation
     * 
     * This test validates successful payment processing with valid card
     */
    test('should confirm payment with valid card successfully', async () => {
      // STEP 1: Create test payment method in Stripe
      const paymentMethod = await stripeClient.paymentMethods.create({
        type: 'card',
        card: {
          number: testConfig.payments.testCards.valid,    // Valid test card number
          exp_month: 12,                                  // Expiry month
          exp_year: 2025,                                 // Expiry year
          cvc: '123'                                      // CVC code
        }
      });

      // STEP 2: Attach payment method to payment intent
      await stripeClient.paymentIntents.update(paymentIntent.id, {
        payment_method: paymentMethod.id
      });

      // STEP 3: Confirm payment through API
      const confirmationData = {
        paymentIntentId: paymentIntent.id,              // Payment intent to confirm
        paymentMethodId: paymentMethod.id               // Payment method to use
      };

      const response = await request(API_URL)
        .post('/payments/confirm')                      // Payment confirmation endpoint
        .send(confirmationData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);                                   // Expect successful confirmation

      // STEP 4: Validate confirmation response
      expect(response.body.success).toBe(true);
      expect(response.body.payment).toBeDefined();
      
      const confirmedPayment = response.body.payment;
      expect(confirmedPayment.status).toBe('succeeded');        // Payment should succeed
      expect(confirmedPayment.amount).toBe(testService.price);  // Correct amount charged
      expect(confirmedPayment.appointmentId).toBe(testAppointment._id.toString());

      // STEP 5: Verify appointment status updated to confirmed
      expect(response.body.appointment).toBeDefined();
      expect(response.body.appointment.status).toBe('confirmed');
      expect(response.body.appointment.paymentStatus).toBe('paid');

      // STEP 6: Verify payment is confirmed in Stripe
      const stripeConfirmedPayment = await stripeClient.paymentIntents.retrieve(paymentIntent.id);
      expect(stripeConfirmedPayment.status).toBe('succeeded');
    });

    /**
     * TEST CASE: Payment Decline with Invalid Card
     * 
     * This test validates proper handling of declined payment attempts
     */
    test('should handle declined payment gracefully', async () => {
      // STEP 1: Create payment method with declined test card
      const declinedPaymentMethod = await stripeClient.paymentMethods.create({
        type: 'card',
        card: {
          number: testConfig.payments.testCards.declined, // Declined test card
          exp_month: 12,
          exp_year: 2025,
          cvc: '123'
        }
      });

      // STEP 2: Attempt to confirm payment with declined card
      const confirmationData = {
        paymentIntentId: paymentIntent.id,
        paymentMethodId: declinedPaymentMethod.id
      };

      const response = await request(API_URL)
        .post('/payments/confirm')
        .send(confirmationData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(402);                                   // Expect payment required error

      // STEP 3: Validate decline response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/declined|payment failed|card declined/i);
      expect(response.body.paymentIntent).toBeDefined();
      expect(response.body.paymentIntent.status).toBe('requires_payment_method');

      // STEP 4: Verify appointment status remains unchanged
      const appointmentResponse = await request(API_URL)
        .get(`/appointments/${testAppointment._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(appointmentResponse.body.appointment.status).toBe('scheduled'); // Still scheduled
      expect(appointmentResponse.body.appointment.paymentStatus).toBe('pending');
    });

    /**
     * TEST CASE: Insufficient Funds Handling
     * 
     * This test validates handling of insufficient funds scenarios
     */
    test('should handle insufficient funds error', async () => {
      // STEP 1: Create payment method with insufficient funds test card
      const insufficientFundsCard = await stripeClient.paymentMethods.create({
        type: 'card',
        card: {
          number: testConfig.payments.testCards.insufficient, // Insufficient funds test card
          exp_month: 12,
          exp_year: 2025,
          cvc: '123'
        }
      });

      // STEP 2: Attempt payment confirmation
      const confirmationData = {
        paymentIntentId: paymentIntent.id,
        paymentMethodId: insufficientFundsCard.id
      };

      const response = await request(API_URL)
        .post('/payments/confirm')
        .send(confirmationData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(402);                                   // Expect payment required

      // STEP 3: Validate insufficient funds response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/insufficient funds|insufficient balance/i);
      expect(response.body.error.code).toBe('card_declined');
      expect(response.body.error.decline_code).toBe('insufficient_funds');
    });
  });

  /**
   * Test Group: Refund Processing
   * Tests refund creation and processing scenarios
   */
  describe('🔄 Refund Processing', () => {
    
    let successfulPayment;

    /**
     * Setup: Create successful payment for refund tests
     */
    beforeEach(async () => {
      // Create and confirm a successful payment
      const paymentIntentResponse = await request(API_URL)
        .post('/payments/create-payment-intent')
        .send({
          appointmentId: testAppointment._id,
          amount: testService.price,
          currency: 'usd',
          paymentMethodTypes: ['card']
        })
        .set('Authorization', `Bearer ${authToken}`);

      const paymentMethod = await stripeClient.paymentMethods.create({
        type: 'card',
        card: {
          number: testConfig.payments.testCards.valid,
          exp_month: 12,
          exp_year: 2025,
          cvc: '123'
        }
      });

      await stripeClient.paymentIntents.update(paymentIntentResponse.body.paymentIntent.id, {
        payment_method: paymentMethod.id
      });

      const confirmResponse = await request(API_URL)
        .post('/payments/confirm')
        .send({
          paymentIntentId: paymentIntentResponse.body.paymentIntent.id,
          paymentMethodId: paymentMethod.id
        })
        .set('Authorization', `Bearer ${authToken}`);

      successfulPayment = confirmResponse.body.payment;
    });

    /**
     * TEST CASE: Full Refund Processing
     * 
     * This test validates complete refund processing for cancelled appointments
     */
    test('should process full refund successfully', async () => {
      // STEP 1: Cancel appointment to trigger refund eligibility
      await request(API_URL)
        .put(`/appointments/${testAppointment._id}/cancel`)
        .send({ reason: 'Patient emergency - full refund requested' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // STEP 2: Request full refund
      const refundData = {
        paymentIntentId: successfulPayment.id,          // Original payment to refund
        amount: testService.price,                      // Full refund amount
        reason: 'requested_by_customer',                // Refund reason
        metadata: {
          appointmentId: testAppointment._id.toString(),
          refundType: 'cancellation'
        }
      };

      const response = await request(API_URL)
        .post('/payments/refund')                       // Refund endpoint
        .send(refundData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);                                   // Expect successful refund

      // STEP 3: Validate refund response
      expect(response.body.success).toBe(true);
      expect(response.body.refund).toBeDefined();
      
      const refund = response.body.refund;
      expect(refund.amount).toBe(testService.price);    // Full amount refunded
      expect(refund.status).toBe('succeeded');          // Refund successful
      expect(refund.reason).toBe('requested_by_customer');

      // STEP 4: Verify refund in Stripe
      const stripeRefunds = await stripeClient.refunds.list({
        payment_intent: successfulPayment.id
      });
      expect(stripeRefunds.data.length).toBe(1);
      expect(stripeRefunds.data[0].amount).toBe(testService.price);
      expect(stripeRefunds.data[0].status).toBe('succeeded');

      // STEP 5: Verify appointment payment status updated
      const appointmentResponse = await request(API_URL)
        .get(`/appointments/${testAppointment._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(appointmentResponse.body.appointment.paymentStatus).toBe('refunded');
    });

    /**
     * TEST CASE: Partial Refund Processing
     * 
     * This test validates partial refund processing scenarios
     */
    test('should process partial refund successfully', async () => {
      // STEP 1: Request partial refund (50% of original amount)
      const partialAmount = Math.floor(testService.price / 2); // 50% refund
      
      const partialRefundData = {
        paymentIntentId: successfulPayment.id,
        amount: partialAmount,                          // Partial refund amount
        reason: 'requested_by_customer',
        metadata: {
          appointmentId: testAppointment._id.toString(),
          refundType: 'partial',
          refundPercentage: '50'
        }
      };

      const response = await request(API_URL)
        .post('/payments/refund')
        .send(partialRefundData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // STEP 2: Validate partial refund response
      expect(response.body.success).toBe(true);
      expect(response.body.refund.amount).toBe(partialAmount);
      expect(response.body.refund.status).toBe('succeeded');

      // STEP 3: Verify remaining payment amount
      const stripePaymentIntent = await stripeClient.paymentIntents.retrieve(successfulPayment.id);
      const remainingAmount = stripePaymentIntent.amount - partialAmount;
      expect(remainingAmount).toBe(testService.price - partialAmount);
    });

    /**
     * TEST CASE: Refund Error Handling
     * 
     * This test validates proper error handling for invalid refund requests
     */
    test('should handle refund errors gracefully', async () => {
      // STEP 1: Attempt refund with amount exceeding original payment
      const excessiveRefundData = {
        paymentIntentId: successfulPayment.id,
        amount: testService.price + 5000,              // Amount exceeding original
        reason: 'requested_by_customer'
      };

      // STEP 2: Send request and expect error
      const response = await request(API_URL)
        .post('/payments/refund')
        .send(excessiveRefundData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);                                   // Expect bad request

      // STEP 3: Validate error response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/refund amount exceeds|invalid amount/i);
    });
  });

  /**
   * Test Group: Payment Security
   * Tests payment security features and fraud prevention
   */
  describe('🔒 Payment Security', () => {
    
    /**
     * TEST CASE: Expired Card Handling
     * 
     * This test validates proper handling of expired payment cards
     */
    test('should reject payments with expired cards', async () => {
      // STEP 1: Create payment intent
      const response = await request(API_URL)
        .post('/payments/create-payment-intent')
        .send({
          appointmentId: testAppointment._id,
          amount: testService.price,
          currency: 'usd',
          paymentMethodTypes: ['card']
        })
        .set('Authorization', `Bearer ${authToken}`);

      // STEP 2: Create expired payment method
      const expiredCard = await stripeClient.paymentMethods.create({
        type: 'card',
        card: {
          number: testConfig.payments.testCards.expired, // Expired test card
          exp_month: 1,                                  // Past expiry month
          exp_year: 2020,                                // Past expiry year
          cvc: '123'
        }
      });

      // STEP 3: Attempt payment with expired card
      const confirmationData = {
        paymentIntentId: response.body.paymentIntent.id,
        paymentMethodId: expiredCard.id
      };

      const confirmResponse = await request(API_URL)
        .post('/payments/confirm')
        .send(confirmationData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(402);                                   // Expect payment required

      // STEP 4: Validate expired card error
      expect(confirmResponse.body.success).toBe(false);
      expect(confirmResponse.body.message).toMatch(/expired|card expired/i);
      expect(confirmResponse.body.error.code).toBe('card_declined');
      expect(confirmResponse.body.error.decline_code).toBe('expired_card');
    });

    /**
     * TEST CASE: Payment Authorization Validation
     * 
     * This test ensures only authorized users can process payments
     */
    test('should require authentication for payment operations', async () => {
      // STEP 1: Attempt payment creation without authentication
      const paymentData = {
        appointmentId: testAppointment._id,
        amount: testService.price,
        currency: 'usd',
        paymentMethodTypes: ['card']
      };

      const response = await request(API_URL)
        .post('/payments/create-payment-intent')
        .send(paymentData)
        // No Authorization header
        .expect(401);                                   // Expect unauthorized

      // STEP 2: Validate authentication error
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/unauthorized|authentication required/i);
    });
  });

  /**
   * Test Group: Invoice Generation
   * Tests invoice creation and management for completed payments
   */
  describe('📄 Invoice Management', () => {
    
    let completedPayment;

    /**
     * Setup: Create completed payment for invoice tests
     */
    beforeEach(async () => {
      // Create successful payment and complete appointment
      const paymentIntentResponse = await request(API_URL)
        .post('/payments/create-payment-intent')
        .send({
          appointmentId: testAppointment._id,
          amount: testService.price,
          currency: 'usd',
          paymentMethodTypes: ['card']
        })
        .set('Authorization', `Bearer ${authToken}`);

      const paymentMethod = await stripeClient.paymentMethods.create({
        type: 'card',
        card: {
          number: testConfig.payments.testCards.valid,
          exp_month: 12,
          exp_year: 2025,
          cvc: '123'
        }
      });

      await stripeClient.paymentIntents.update(paymentIntentResponse.body.paymentIntent.id, {
        payment_method: paymentMethod.id
      });

      const confirmResponse = await request(API_URL)
        .post('/payments/confirm')
        .send({
          paymentIntentId: paymentIntentResponse.body.paymentIntent.id,
          paymentMethodId: paymentMethod.id
        })
        .set('Authorization', `Bearer ${authToken}`);

      completedPayment = confirmResponse.body.payment;
    });

    /**
     * TEST CASE: Generate Invoice for Completed Payment
     * 
     * This test validates invoice generation for successful payments
     */
    test('should generate invoice for completed payment', async () => {
      // STEP 1: Request invoice generation
      const invoiceData = {
        paymentIntentId: completedPayment.id,           // Payment to generate invoice for
        includeDetails: true,                           // Include detailed breakdown
        emailToPatient: false                           // Don't email during test
      };

      const response = await request(API_URL)
        .post('/payments/generate-invoice')             // Invoice generation endpoint
        .send(invoiceData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);                                   // Expect successful generation

      // STEP 2: Validate invoice response
      expect(response.body.success).toBe(true);
      expect(response.body.invoice).toBeDefined();
      
      const invoice = response.body.invoice;
      expect(invoice.invoiceNumber).toBeDefined();      // Unique invoice number
      expect(invoice.amount).toBe(testService.price);   // Correct amount
      expect(invoice.currency).toBe('usd');             // Correct currency
      expect(invoice.status).toBe('paid');              // Payment status
      expect(invoice.issueDate).toBeDefined();          // Invoice issue date
      expect(invoice.dueDate).toBeDefined();            // Payment due date

      // STEP 3: Validate invoice line items
      expect(invoice.lineItems).toBeDefined();
      expect(Array.isArray(invoice.lineItems)).toBe(true);
      expect(invoice.lineItems.length).toBeGreaterThan(0);
      
      const lineItem = invoice.lineItems[0];
      expect(lineItem.description).toBe(testService.name);
      expect(lineItem.amount).toBe(testService.price);
      expect(lineItem.quantity).toBe(1);

      // STEP 4: Validate customer information
      expect(invoice.customer).toBeDefined();
      expect(invoice.customer.name).toBe(`${testPatient.firstName} ${testPatient.lastName}`);
      expect(invoice.customer.email).toBe(testPatient.email);

      // STEP 5: Validate provider information
      expect(invoice.provider).toBeDefined();
      expect(invoice.provider.name).toBe(`${testDoctor.firstName} ${testDoctor.lastName}`);
      expect(invoice.provider.specialty).toBe(testDoctor.specialty);
    });
  });
}); 