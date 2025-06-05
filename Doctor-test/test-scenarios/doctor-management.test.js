/**
 * HealthHive Doctor Management Test Suite
 * 
 * This test suite validates the doctor management functionality including:
 * 
 * 1. Doctor Profile Creation and Management
 * 2. Doctor Verification Process
 * 3. Availability Schedule Management
 * 4. Doctor Search and Filtering
 * 5. Profile Update and Validation
 * 6. Doctor Analytics and Statistics
 */

// Import required testing dependencies
const request = require('supertest'); // HTTP assertion library for API testing
const { 
  createTestUser, 
  createTestDoctor, 
  createTestService,
  cleanupTestDatabase,
  createTestJWT,
  getTestData
} = require('../utils/database-helpers'); // Database helper functions

const testConfig = require('../config/test-config'); // Test configuration

// Set API base URL for all requests
const API_URL = testConfig.api.baseUrl;

/**
 * Doctor Management Test Suite
 * Groups all doctor management related tests together
 */
describe('👨‍⚕️ Doctor Management API Tests', () => {
  
  // Test data containers
  let testDoctor, testPatient, doctorAuthToken, patientAuthToken;

  /**
   * Setup: Runs before each individual test
   * Purpose: Creates consistent test data for doctor management scenarios
   */
  beforeEach(async () => {
    // Clean database to prevent test interference
    await cleanupTestDatabase();
    
    // Create test doctor for management scenarios
    testDoctor = await createTestDoctor({
      firstName: 'Dr. John',
      lastName: 'TestDoctor',
      email: 'doctor@management.test',
      specialty: 'General Medicine',
      experience: 5,
      hourlyRate: 120,
      profileCompleted: false, // Start with incomplete profile for testing
      verificationStatus: 'pending'
    });
    
    // Create test patient for doctor search scenarios
    testPatient = await createTestUser({
      firstName: 'Test',
      lastName: 'Patient',
      email: 'patient@management.test',
      role: 'patient'
    });
    
    // Generate authentication tokens
    doctorAuthToken = createTestJWT(testDoctor);
    patientAuthToken = createTestJWT(testPatient);
  });

  /**
   * Test Group: Doctor Profile Management
   * Tests doctor profile creation, updates, and validation
   */
  describe('📋 Doctor Profile Management', () => {
    
    /**
     * TEST CASE: Complete Doctor Profile Setup
     * 
     * This test validates the process of completing a doctor's profile
     * with all required information for platform verification
     */
    test('should complete doctor profile with all required information', async () => {
      // STEP 1: Get current incomplete profile
      const currentProfileResponse = await request(API_URL)
        .get('/auth/profile')                          // Get current profile
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);

      // STEP 2: Validate current profile is incomplete
      expect(currentProfileResponse.body.user.profileCompleted).toBe(false);
      expect(currentProfileResponse.body.user.verificationStatus).toBe('pending');

      // STEP 3: Complete profile with comprehensive information
      const completeProfileData = {
        bio: 'Experienced general medicine physician with focus on preventive care and chronic disease management.',
        education: [
          {
            degree: 'MD',
            institution: 'Johns Hopkins University School of Medicine',
            year: 2018,
            verified: false
          },
          {
            degree: 'Residency - Internal Medicine',
            institution: 'Mayo Clinic',
            year: 2021,
            verified: false
          }
        ],
        certifications: [
          'Board Certified Internal Medicine',
          'Basic Life Support (BLS)',
          'Advanced Cardiovascular Life Support (ACLS)'
        ],
        languages: ['English', 'Spanish'],
        acceptedInsurance: [
          'Blue Cross Blue Shield',
          'Aetna',
          'Cigna'
        ],
        consultationTypes: ['video', 'chat', 'phone'],
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
          },
          {
            day: 'Wednesday',
            startTime: '09:00',
            endTime: '17:00',
            isAvailable: true
          },
          {
            day: 'Thursday',
            startTime: '09:00',
            endTime: '17:00',
            isAvailable: true
          },
          {
            day: 'Friday',
            startTime: '09:00',
            endTime: '15:00',
            isAvailable: true
          }
        ],
        consultationFee: 150,                          // Consultation fee in dollars
        followUpFee: 100                               // Follow-up fee in dollars
      };

      // STEP 4: Update profile with complete information
      const updateResponse = await request(API_URL)
        .put('/doctors/profile')                       // Update doctor profile endpoint
        .send(completeProfileData)                     // Send complete profile data
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);                                  // Expect successful update

      // STEP 5: Validate profile update response
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.doctor).toBeDefined();
      expect(updateResponse.body.doctor).toHaveCompleteDoctorProfile(); // Custom matcher

      const updatedDoctor = updateResponse.body.doctor;
      expect(updatedDoctor.bio).toBe(completeProfileData.bio);
      expect(updatedDoctor.education).toHaveLength(2);
      expect(updatedDoctor.certifications).toHaveLength(3);
      expect(updatedDoctor.languages).toContain('English');
      expect(updatedDoctor.languages).toContain('Spanish');
      expect(updatedDoctor.availability).toHaveLength(5);

      // STEP 6: Validate pricing information
      expect(updatedDoctor.consultationFee).toBe(150);
      expect(updatedDoctor.followUpFee).toBe(100);

      // STEP 7: Verify profile completion status updated
      expect(updatedDoctor.profileCompleted).toBe(true);
      expect(updatedDoctor.verificationStatus).toBe('under_review'); // Should move to review

      // STEP 8: Validate availability structure
      const mondayAvailability = updatedDoctor.availability.find(day => day.day === 'Monday');
      expect(mondayAvailability.startTime).toBe('09:00');
      expect(mondayAvailability.endTime).toBe('17:00');
      expect(mondayAvailability.isAvailable).toBe(true);
    });

    /**
     * TEST CASE: Profile Update Validation
     * 
     * This test ensures proper validation of profile update data
     */
    test('should validate profile update data and reject invalid information', async () => {
      // STEP 1: Attempt profile update with invalid data
      const invalidProfileData = {
        consultationFee: -50,                         // Invalid negative fee
        followUpFee: 'not_a_number',                  // Invalid fee format
        availability: [
          {
            day: 'InvalidDay',                        // Invalid day name
            startTime: '25:00',                       // Invalid time format
            endTime: '18:00',
            isAvailable: true
          }
        ],
        education: [
          {
            degree: '',                               // Empty degree field
            institution: 'Test University',
            year: 2025                                // Future year
          }
        ]
      };

      // STEP 2: Send invalid update request
      const response = await request(API_URL)
        .put('/doctors/profile')
        .send(invalidProfileData)
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(400);                                 // Expect validation error

      // STEP 3: Validate error response structure
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();    // Should contain validation errors
      expect(Array.isArray(response.body.errors)).toBe(true);

      // STEP 4: Check specific validation errors
      const errors = response.body.errors;
      expect(errors.some(error => error.field === 'consultationFee')).toBe(true);
      expect(errors.some(error => error.field === 'availability')).toBe(true);
      expect(errors.some(error => error.field === 'education')).toBe(true);
    });

    /**
     * TEST CASE: Profile Picture Upload
     * 
     * This test validates profile picture upload functionality
     */
    test('should upload and update doctor profile picture', async () => {
      // STEP 1: Simulate profile picture upload (using base64 for testing)
      const profilePictureData = {
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A',
        filename: 'profile.jpg',
        contentType: 'image/jpeg'
      };

      // STEP 2: Upload profile picture
      const uploadResponse = await request(API_URL)
        .post('/doctors/profile/picture')             // Profile picture upload endpoint
        .send(profilePictureData)
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);                                 // Expect successful upload

      // STEP 3: Validate upload response
      expect(uploadResponse.body.success).toBe(true);
      expect(uploadResponse.body.profilePicture).toBeDefined();
      expect(uploadResponse.body.profilePicture.url).toBeDefined();
      expect(uploadResponse.body.profilePicture.filename).toBe('profile.jpg');

      // STEP 4: Verify profile picture URL is accessible
      expect(uploadResponse.body.profilePicture.url).toMatch(/^https?:\/\//);

      // STEP 5: Confirm profile is updated with new picture
      const profileResponse = await request(API_URL)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);

      expect(profileResponse.body.user.profilePicture).toBe(uploadResponse.body.profilePicture.url);
    });
  });

  /**
   * Test Group: Doctor Search and Discovery
   * Tests doctor search functionality for patients
   */
  describe('🔍 Doctor Search and Discovery', () => {
    
    let cardiologist, dermatologist, pediatrician;

    /**
     * Setup: Create multiple doctors for search testing
     */
    beforeEach(async () => {
      // Create doctors with different specialties for search testing
      cardiologist = await createTestDoctor({
        firstName: 'Dr. Heart',
        lastName: 'Specialist',
        email: 'cardiologist@test.com',
        specialty: 'Cardiology',
        experience: 15,
        hourlyRate: 200,
        rating: 4.8,
        profileCompleted: true,
        verificationStatus: 'verified'
      });

      dermatologist = await createTestDoctor({
        firstName: 'Dr. Skin',
        lastName: 'Expert',
        email: 'dermatologist@test.com',
        specialty: 'Dermatology',
        experience: 10,
        hourlyRate: 180,
        rating: 4.6,
        profileCompleted: true,
        verificationStatus: 'verified'
      });

      pediatrician = await createTestDoctor({
        firstName: 'Dr. Child',
        lastName: 'Care',
        email: 'pediatrician@test.com',
        specialty: 'Pediatrics',
        experience: 8,
        hourlyRate: 160,
        rating: 4.9,
        profileCompleted: true,
        verificationStatus: 'verified'
      });
    });

    /**
     * TEST CASE: Search Doctors by Specialty
     * 
     * This test validates specialty-based doctor search functionality
     */
    test('should search and filter doctors by specialty', async () => {
      // STEP 1: Search for cardiologists
      const cardiologySearch = await request(API_URL)
        .get('/doctors')                               // Doctor search endpoint
        .query({ specialty: 'Cardiology' })           // Filter by specialty
        .set('Authorization', `Bearer ${patientAuthToken}`)
        .expect(200);

      // STEP 2: Validate cardiology search results
      expect(cardiologySearch.body.success).toBe(true);
      expect(cardiologySearch.body.doctors).toBeDefined();
      expect(Array.isArray(cardiologySearch.body.doctors)).toBe(true);
      expect(cardiologySearch.body.doctors.length).toBeGreaterThan(0);

      // STEP 3: Verify all returned doctors are cardiologists
      cardiologySearch.body.doctors.forEach(doctor => {
        expect(doctor.specialty).toBe('Cardiology');
        expect(doctor.verificationStatus).toBe('verified');
        expect(doctor.profileCompleted).toBe(true);
      });

      // STEP 4: Search for pediatricians
      const pediatricsSearch = await request(API_URL)
        .get('/doctors')
        .query({ specialty: 'Pediatrics' })
        .set('Authorization', `Bearer ${patientAuthToken}`)
        .expect(200);

      // STEP 5: Validate pediatrics search results
      expect(pediatricsSearch.body.doctors.length).toBeGreaterThan(0);
      pediatricsSearch.body.doctors.forEach(doctor => {
        expect(doctor.specialty).toBe('Pediatrics');
      });
    });

    /**
     * TEST CASE: Search Doctors with Multiple Filters
     * 
     * This test validates complex search with multiple filter criteria
     */
    test('should search doctors with multiple filter criteria', async () => {
      // STEP 1: Search with multiple filters
      const complexSearch = await request(API_URL)
        .get('/doctors')
        .query({
          specialty: 'Cardiology',                    // Specialty filter
          minRating: 4.5,                            // Minimum rating filter
          maxHourlyRate: 250,                        // Maximum rate filter
          consultationType: 'video',                 // Consultation type filter
          sortBy: 'rating',                          // Sort criteria
          sortOrder: 'desc'                          // Sort order
        })
        .set('Authorization', `Bearer ${patientAuthToken}`)
        .expect(200);

      // STEP 2: Validate complex search results
      expect(complexSearch.body.success).toBe(true);
      expect(complexSearch.body.doctors).toBeDefined();

      // STEP 3: Verify filters are applied correctly
      if (complexSearch.body.doctors.length > 0) {
        complexSearch.body.doctors.forEach(doctor => {
          expect(doctor.specialty).toBe('Cardiology');
          expect(doctor.rating).toBeGreaterThanOrEqual(4.5);
          expect(doctor.hourlyRate).toBeLessThanOrEqual(250);
          expect(doctor.consultationTypes).toContain('video');
        });

        // STEP 4: Verify sorting is applied (rating descending)
        for (let i = 0; i < complexSearch.body.doctors.length - 1; i++) {
          expect(complexSearch.body.doctors[i].rating)
            .toBeGreaterThanOrEqual(complexSearch.body.doctors[i + 1].rating);
        }
      }
    });

    /**
     * TEST CASE: Doctor Search Pagination
     * 
     * This test validates pagination in doctor search results
     */
    test('should paginate doctor search results correctly', async () => {
      // STEP 1: Request first page of results
      const firstPage = await request(API_URL)
        .get('/doctors')
        .query({
          page: 1,                                   // First page
          limit: 2                                   // 2 results per page
        })
        .set('Authorization', `Bearer ${patientAuthToken}`)
        .expect(200);

      // STEP 2: Validate pagination response structure
      expect(firstPage.body.success).toBe(true);
      expect(firstPage.body.doctors).toBeDefined();
      expect(firstPage.body.pagination).toBeDefined();
      expect(firstPage.body.pagination.currentPage).toBe(1);
      expect(firstPage.body.pagination.limit).toBe(2);
      expect(firstPage.body.pagination.total).toBeDefined();
      expect(firstPage.body.pagination.totalPages).toBeDefined();

      // STEP 3: Validate results are limited correctly
      expect(firstPage.body.doctors.length).toBeLessThanOrEqual(2);

      // STEP 4: Request second page if there are more results
      if (firstPage.body.pagination.totalPages > 1) {
        const secondPage = await request(API_URL)
          .get('/doctors')
          .query({
            page: 2,
            limit: 2
          })
          .set('Authorization', `Bearer ${patientAuthToken}`)
          .expect(200);

        // STEP 5: Validate second page results
        expect(secondPage.body.pagination.currentPage).toBe(2);
        expect(secondPage.body.doctors).toBeDefined();

        // STEP 6: Ensure no duplicate doctors between pages
        const firstPageIds = firstPage.body.doctors.map(doc => doc._id);
        const secondPageIds = secondPage.body.doctors.map(doc => doc._id);
        const intersection = firstPageIds.filter(id => secondPageIds.includes(id));
        expect(intersection.length).toBe(0); // No duplicates
      }
    });
  });

  /**
   * Test Group: Doctor Availability Management
   * Tests availability schedule management and time slot operations
   */
  describe('📅 Doctor Availability Management', () => {
    
    /**
     * TEST CASE: Update Doctor Availability Schedule
     * 
     * This test validates updating a doctor's weekly availability schedule
     */
    test('should update doctor availability schedule', async () => {
      // STEP 1: Define new availability schedule
      const newAvailability = [
        {
          day: 'Monday',
          startTime: '08:00',
          endTime: '16:00',
          isAvailable: true,
          breakTimes: [
            { start: '12:00', end: '13:00' }          // Lunch break
          ]
        },
        {
          day: 'Tuesday',
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
          breakTimes: []
        },
        {
          day: 'Wednesday',
          startTime: '08:00',
          endTime: '16:00',
          isAvailable: true,
          breakTimes: [
            { start: '12:00', end: '13:00' }
          ]
        },
        {
          day: 'Thursday',
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true,
          breakTimes: []
        },
        {
          day: 'Friday',
          startTime: '08:00',
          endTime: '14:00',
          isAvailable: true,
          breakTimes: []
        },
        {
          day: 'Saturday',
          startTime: '09:00',
          endTime: '12:00',
          isAvailable: true,
          breakTimes: []
        },
        {
          day: 'Sunday',
          startTime: '',
          endTime: '',
          isAvailable: false,                        // Not available on Sundays
          breakTimes: []
        }
      ];

      // STEP 2: Update availability schedule
      const response = await request(API_URL)
        .put('/doctors/availability')                // Update availability endpoint
        .send({ availability: newAvailability })    // Send new schedule
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);                                // Expect successful update

      // STEP 3: Validate availability update response
      expect(response.body.success).toBe(true);
      expect(response.body.availability).toBeDefined();
      expect(Array.isArray(response.body.availability)).toBe(true);
      expect(response.body.availability.length).toBe(7); // All 7 days

      // STEP 4: Validate individual day schedules
      const monday = response.body.availability.find(day => day.day === 'Monday');
      expect(monday.startTime).toBe('08:00');
      expect(monday.endTime).toBe('16:00');
      expect(monday.isAvailable).toBe(true);
      expect(monday.breakTimes).toHaveLength(1);
      expect(monday.breakTimes[0].start).toBe('12:00');

      const sunday = response.body.availability.find(day => day.day === 'Sunday');
      expect(sunday.isAvailable).toBe(false);
    });

    /**
     * TEST CASE: Block Specific Time Slots
     * 
     * This test validates blocking specific time slots for unavailability
     */
    test('should block specific time slots for doctor unavailability', async () => {
      // STEP 1: Block specific time slots for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD

      const blockedSlots = [
        {
          date: dateString,
          startTime: '10:00',
          endTime: '11:00',
          reason: 'Emergency surgery',
          isRecurring: false
        },
        {
          date: dateString,
          startTime: '14:00',
          endTime: '15:30',
          reason: 'Medical conference',
          isRecurring: false
        }
      ];

      // STEP 2: Send block time slots request
      const response = await request(API_URL)
        .post('/doctors/availability/block')         // Block time slots endpoint
        .send({ blockedSlots })                      // Send slots to block
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);                                // Expect successful blocking

      // STEP 3: Validate blocking response
      expect(response.body.success).toBe(true);
      expect(response.body.blockedSlots).toBeDefined();
      expect(response.body.blockedSlots.length).toBe(2);

      // STEP 4: Verify blocked slots are recorded correctly
      expect(response.body.blockedSlots[0].reason).toBe('Emergency surgery');
      expect(response.body.blockedSlots[1].reason).toBe('Medical conference');

      // STEP 5: Check that slots are no longer available for booking
      const availabilityResponse = await request(API_URL)
        .get(`/doctors/${testDoctor._id}/availability`)
        .query({ date: dateString, duration: 30 })   // 30-minute slots
        .set('Authorization', `Bearer ${patientAuthToken}`)
        .expect(200);

      // STEP 6: Validate blocked slots are not in available slots
      const availableSlots = availabilityResponse.body.availableSlots;
      
      // Check that 10:00-11:00 range is not available
      const blockedSlot1 = availableSlots.find(slot => {
        const slotStart = new Date(slot.startTime);
        return slotStart.getHours() === 10 && slotStart.getMinutes() === 0;
      });
      expect(blockedSlot1).toBeUndefined();

      // Check that 14:00-15:30 range is not available
      const blockedSlot2 = availableSlots.find(slot => {
        const slotStart = new Date(slot.startTime);
        return slotStart.getHours() === 14 && slotStart.getMinutes() === 0;
      });
      expect(blockedSlot2).toBeUndefined();
    });
  });

  /**
   * Test Group: Doctor Verification Process
   * Tests the doctor verification and credential validation workflow
   */
  describe('✅ Doctor Verification Process', () => {
    
    /**
     * TEST CASE: Submit Documents for Verification
     * 
     * This test validates the document submission process for doctor verification
     */
    test('should submit verification documents successfully', async () => {
      // STEP 1: Prepare verification documents (base64 encoded for testing)
      const verificationDocuments = {
        medicalLicense: {
          file: 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0xlbmd0aCA5NTIKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnic',
          filename: 'medical_license.pdf',
          contentType: 'application/pdf'
        },
        medicalDegree: {
          file: 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0xlbmd0aCA5NTIKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnic',
          filename: 'medical_degree.pdf',
          contentType: 'application/pdf'
        },
        residencyCompletion: {
          file: 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwKL0xlbmd0aCA5NTIKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnic',
          filename: 'residency_certificate.pdf',
          contentType: 'application/pdf'
        }
      };

      // STEP 2: Submit verification documents
      const response = await request(API_URL)
        .post('/doctors/verification/documents')     // Document submission endpoint
        .send(verificationDocuments)                 // Send documents
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);                                // Expect successful submission

      // STEP 3: Validate document submission response
      expect(response.body.success).toBe(true);
      expect(response.body.verificationRequest).toBeDefined();
      expect(response.body.verificationRequest.status).toBe('submitted');
      expect(response.body.verificationRequest.submittedDocuments).toHaveLength(3);

      // STEP 4: Verify each document is recorded
      const submittedDocs = response.body.verificationRequest.submittedDocuments;
      expect(submittedDocs.some(doc => doc.type === 'medicalLicense')).toBe(true);
      expect(submittedDocs.some(doc => doc.type === 'medicalDegree')).toBe(true);
      expect(submittedDocs.some(doc => doc.type === 'residencyCompletion')).toBe(true);

      // STEP 5: Verify doctor status is updated
      const profileResponse = await request(API_URL)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);

      expect(profileResponse.body.user.verificationStatus).toBe('documents_submitted');
    });

    /**
     * TEST CASE: Verification Status Tracking
     * 
     * This test validates tracking of verification status throughout the process
     */
    test('should track verification status progression', async () => {
      // STEP 1: Check initial verification status
      const initialStatus = await request(API_URL)
        .get('/doctors/verification/status')         // Verification status endpoint
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);

      // STEP 2: Validate initial status
      expect(initialStatus.body.success).toBe(true);
      expect(initialStatus.body.verification).toBeDefined();
      expect(initialStatus.body.verification.status).toBe('pending');
      expect(initialStatus.body.verification.progress).toBeDefined();

      // STEP 3: Validate progress tracking structure
      const progress = initialStatus.body.verification.progress;
      expect(progress.profileCompleted).toBeDefined();
      expect(progress.documentsSubmitted).toBeDefined();
      expect(progress.documentsReviewed).toBeDefined();
      expect(progress.backgroundCheckCompleted).toBeDefined();
      expect(progress.verificationCompleted).toBeDefined();
    });
  });

  /**
   * Test Group: Doctor Statistics and Analytics
   * Tests doctor-specific analytics and performance metrics
   */
  describe('📊 Doctor Analytics and Statistics', () => {
    
    /**
     * TEST CASE: Doctor Dashboard Statistics
     * 
     * This test validates retrieval of doctor dashboard analytics
     */
    test('should retrieve doctor dashboard statistics', async () => {
      // STEP 1: Request doctor dashboard analytics
      const response = await request(API_URL)
        .get('/analytics/doctor/dashboard')          // Doctor analytics endpoint
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);                                // Expect successful retrieval

      // STEP 2: Validate analytics response structure
      expect(response.body.success).toBe(true);
      expect(response.body.analytics).toBeDefined();

      const analytics = response.body.analytics;

      // STEP 3: Validate patient statistics
      expect(analytics.patients).toBeDefined();
      expect(analytics.patients.total).toBeDefined();
      expect(analytics.patients.thisMonth).toBeDefined();
      expect(analytics.patients.thisWeek).toBeDefined();
      expect(typeof analytics.patients.total).toBe('number');

      // STEP 4: Validate appointment statistics
      expect(analytics.appointments).toBeDefined();
      expect(analytics.appointments.total).toBeDefined();
      expect(analytics.appointments.completed).toBeDefined();
      expect(analytics.appointments.cancelled).toBeDefined();
      expect(analytics.appointments.upcoming).toBeDefined();

      // STEP 5: Validate revenue statistics
      expect(analytics.revenue).toBeDefined();
      expect(analytics.revenue.total).toBeDefined();
      expect(analytics.revenue.thisMonth).toBeDefined();
      expect(analytics.revenue.lastMonth).toBeDefined();
      expect(typeof analytics.revenue.total).toBe('number');

      // STEP 6: Validate rating and feedback data
      expect(analytics.rating).toBeDefined();
      expect(analytics.rating.average).toBeDefined();
      expect(analytics.rating.totalReviews).toBeDefined();
      expect(analytics.rating.ratingDistribution).toBeDefined();
    });

    /**
     * TEST CASE: Doctor Performance Metrics
     * 
     * This test validates detailed performance metrics for doctors
     */
    test('should retrieve doctor performance metrics', async () => {
      // STEP 1: Request performance metrics for specific time range
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const response = await request(API_URL)
        .get('/analytics/doctor/performance')        // Performance metrics endpoint
        .query({
          startDate: thirtyDaysAgo.toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          metrics: 'all'                             // All performance metrics
        })
        .set('Authorization', `Bearer ${doctorAuthToken}`)
        .expect(200);

      // STEP 2: Validate performance metrics structure
      expect(response.body.success).toBe(true);
      expect(response.body.performance).toBeDefined();

      const performance = response.body.performance;

      // STEP 3: Validate appointment performance metrics
      expect(performance.appointments).toBeDefined();
      expect(performance.appointments.totalScheduled).toBeDefined();
      expect(performance.appointments.completionRate).toBeDefined();
      expect(performance.appointments.noShowRate).toBeDefined();
      expect(performance.appointments.averageDuration).toBeDefined();

      // STEP 4: Validate response time metrics
      expect(performance.responseTime).toBeDefined();
      expect(performance.responseTime.averageResponseTime).toBeDefined();
      expect(performance.responseTime.firstResponseTime).toBeDefined();

      // STEP 5: Validate patient satisfaction metrics
      expect(performance.satisfaction).toBeDefined();
      expect(performance.satisfaction.averageRating).toBeDefined();
      expect(performance.satisfaction.recommendationRate).toBeDefined();
    });
  });
}); 