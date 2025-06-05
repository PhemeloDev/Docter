/**
 * HealthHive Authentication Test Suite
 * 
 * This test suite validates the authentication and authorization functionality
 * of the HealthHive telemedicine platform. It covers:
 * 
 * 1. User Registration (Patient & Doctor)
 * 2. User Login & JWT Token Generation
 * 3. Password Security & Validation
 * 4. Role-based Access Control
 * 5. Token Refresh & Logout
 * 6. Account Security Features
 */

// Import required testing dependencies
const request = require('supertest'); // HTTP assertion library for API testing
const bcrypt = require('bcryptjs'); // Password hashing library
const jwt = require('jsonwebtoken'); // JWT token handling
const { 
  createTestUser, 
  createTestDoctor, 
  cleanupTestDatabase,
  createTestJWT 
} = require('../utils/database-helpers'); // Database helper functions

// Import test configuration
const testConfig = require('../config/test-config');

// Set API base URL for all requests
const API_URL = testConfig.api.baseUrl;

/**
 * Authentication Test Suite
 * Groups all authentication-related tests together
 */
describe('🔐 Authentication API Tests', () => {
  
  /**
   * Setup: Runs before each individual test
   * Purpose: Ensures clean state for each test
   */
  beforeEach(async () => {
    // Clean database to prevent test interference
    await cleanupTestDatabase();
  });

  /**
   * Test Group: User Registration
   * Tests the user registration endpoint for both patients and doctors
   */
  describe('📝 User Registration', () => {
    
    /**
     * TEST CASE: Successful Patient Registration
     * 
     * This test validates that a new patient can register successfully
     * and receives appropriate response with JWT token
     */
    test('should register a new patient successfully', async () => {
      // STEP 1: Define test user data
      const newPatient = {
        firstName: 'John',           // User's first name
        lastName: 'Doe',             // User's last name  
        email: 'john.doe@test.com',  // Unique email address
        password: 'SecurePass123!',  // Strong password meeting requirements
        role: 'patient'              // User role (patient/doctor)
      };

      // STEP 2: Send POST request to registration endpoint
      const response = await request(API_URL)
        .post('/auth/register')      // Registration endpoint
        .send(newPatient)            // Send user data in request body
        .expect(201);                // Expect HTTP 201 (Created) status

      // STEP 3: Validate response structure
      expect(response.body).toHaveValidAPIResponse(); // Custom matcher
      expect(response.body.success).toBe(true);       // Success flag should be true
      expect(response.body).toHaveValidJWT();         // Should contain valid JWT token

      // STEP 4: Validate user data in response
      expect(response.body.user).toBeDefined();           // User object should exist
      expect(response.body.user.email).toBe(newPatient.email); // Email should match
      expect(response.body.user.role).toBe('patient');    // Role should be patient
      expect(response.body.user.password).toBeUndefined(); // Password should not be returned

      // STEP 5: Validate JWT token claims
      const decodedToken = jwt.decode(response.body.token);
      expect(decodedToken.email).toBe(newPatient.email);  // Token should contain email
      expect(decodedToken.role).toBe('patient');          // Token should contain role
      expect(decodedToken.exp).toBeGreaterThan(Date.now() / 1000); // Token should not be expired
    });

    /**
     * TEST CASE: Successful Doctor Registration
     * 
     * This test validates doctor registration with additional required fields
     * specific to healthcare providers
     */
    test('should register a new doctor successfully', async () => {
      // STEP 1: Define doctor-specific test data
      const newDoctor = {
        firstName: 'Dr. Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@test.com',
        password: 'SecurePass123!',
        role: 'doctor',
        specialty: 'Cardiology',           // Medical specialty (required for doctors)
        licenseNumber: 'MD123456789',      // Medical license (required for doctors)
        experience: 10                     // Years of experience
      };

      // STEP 2: Send registration request
      const response = await request(API_URL)
        .post('/auth/register')
        .send(newDoctor)
        .expect(201);

      // STEP 3: Validate doctor-specific response
      expect(response.body.user).toHaveCompleteDoctorProfile(); // Custom matcher
      expect(response.body.user.specialty).toBe('Cardiology');
      expect(response.body.user.licenseNumber).toBe('MD123456789');
    });

    /**
     * TEST CASE: Registration with Invalid Email
     * 
     * This test ensures the system properly validates email format
     * and rejects invalid email addresses
     */
    test('should reject registration with invalid email format', async () => {
      // STEP 1: Create user data with invalid email
      const invalidUser = {
        firstName: 'Test',
        lastName: 'User',
        email: 'invalid-email-format',    // Invalid email format
        password: 'SecurePass123!',
        role: 'patient'
      };

      // STEP 2: Send request and expect validation error
      const response = await request(API_URL)
        .post('/auth/register')
        .send(invalidUser)
        .expect(400);                     // Expect HTTP 400 (Bad Request)

      // STEP 3: Validate error response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/email/i); // Error message should mention email
    });

    /**
     * TEST CASE: Registration with Weak Password
     * 
     * This test validates password strength requirements
     * to ensure account security
     */
    test('should reject registration with weak password', async () => {
      // STEP 1: Test data with weak password
      const userWithWeakPassword = {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: '123',                  // Weak password (too short, no complexity)
        role: 'patient'
      };

      // STEP 2: Send request and expect rejection
      const response = await request(API_URL)
        .post('/auth/register')
        .send(userWithWeakPassword)
        .expect(400);

      // STEP 3: Validate password error message
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/password/i); // Should mention password requirements
    });

    /**
     * TEST CASE: Duplicate Email Registration
     * 
     * This test ensures the system prevents duplicate user accounts
     * with the same email address
     */
    test('should reject registration with existing email', async () => {
      // STEP 1: Create initial user in database
      await createTestUser({
        email: 'existing@test.com',
        firstName: 'Existing',
        lastName: 'User'
      });

      // STEP 2: Attempt to register with same email
      const duplicateUser = {
        firstName: 'New',
        lastName: 'User',
        email: 'existing@test.com',       // Same email as existing user
        password: 'SecurePass123!',
        role: 'patient'
      };

      // STEP 3: Send request and expect conflict error
      const response = await request(API_URL)
        .post('/auth/register')
        .send(duplicateUser)
        .expect(409);                     // Expect HTTP 409 (Conflict)

      // STEP 4: Validate duplicate error message
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/already exists|duplicate/i);
    });
  });

  /**
   * Test Group: User Login
   * Tests the authentication login endpoint
   */
  describe('🔑 User Login', () => {
    
    /**
     * TEST CASE: Successful Patient Login
     * 
     * This test validates successful authentication with correct credentials
     */
    test('should login patient with valid credentials', async () => {
      // STEP 1: Create test patient in database
      const testUser = await createTestUser({
        email: 'patient@test.com',
        password: 'TestPassword123!',      // This will be hashed by createTestUser
        role: 'patient'
      });

      // STEP 2: Prepare login credentials
      const loginCredentials = {
        email: 'patient@test.com',
        password: 'TestPassword123!'       // Plain text password for login
      };

      // STEP 3: Send login request
      const response = await request(API_URL)
        .post('/auth/login')
        .send(loginCredentials)
        .expect(200);                      // Expect HTTP 200 (Success)

      // STEP 4: Validate successful login response
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveValidJWT();
      expect(response.body.user.email).toBe('patient@test.com');
      expect(response.body.user.role).toBe('patient');

      // STEP 5: Validate JWT token contains correct user data
      const decodedToken = jwt.decode(response.body.token);
      expect(decodedToken.email).toBe('patient@test.com');
      expect(decodedToken.id).toBe(testUser._id.toString());
    });

    /**
     * TEST CASE: Login with Invalid Password
     * 
     * This test ensures the system rejects login attempts with incorrect passwords
     */
    test('should reject login with incorrect password', async () => {
      // STEP 1: Create test user
      await createTestUser({
        email: 'user@test.com',
        password: 'CorrectPassword123!'
      });

      // STEP 2: Attempt login with wrong password
      const invalidCredentials = {
        email: 'user@test.com',
        password: 'WrongPassword123!'     // Incorrect password
      };

      // STEP 3: Send request and expect authentication failure
      const response = await request(API_URL)
        .post('/auth/login')
        .send(invalidCredentials)
        .expect(401);                     // Expect HTTP 401 (Unauthorized)

      // STEP 4: Validate error response
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/invalid|credentials|password/i);
      expect(response.body.token).toBeUndefined(); // No token should be provided
    });

    /**
     * TEST CASE: Login with Non-existent Email
     * 
     * This test validates handling of login attempts with unregistered emails
     */
    test('should reject login with non-existent email', async () => {
      // STEP 1: Attempt login with email not in database
      const nonExistentCredentials = {
        email: 'nonexistent@test.com',    // Email not registered
        password: 'AnyPassword123!'
      };

      // STEP 2: Send request and expect not found error
      const response = await request(API_URL)
        .post('/auth/login')
        .send(nonExistentCredentials)
        .expect(404);                     // Expect HTTP 404 (Not Found)

      // STEP 3: Validate error message
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/not found|does not exist/i);
    });
  });

  /**
   * Test Group: JWT Token Validation
   * Tests JWT token generation, validation, and security
   */
  describe('🎫 JWT Token Management', () => {
    
    /**
     * TEST CASE: Token Structure Validation
     * 
     * This test ensures JWT tokens contain all required claims and properties
     */
    test('should generate JWT token with correct structure', async () => {
      // STEP 1: Create test user and generate token
      const testUser = await createTestUser({
        email: 'token@test.com',
        role: 'patient'
      });
      
      const token = createTestJWT(testUser);

      // STEP 2: Decode token and validate structure
      const decodedToken = jwt.decode(token);
      
      // STEP 3: Validate required claims exist
      expect(decodedToken.id).toBeDefined();        // User ID claim
      expect(decodedToken.email).toBeDefined();     // Email claim
      expect(decodedToken.role).toBeDefined();      // Role claim
      expect(decodedToken.iat).toBeDefined();       // Issued at timestamp
      expect(decodedToken.exp).toBeDefined();       // Expiration timestamp

      // STEP 4: Validate claim values
      expect(decodedToken.email).toBe('token@test.com');
      expect(decodedToken.role).toBe('patient');
      expect(decodedToken.exp).toBeGreaterThan(decodedToken.iat); // Expiration after issue
    });

    /**
     * TEST CASE: Token Expiration Validation
     * 
     * This test validates that expired tokens are properly rejected
     */
    test('should reject expired JWT tokens', async () => {
      // STEP 1: Create token with short expiration
      const testUser = await createTestUser();
      const expiredTokenPayload = {
        id: testUser._id.toString(),
        email: testUser.email,
        role: testUser.role,
        iat: Math.floor(Date.now() / 1000) - 3600,    // Issued 1 hour ago
        exp: Math.floor(Date.now() / 1000) - 1800     // Expired 30 minutes ago
      };
      
      const expiredToken = jwt.sign(expiredTokenPayload, testConfig.auth.jwtSecret);

      // STEP 2: Try to use expired token for protected endpoint
      const response = await request(API_URL)
        .get('/auth/profile')             // Protected endpoint requiring authentication
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);                     // Expect unauthorized due to expired token

      // STEP 3: Validate rejection message
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/expired|invalid token/i);
    });
  });

  /**
   * Test Group: Role-Based Access Control
   * Tests that different user roles have appropriate access permissions
   */
  describe('👥 Role-Based Access Control', () => {
    
    /**
     * TEST CASE: Doctor Access to Doctor Dashboard
     * 
     * This test validates that doctors can access doctor-specific endpoints
     */
    test('should allow doctor access to doctor dashboard', async () => {
      // STEP 1: Create test doctor and generate auth token
      const testDoctor = await createTestDoctor({
        email: 'doctor@test.com',
        specialty: 'Cardiology'
      });
      
      const doctorToken = createTestJWT(testDoctor);

      // STEP 2: Access doctor-specific endpoint
      const response = await request(API_URL)
        .get('/analytics/doctor/dashboard')  // Doctor-only endpoint
        .set('Authorization', `Bearer ${doctorToken}`)
        .expect(200);                        // Should succeed for doctors

      // STEP 3: Validate response contains doctor data
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    /**
     * TEST CASE: Patient Denied Access to Doctor Dashboard
     * 
     * This test ensures patients cannot access doctor-only endpoints
     */
    test('should deny patient access to doctor dashboard', async () => {
      // STEP 1: Create test patient and generate auth token
      const testPatient = await createTestUser({
        email: 'patient@test.com',
        role: 'patient'
      });
      
      const patientToken = createTestJWT(testPatient);

      // STEP 2: Attempt to access doctor-only endpoint as patient
      const response = await request(API_URL)
        .get('/analytics/doctor/dashboard')
        .set('Authorization', `Bearer ${patientToken}`)
        .expect(403);                        // Expect HTTP 403 (Forbidden)

      // STEP 3: Validate access denied message
      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch(/access denied|forbidden|permission/i);
    });
  });

  /**
   * Test Group: Password Security
   * Tests password hashing, validation, and security features
   */
  describe('🔒 Password Security', () => {
    
    /**
     * TEST CASE: Password Hashing Validation
     * 
     * This test ensures passwords are properly hashed before storage
     */
    test('should hash passwords before storing in database', async () => {
      // STEP 1: Register user with plain text password
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: 'hash@test.com',
        password: 'PlainTextPassword123!',
        role: 'patient'
      };

      await request(API_URL)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      // STEP 2: Retrieve user from database and check password
      const users = await getTestData('users', { email: 'hash@test.com' });
      const savedUser = users[0];

      // STEP 3: Validate password is hashed (not plain text)
      expect(savedUser.password).toBeDefined();
      expect(savedUser.password).not.toBe('PlainTextPassword123!'); // Should not be plain text
      expect(savedUser.password.length).toBeGreaterThan(50);        // Hashed passwords are long

      // STEP 4: Validate password can be verified with bcrypt
      const isValidPassword = await bcrypt.compare('PlainTextPassword123!', savedUser.password);
      expect(isValidPassword).toBe(true);
    });
  });
}); 