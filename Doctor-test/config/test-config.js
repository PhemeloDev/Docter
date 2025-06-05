/**
 * Test Configuration File
 * 
 * This file centralizes all test environment configuration including:
 * - API endpoints for testing
 * - Database connections for test environment
 * - Third-party service configurations (Stripe, Email)
 * - Test data generation settings
 * - Timeout and retry configurations
 */

require('dotenv').config();

module.exports = {
  // Environment Configuration
  environment: process.env.NODE_ENV || 'test',
  
  // API Configuration
  api: {
    // Base URL for the backend API during testing
    baseUrl: process.env.TEST_API_URL || 'http://localhost:5000/api',
    
    // Timeout for API requests in milliseconds
    timeout: 30000,
    
    // Maximum number of retries for failed requests
    maxRetries: 3,
    
    // Delay between retries in milliseconds
    retryDelay: 1000
  },

  // Frontend Configuration
  frontend: {
    // Base URL for the frontend application during testing
    baseUrl: process.env.TEST_FRONTEND_URL || 'http://localhost:3000',
    
    // Timeout for page loads in milliseconds
    pageLoadTimeout: 30000,
    
    // Implicit wait time for element searches
    implicitWait: 10000
  },

  // Database Configuration
  database: {
    // MongoDB connection string for test database
    connectionString: process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/healthhive_test',
    
    // Database options for testing
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferMaxEntries: 0, // Disable mongoose buffering
      bufferCommands: false, // Disable mongoose buffering
    },
    
    // Collection names used in tests
    collections: {
      users: 'test_users',
      doctors: 'test_doctors',
      appointments: 'test_appointments',
      services: 'test_services',
      notifications: 'test_notifications',
      analytics: 'test_analytics'
    }
  },

  // Authentication Configuration
  auth: {
    // JWT secret for test environment
    jwtSecret: process.env.TEST_JWT_SECRET || 'test_jwt_secret_key_for_testing_only',
    
    // Token expiration time for tests
    tokenExpiration: '24h',
    
    // Test user credentials
    testUsers: {
      patient: {
        email: 'test.patient@healthhive.com',
        password: 'TestPassword123!',
        role: 'patient'
      },
      doctor: {
        email: 'test.doctor@healthhive.com',
        password: 'TestPassword123!',
        role: 'doctor'
      },
      admin: {
        email: 'test.admin@healthhive.com',
        password: 'TestPassword123!',
        role: 'admin'
      }
    }
  },

  // Payment Configuration (Stripe Test Mode)
  payments: {
    // Stripe test keys
    stripeSecretKey: process.env.TEST_STRIPE_SECRET_KEY || 'sk_test_fake_key_for_testing',
    stripePublishableKey: process.env.TEST_STRIPE_PUBLISHABLE_KEY || 'pk_test_fake_key_for_testing',
    
    // Test payment amounts (in cents)
    testAmounts: {
      consultation: 5000, // $50.00
      followUp: 3000,     // $30.00
      prescription: 1500,  // $15.00
      urgent: 7500        // $75.00
    },
    
    // Test card numbers for different scenarios
    testCards: {
      valid: '4242424242424242',
      declined: '4000000000000002',
      insufficient: '4000000000009995',
      expired: '4000000000000069'
    }
  },

  // Email Configuration for Testing
  email: {
    // Test SMTP settings
    smtp: {
      host: process.env.TEST_SMTP_HOST || 'localhost',
      port: process.env.TEST_SMTP_PORT || 1025, // Using MailHog for testing
      secure: false,
      auth: {
        user: process.env.TEST_SMTP_USER || 'test@healthhive.com',
        pass: process.env.TEST_SMTP_PASS || 'testpassword'
      }
    },
    
    // Test email addresses
    testEmails: {
      from: 'noreply@healthhive.test',
      support: 'support@healthhive.test',
      admin: 'admin@healthhive.test'
    }
  },

  // Selenium WebDriver Configuration
  selenium: {
    // Browser configuration for UI tests
    browser: process.env.TEST_BROWSER || 'chrome',
    
    // WebDriver options
    options: {
      chrome: {
        args: [
          '--headless',           // Run in headless mode for CI/CD
          '--no-sandbox',         // Required for running in Docker
          '--disable-dev-shm-usage', // Overcome limited resource problems
          '--disable-gpu',        // Disable GPU acceleration
          '--window-size=1920,1080' // Set viewport size
        ]
      },
      firefox: {
        args: [
          '--headless',
          '--width=1920',
          '--height=1080'
        ]
      }
    },
    
    // Timeouts for various operations
    timeouts: {
      implicit: 10000,    // Time to wait for elements to appear
      pageLoad: 30000,    // Time to wait for page to load
      script: 30000       // Time to wait for scripts to execute
    }
  },

  // Performance Testing Configuration
  performance: {
    // Load testing settings using Artillery
    artillery: {
      config: {
        target: 'http://localhost:5000',
        phases: [
          {
            duration: 60,      // Run for 60 seconds
            arrivalRate: 10,   // 10 users per second
            name: 'Warm up'
          },
          {
            duration: 120,     // Run for 2 minutes
            arrivalRate: 50,   // 50 users per second
            name: 'Load test'
          },
          {
            duration: 60,      // Run for 60 seconds
            arrivalRate: 100,  // 100 users per second
            name: 'Stress test'
          }
        ]
      }
    },
    
    // Performance thresholds
    thresholds: {
      responseTime: {
        p50: 200,    // 50th percentile should be under 200ms
        p95: 500,    // 95th percentile should be under 500ms
        p99: 1000    // 99th percentile should be under 1000ms
      },
      errorRate: 0.01, // Error rate should be under 1%
      throughput: 100   // Should handle 100 requests per second
    }
  },

  // Test Data Configuration
  testData: {
    // Number of records to generate for each entity
    generation: {
      users: 100,
      doctors: 20,
      appointments: 200,
      services: 10
    },
    
    // Data cleanup settings
    cleanup: {
      // Whether to clean up test data after each test
      afterEach: true,
      
      // Whether to clean up test data after all tests
      afterAll: true,
      
      // Collections to preserve (never clean up)
      preserve: ['test_services']
    }
  },

  // Logging Configuration
  logging: {
    // Log level for tests (error, warn, info, debug)
    level: process.env.TEST_LOG_LEVEL || 'info',
    
    // Whether to log to file
    logToFile: true,
    
    // Log file path
    logFile: './logs/test.log',
    
    // Whether to log API requests and responses
    logRequests: true
  },

  // Test Report Configuration
  reports: {
    // Directory for test reports
    outputDir: './reports',
    
    // JUnit XML report for CI/CD integration
    junit: {
      enabled: true,
      outputPath: './reports/junit.xml'
    },
    
    // HTML report for human-readable results
    html: {
      enabled: true,
      outputPath: './reports/test-report.html'
    },
    
    // Coverage report settings
    coverage: {
      enabled: true,
      outputDir: './reports/coverage',
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
}; 