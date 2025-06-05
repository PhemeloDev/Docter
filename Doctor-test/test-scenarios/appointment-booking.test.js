/**
 * HealthHive Appointment Booking Test Suite
 * 
 * This test suite validates the complete appointment booking workflow including:
 * 
 * 1. End-to-End Appointment Booking Flow
 * 2. Doctor Availability Validation
 * 3. Service Selection and Pricing
 * 4. Appointment Confirmation Process
 * 5. Cancellation and Rescheduling
 * 6. Time Slot Management
 */

// Import required testing dependencies
const request = require('supertest'); // HTTP assertion library for API testing
const { 
  createTestUser, 
  createTestDoctor, 
  createTestService,
  createTestAppointment,
  cleanupTestDatabase,
  createTestJWT,
  getTestData
} = require('../utils/database-helpers'); // Database helper functions

const apiClient = require('../utils/api-client'); // API client helper
const testConfig = require('../config/test-config'); // Test configuration

// Set API base URL for all requests
const API_URL = testConfig.api.baseUrl;

/**
 * Appointment Booking Test Suite
 * Groups all appointment booking related tests together
 */
describe('🗓️ Appointment Booking API Tests', () => {
  
  // Test data containers
  let testPatient, testDoctor, testService, authToken;

  /**
   * Setup: Runs before each individual test
   * Purpose: Creates consistent test data for each test
   */
  beforeEach(async () => {
    // Clean database to prevent test interference
    await cleanupTestDatabase();
    
    // Create test patient for booking appointments
    testPatient = await createTestUser({
      firstName: 'John',
      lastName: 'Patient',
      email: 'patient@booking.test',
      role: 'patient'
    });
    
    // Create test doctor with availability
    testDoctor = await createTestDoctor({
      firstName: 'Dr. Sarah',
      lastName: 'Cardiologist',
      email: 'doctor@booking.test',
      specialty: 'Cardiology',
      experience: 10,
      hourlyRate: 150,
      availability: [
        {
          day: 'Monday',
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true
        },
        {
          day: 'Tuesday', 
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true
        }
      ]
    });
    
    // Create test service
    testService = await createTestService({
      name: 'Cardiology Consultation',
      description: 'Complete cardiac examination and consultation',
      price: 15000, // $150.00 in cents
      duration: 45,
      category: 'Cardiology'
    });
    
    // Generate authentication token for patient
    authToken = createTestJWT(testPatient);
  });

  /**
   * Test Group: End-to-End Appointment Booking
   * Tests the complete booking workflow from service selection to confirmation
   */
  describe('📋 Complete Booking Workflow', () => {
    
    /**
     * TEST CASE: Successful Appointment Booking
     * 
     * This test validates the complete appointment booking process
     * from initial request to final confirmation
     */
    test('should complete full appointment booking workflow', async () => {
      // STEP 1: Patient retrieves available services
      const servicesResponse = await request(API_URL)
        .get('/services')                    // Get all available services
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // STEP 2: Validate services response structure
      expect(servicesResponse.body.success).toBe(true);
      expect(servicesResponse.body.services).toBeDefined();
      expect(Array.isArray(servicesResponse.body.services)).toBe(true);
      expect(servicesResponse.body.services.length).toBeGreaterThan(0);

      // STEP 3: Patient searches for doctors by specialty
      const doctorsResponse = await request(API_URL)
        .get('/doctors')                     // Get all doctors
        .query({ specialty: 'Cardiology' }) // Filter by specialty
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // STEP 4: Validate doctors response and availability
      expect(doctorsResponse.body.success).toBe(true);
      expect(doctorsResponse.body.doctors).toBeDefined();
      expect(doctorsResponse.body.doctors.length).toBeGreaterThan(0);
      
      const selectedDoctor = doctorsResponse.body.doctors[0];
      expect(selectedDoctor).toHaveCompleteDoctorProfile(); // Custom matcher
      expect(selectedDoctor.specialty).toBe('Cardiology');

      // STEP 5: Patient checks doctor's availability for specific date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0); // 10:00 AM tomorrow
      
      const availabilityResponse = await request(API_URL)
        .get(`/doctors/${selectedDoctor._id}/availability`)
        .query({ 
          date: tomorrow.toISOString().split('T')[0], // YYYY-MM-DD format
          duration: 45 // Required appointment duration
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // STEP 6: Validate availability response
      expect(availabilityResponse.body.success).toBe(true);
      expect(availabilityResponse.body.availableSlots).toBeDefined();
      expect(Array.isArray(availabilityResponse.body.availableSlots)).toBe(true);

      // STEP 7: Patient books appointment with selected time slot
      const appointmentData = {
        doctorId: selectedDoctor._id,           // Selected doctor
        serviceId: testService._id,             // Selected service
        scheduledDateTime: tomorrow.toISOString(), // Appointment date/time
        consultationType: 'video',              // Type of consultation
        symptoms: 'Chest pain and irregular heartbeat', // Patient symptoms
        notes: 'Patient reports symptoms for past week'  // Additional notes
      };

      const bookingResponse = await request(API_URL)
        .post('/appointments')               // Book appointment endpoint
        .send(appointmentData)               // Send booking data
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);                        // Expect successful creation

      // STEP 8: Validate successful booking response
      expect(bookingResponse.body.success).toBe(true);
      expect(bookingResponse.body.appointment).toBeDefined();
      expect(bookingResponse.body.appointment).toBeValidAppointment(); // Custom matcher

      const bookedAppointment = bookingResponse.body.appointment;
      expect(bookedAppointment.patient).toBe(testPatient._id.toString());
      expect(bookedAppointment.doctor).toBe(selectedDoctor._id);
      expect(bookedAppointment.service).toBe(testService.name);
      expect(bookedAppointment.status).toBe('scheduled');
      expect(bookedAppointment.consultationType).toBe('video');

      // STEP 9: Verify appointment appears in patient's appointment list
      const patientAppointmentsResponse = await request(API_URL)
        .get('/appointments')                // Get patient's appointments
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(patientAppointmentsResponse.body.success).toBe(true);
      expect(patientAppointmentsResponse.body.appointments.length).toBe(1);
      expect(patientAppointmentsResponse.body.appointments[0]._id).toBe(bookedAppointment._id);

      // STEP 10: Verify payment intent was created for the appointment
      expect(bookingResponse.body.paymentIntent).toBeDefined();
      expect(bookingResponse.body.paymentIntent.amount).toBe(testService.price);
      expect(bookingResponse.body.paymentIntent.currency).toBe('usd');
    });

    /**
     * TEST CASE: Booking with Invalid Doctor ID
     * 
     * This test ensures proper error handling when booking with non-existent doctor
     */
    test('should reject booking with invalid doctor ID', async () => {
      // STEP 1: Attempt to book with non-existent doctor ID
      const invalidBookingData = {
        doctorId: '507f1f77bcf86cd799439011', // Valid ObjectId format but non-existent
        serviceId: testService._id,
        scheduledDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        consultationType: 'video',
        symptoms: 'Test symptoms'
      };

      // STEP 2: Send booking request and expect failure
      const response = await request(API_URL)
        .post('/appointments')
        .send(invalidBookingData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);                        // Expect not found error

      // STEP 3: Validate error response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/doctor not found|invalid doctor/i);
    });

    /**
     * TEST CASE: Booking Outside Doctor's Available Hours
     * 
     * This test validates that appointments cannot be booked outside doctor's availability
     */
    test('should reject booking outside available hours', async () => {
      // STEP 1: Attempt to book appointment at 8:00 AM (before doctor's 9:00 AM start time)
      const earlyTime = new Date();
      earlyTime.setDate(earlyTime.getDate() + 1); // Tomorrow
      earlyTime.setHours(8, 0, 0, 0); // 8:00 AM (outside availability)

      const outOfHoursBooking = {
        doctorId: testDoctor._id,
        serviceId: testService._id,
        scheduledDateTime: earlyTime.toISOString(),
        consultationType: 'video',
        symptoms: 'Test symptoms'
      };

      // STEP 2: Send request and expect validation error
      const response = await request(API_URL)
        .post('/appointments')
        .send(outOfHoursBooking)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);                        // Expect bad request

      // STEP 3: Validate availability error message
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not available|outside hours|availability/i);
    });
  });

  /**
   * Test Group: Appointment Management
   * Tests appointment viewing, updating, and cancellation
   */
  describe('📅 Appointment Management', () => {
    
    let existingAppointment;

    /**
     * Setup: Create an existing appointment for management tests
     */
    beforeEach(async () => {
      // Create a test appointment
      const appointmentTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      appointmentTime.setHours(10, 0, 0, 0);

      existingAppointment = await createTestAppointment(
        {
          service: testService.name,
          scheduledDateTime: appointmentTime,
          consultationType: 'video',
          status: 'scheduled',
          symptoms: 'Test symptoms for management'
        },
        testPatient._id,
        testDoctor._id
      );
    });

    /**
     * TEST CASE: View Appointment Details
     * 
     * This test validates retrieval of specific appointment details
     */
    test('should retrieve appointment details successfully', async () => {
      // STEP 1: Request specific appointment details
      const response = await request(API_URL)
        .get(`/appointments/${existingAppointment._id}`) // Get specific appointment
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // STEP 2: Validate appointment details response
      expect(response.body.success).toBe(true);
      expect(response.body.appointment).toBeDefined();
      expect(response.body.appointment).toBeValidAppointment(); // Custom matcher

      const appointment = response.body.appointment;
      expect(appointment._id).toBe(existingAppointment._id.toString());
      expect(appointment.patient).toBe(testPatient._id.toString());
      expect(appointment.doctor).toBe(testDoctor._id.toString());
      expect(appointment.service).toBe(testService.name);
      expect(appointment.status).toBe('scheduled');
    });

    /**
     * TEST CASE: Cancel Appointment
     * 
     * This test validates the appointment cancellation process
     */
    test('should cancel appointment successfully', async () => {
      // STEP 1: Cancel the existing appointment
      const cancellationData = {
        reason: 'Patient scheduling conflict - need to reschedule'
      };

      const response = await request(API_URL)
        .put(`/appointments/${existingAppointment._id}/cancel`) // Cancel endpoint
        .send(cancellationData)              // Send cancellation reason
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // STEP 2: Validate cancellation response
      expect(response.body.success).toBe(true);
      expect(response.body.appointment).toBeDefined();
      expect(response.body.appointment.status).toBe('cancelled');
      expect(response.body.appointment.cancellationReason).toBe(cancellationData.reason);

      // STEP 3: Verify appointment status in database
      const updatedAppointments = await getTestData('appointments', { 
        _id: existingAppointment._id 
      });
      expect(updatedAppointments[0].status).toBe('cancelled');
    });

    /**
     * TEST CASE: Reschedule Appointment
     * 
     * This test validates appointment rescheduling functionality
     */
    test('should reschedule appointment successfully', async () => {
      // STEP 1: Prepare new appointment time (2 days from now)
      const newTime = new Date(Date.now() + 48 * 60 * 60 * 1000);
      newTime.setHours(14, 0, 0, 0); // 2:00 PM

      const rescheduleData = {
        newDateTime: newTime.toISOString(),
        reason: 'Patient requested later time slot'
      };

      // STEP 2: Send reschedule request
      const response = await request(API_URL)
        .put(`/appointments/${existingAppointment._id}/reschedule`)
        .send(rescheduleData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // STEP 3: Validate rescheduling response
      expect(response.body.success).toBe(true);
      expect(response.body.appointment).toBeDefined();
      expect(response.body.appointment.scheduledDateTime).toBe(newTime.toISOString());
      expect(response.body.appointment.status).toBe('rescheduled');

      // STEP 4: Verify new time slot availability
      expect(response.body.appointment.originalDateTime).toBe(existingAppointment.scheduledDateTime.toISOString());
    });
  });

  /**
   * Test Group: Doctor Availability Management
   * Tests doctor availability checking and time slot management
   */
  describe('⏰ Doctor Availability', () => {
    
    /**
     * TEST CASE: Check Available Time Slots
     * 
     * This test validates retrieval of available appointment slots for a doctor
     */
    test('should return available time slots for doctor', async () => {
      // STEP 1: Request available slots for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const response = await request(API_URL)
        .get(`/doctors/${testDoctor._id}/availability`)
        .query({
          date: tomorrow.toISOString().split('T')[0], // Date in YYYY-MM-DD format
          duration: 30  // 30-minute appointment slots
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // STEP 2: Validate availability response structure
      expect(response.body.success).toBe(true);
      expect(response.body.availableSlots).toBeDefined();
      expect(Array.isArray(response.body.availableSlots)).toBe(true);

      // STEP 3: Validate individual time slot structure
      if (response.body.availableSlots.length > 0) {
        const slot = response.body.availableSlots[0];
        expect(slot.startTime).toBeDefined();
        expect(slot.endTime).toBeDefined();
        expect(slot.isAvailable).toBe(true);
        expect(new Date(slot.startTime)).toBeInstanceOf(Date);
        expect(new Date(slot.endTime)).toBeInstanceOf(Date);
      }
    });

    /**
     * TEST CASE: Block Time Slots After Booking
     * 
     * This test ensures that booked time slots are no longer available
     */
    test('should block time slots after appointment booking', async () => {
      // STEP 1: Check initial availability
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      const initialAvailability = await request(API_URL)
        .get(`/doctors/${testDoctor._id}/availability`)
        .query({ 
          date: tomorrow.toISOString().split('T')[0],
          duration: 45
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const initialSlotCount = initialAvailability.body.availableSlots.length;

      // STEP 2: Book an appointment for 10:00 AM
      const bookingData = {
        doctorId: testDoctor._id,
        serviceId: testService._id,
        scheduledDateTime: tomorrow.toISOString(),
        consultationType: 'video',
        symptoms: 'Test booking for availability check'
      };

      await request(API_URL)
        .post('/appointments')
        .send(bookingData)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      // STEP 3: Check availability after booking
      const afterBookingAvailability = await request(API_URL)
        .get(`/doctors/${testDoctor._id}/availability`)
        .query({ 
          date: tomorrow.toISOString().split('T')[0],
          duration: 45
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // STEP 4: Validate that availability has decreased
      const afterSlotCount = afterBookingAvailability.body.availableSlots.length;
      expect(afterSlotCount).toBeLessThan(initialSlotCount);

      // STEP 5: Verify the 10:00 AM slot is no longer available
      const unavailableSlot = afterBookingAvailability.body.availableSlots.find(slot => {
        const slotTime = new Date(slot.startTime);
        return slotTime.getHours() === 10 && slotTime.getMinutes() === 0;
      });
      expect(unavailableSlot).toBeUndefined();
    });
  });

  /**
   * Test Group: Appointment Validation
   * Tests various validation scenarios for appointment booking
   */
  describe('✅ Booking Validation', () => {
    
    /**
     * TEST CASE: Prevent Double Booking
     * 
     * This test ensures patients cannot book multiple appointments at the same time
     */
    test('should prevent patient from double booking same time slot', async () => {
      // STEP 1: Book first appointment
      const appointmentTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      appointmentTime.setHours(11, 0, 0, 0);

      const firstBooking = {
        doctorId: testDoctor._id,
        serviceId: testService._id,
        scheduledDateTime: appointmentTime.toISOString(),
        consultationType: 'video',
        symptoms: 'First appointment'
      };

      await request(API_URL)
        .post('/appointments')
        .send(firstBooking)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      // STEP 2: Attempt to book second appointment at same time
      const duplicateBooking = {
        doctorId: testDoctor._id,
        serviceId: testService._id,
        scheduledDateTime: appointmentTime.toISOString(), // Same time
        consultationType: 'chat',
        symptoms: 'Duplicate appointment attempt'
      };

      // STEP 3: Expect conflict error
      const response = await request(API_URL)
        .post('/appointments')
        .send(duplicateBooking)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(409);                        // Expect conflict

      // STEP 4: Validate error message
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/already booked|conflict|unavailable/i);
    });

    /**
     * TEST CASE: Minimum Booking Notice Validation
     * 
     * This test ensures appointments cannot be booked too close to current time
     */
    test('should enforce minimum booking notice period', async () => {
      // STEP 1: Attempt to book appointment in 30 minutes (too soon)
      const tooSoon = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

      const lastMinuteBooking = {
        doctorId: testDoctor._id,
        serviceId: testService._id,
        scheduledDateTime: tooSoon.toISOString(),
        consultationType: 'video',
        symptoms: 'Emergency appointment request'
      };

      // STEP 2: Send request and expect validation error
      const response = await request(API_URL)
        .post('/appointments')
        .send(lastMinuteBooking)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      // STEP 3: Validate minimum notice error
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/minimum notice|advance booking|too soon/i);
    });

    /**
     * TEST CASE: Maximum Booking Advance Validation
     * 
     * This test ensures appointments cannot be booked too far in advance
     */
    test('should enforce maximum booking advance period', async () => {
      // STEP 1: Attempt to book appointment 6 months in advance
      const tooFar = new Date();
      tooFar.setMonth(tooFar.getMonth() + 6); // 6 months from now

      const advanceBooking = {
        doctorId: testDoctor._id,
        serviceId: testService._id,
        scheduledDateTime: tooFar.toISOString(),
        consultationType: 'video',
        symptoms: 'Far advance booking'
      };

      // STEP 2: Send request and expect validation error
      const response = await request(API_URL)
        .post('/appointments')
        .send(advanceBooking)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      // STEP 3: Validate maximum advance error
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/maximum advance|too far|booking window/i);
    });
  });
}); 