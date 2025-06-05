/**
 * Jest Setup Configuration
 * 
 * This file runs before each test suite and handles:
 * - Global test environment setup
 * - Database connections and cleanup
 * - Test timeouts and configurations
 * - Custom matchers and utilities
 * - Global variables for testing
 */

const testConfig = require('./test-config');
const { connectTestDatabase, disconnectTestDatabase } = require('../utils/database-helpers');

// Extend Jest timeout for integration tests
jest.setTimeout(testConfig.api.timeout);

// Global setup before all tests
beforeAll(async () => {
  console.log('🚀 Setting up test environment...');
  
  // Connect to test database
  await connectTestDatabase();
  
  // Set up global test variables
  global.testConfig = testConfig;
  global.API_URL = testConfig.api.baseUrl;
  global.FRONTEND_URL = testConfig.frontend.baseUrl;
  
  console.log('✅ Test environment setup complete');
});

// Global cleanup after all tests
afterAll(async () => {
  console.log('🧹 Cleaning up test environment...');
  
  // Disconnect from test database
  await disconnectTestDatabase();
  
  console.log('✅ Test environment cleanup complete');
});

// Custom Jest matchers for better assertions
expect.extend({
  /**
   * Custom matcher to check if response has valid JWT token
   * @param {Object} received - Response object
   * @returns {Object} Jest matcher result
   */
  toHaveValidJWT(received) {
    const jwt = require('jsonwebtoken');
    
    try {
      // Check if response has token property
      if (!received.token) {
        return {
          message: () => 'Expected response to have a token property',
          pass: false,
        };
      }
      
      // Verify JWT token structure
      const decoded = jwt.decode(received.token);
      if (!decoded) {
        return {
          message: () => 'Expected token to be a valid JWT',
          pass: false,
        };
      }
      
      // Check required JWT claims
      const requiredClaims = ['id', 'email', 'role'];
      const missingClaims = requiredClaims.filter(claim => !decoded[claim]);
      
      if (missingClaims.length > 0) {
        return {
          message: () => `Expected JWT to contain claims: ${missingClaims.join(', ')}`,
          pass: false,
        };
      }
      
      return {
        message: () => 'Expected response not to have valid JWT',
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `JWT validation error: ${error.message}`,
        pass: false,
      };
    }
  },

  /**
   * Custom matcher to check if appointment object has required fields
   * @param {Object} received - Appointment object
   * @returns {Object} Jest matcher result
   */
  toBeValidAppointment(received) {
    const requiredFields = [
      'patient',
      'doctor', 
      'service',
      'scheduledDateTime',
      'status',
      'consultationType'
    ];
    
    const missingFields = requiredFields.filter(field => !received[field]);
    
    if (missingFields.length > 0) {
      return {
        message: () => `Expected appointment to have fields: ${missingFields.join(', ')}`,
        pass: false,
      };
    }
    
    // Validate appointment status
    const validStatuses = ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(received.status)) {
      return {
        message: () => `Expected appointment status to be one of: ${validStatuses.join(', ')}`,
        pass: false,
      };
    }
    
    // Validate consultation type
    const validTypes = ['video', 'chat', 'phone'];
    if (!validTypes.includes(received.consultationType)) {
      return {
        message: () => `Expected consultation type to be one of: ${validTypes.join(', ')}`,
        pass: false,
      };
    }
    
    return {
      message: () => 'Expected object not to be valid appointment',
      pass: true,
    };
  },

  /**
   * Custom matcher to check API response structure
   * @param {Object} received - API response object
   * @returns {Object} Jest matcher result
   */
  toHaveValidAPIResponse(received) {
    // Check response structure
    if (typeof received !== 'object') {
      return {
        message: () => 'Expected response to be an object',
        pass: false,
      };
    }
    
    // Check for required response properties
    if (!received.hasOwnProperty('success')) {
      return {
        message: () => 'Expected response to have success property',
        pass: false,
      };
    }
    
    // If success is false, should have error message
    if (received.success === false && !received.message && !received.error) {
      return {
        message: () => 'Expected failed response to have error message',
        pass: false,
      };
    }
    
    return {
      message: () => 'Expected response not to have valid API structure',
      pass: true,
    };
  },

  /**
   * Custom matcher to check if doctor profile is complete
   * @param {Object} received - Doctor object
   * @returns {Object} Jest matcher result
   */
  toHaveCompleteDoctorProfile(received) {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'specialty',
      'licenseNumber',
      'experience',
      'availability'
    ];
    
    const missingFields = requiredFields.filter(field => !received[field]);
    
    if (missingFields.length > 0) {
      return {
        message: () => `Expected doctor profile to have fields: ${missingFields.join(', ')}`,
        pass: false,
      };
    }
    
    // Validate experience is a number
    if (typeof received.experience !== 'number' || received.experience < 0) {
      return {
        message: () => 'Expected doctor experience to be a positive number',
        pass: false,
      };
    }
    
    // Validate availability array
    if (!Array.isArray(received.availability)) {
      return {
        message: () => 'Expected doctor availability to be an array',
        pass: false,
      };
    }
    
    return {
      message: () => 'Expected doctor profile not to be complete',
      pass: true,
    };
  }
});

// Global error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Optionally exit the process in test environment
  if (process.env.NODE_ENV === 'test') {
    process.exit(1);
  }
});

// Suppress console logs during tests unless explicitly enabled
if (!process.env.ENABLE_TEST_LOGS) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: console.error, // Keep error logs for debugging
  };
}

// Set up test data cleanup helpers
global.cleanupTestData = async () => {
  const { cleanupTestDatabase } = require('../utils/database-helpers');
  await cleanupTestDatabase();
};

// Global test utilities
global.generateTestUser = (overrides = {}) => {
  const faker = require('faker');
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'TestPassword123!',
    role: 'patient',
    ...overrides
  };
};

global.generateTestDoctor = (overrides = {}) => {
  const faker = require('faker');
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    password: 'TestPassword123!',
    role: 'doctor',
    specialty: faker.random.arrayElement(['Cardiology', 'Dermatology', 'Pediatrics', 'Psychology']),
    licenseNumber: faker.random.alphaNumeric(10).toUpperCase(),
    experience: faker.random.number({ min: 1, max: 30 }),
    hourlyRate: faker.random.number({ min: 50, max: 200 }),
    availability: [
      {
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        isAvailable: true
      }
    ],
    ...overrides
  };
};

global.generateTestAppointment = (overrides = {}) => {
  const faker = require('faker');
  return {
    scheduledDateTime: faker.date.future(),
    consultationType: faker.random.arrayElement(['video', 'chat', 'phone']),
    symptoms: faker.lorem.sentences(2),
    status: 'scheduled',
    ...overrides
  };
};

// Helper to wait for async operations
global.wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to retry async operations
global.retry = async (fn, times = 3, delay = 1000) => {
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === times - 1) throw error;
      await global.wait(delay);
    }
  }
};

console.log('📋 Jest setup configuration loaded successfully'); 