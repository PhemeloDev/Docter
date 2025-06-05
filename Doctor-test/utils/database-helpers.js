/**
 * Database Helpers for Testing
 * 
 * This module provides utilities for:
 * - Setting up test database connections
 * - Creating and cleaning test data
 * - Managing database state during tests
 * - Seeding test data for consistent testing
 */

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const testConfig = require('../config/test-config');

// Global variable to store MongoDB Memory Server instance
let mongoServer;

/**
 * Connect to test database
 * Uses MongoDB Memory Server for isolated testing environment
 * 
 * @returns {Promise<void>}
 */
const connectTestDatabase = async () => {
  try {
    console.log('🔗 Connecting to test database...');
    
    // Create new in-memory MongoDB instance for testing
    mongoServer = await MongoMemoryServer.create({
      instance: {
        // Use a specific port for consistency
        port: 27017,
        // Database name for testing
        dbName: 'healthhive_test'
      },
      binary: {
        // MongoDB version to use
        version: '6.0.0'
      }
    });
    
    // Get the connection URI from the memory server
    const mongoUri = mongoServer.getUri();
    
    // Connect mongoose to the test database
    await mongoose.connect(mongoUri, testConfig.database.options);
    
    // Set up event listeners for connection monitoring
    mongoose.connection.on('connected', () => {
      console.log('✅ Successfully connected to test database');
    });
    
    mongoose.connection.on('error', (error) => {
      console.error('❌ Test database connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔌 Disconnected from test database');
    });
    
  } catch (error) {
    console.error('Failed to connect to test database:', error);
    throw error;
  }
};

/**
 * Disconnect from test database and stop MongoDB Memory Server
 * 
 * @returns {Promise<void>}
 */
const disconnectTestDatabase = async () => {
  try {
    console.log('🔌 Disconnecting from test database...');
    
    // Close mongoose connection
    await mongoose.connection.close();
    
    // Stop MongoDB Memory Server
    if (mongoServer) {
      await mongoServer.stop();
      mongoServer = null;
    }
    
    console.log('✅ Successfully disconnected from test database');
  } catch (error) {
    console.error('Failed to disconnect from test database:', error);
    throw error;
  }
};

/**
 * Clean up all test data from the database
 * Removes all documents from test collections
 * 
 * @returns {Promise<void>}
 */
const cleanupTestDatabase = async () => {
  try {
    console.log('🧹 Cleaning up test database...');
    
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    // Drop each collection
    for (const collection of collections) {
      await mongoose.connection.db.collection(collection.name).deleteMany({});
    }
    
    console.log('✅ Test database cleanup complete');
  } catch (error) {
    console.error('Failed to cleanup test database:', error);
    throw error;
  }
};

/**
 * Create a test user in the database
 * 
 * @param {Object} userData - User data to create
 * @returns {Promise<Object>} Created user object
 */
const createTestUser = async (userData = {}) => {
  const bcrypt = require('bcryptjs');
  
  // Default test user data
  const defaultUser = {
    firstName: 'Test',
    lastName: 'User',
    email: `test.user.${Date.now()}@healthhive.com`,
    password: 'TestPassword123!',
    role: 'patient',
    isActive: true,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Merge provided data with defaults
  const user = { ...defaultUser, ...userData };
  
  // Hash the password before saving
  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);
  
  // Create user in database
  const db = mongoose.connection.db;
  const result = await db.collection('users').insertOne(user);
  
  // Return created user with ID
  return {
    _id: result.insertedId,
    ...user,
    // Remove password from returned object for security
    password: undefined
  };
};

/**
 * Create a test doctor in the database
 * 
 * @param {Object} doctorData - Doctor data to create
 * @returns {Promise<Object>} Created doctor object
 */
const createTestDoctor = async (doctorData = {}) => {
  const bcrypt = require('bcryptjs');
  
  // Default test doctor data
  const defaultDoctor = {
    firstName: 'Dr. Test',
    lastName: 'Doctor',
    email: `test.doctor.${Date.now()}@healthhive.com`,
    password: 'TestPassword123!',
    role: 'doctor',
    specialty: 'General Medicine',
    licenseNumber: `LIC${Date.now()}`,
    experience: 5,
    hourlyRate: 100,
    rating: 4.5,
    totalPatients: 0,
    isActive: true,
    emailVerified: true,
    profileCompleted: true,
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
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Merge provided data with defaults
  const doctor = { ...defaultDoctor, ...doctorData };
  
  // Hash the password before saving
  const saltRounds = 10;
  doctor.password = await bcrypt.hash(doctor.password, saltRounds);
  
  // Create doctor in database
  const db = mongoose.connection.db;
  const result = await db.collection('users').insertOne(doctor);
  
  // Return created doctor with ID
  return {
    _id: result.insertedId,
    ...doctor,
    // Remove password from returned object for security
    password: undefined
  };
};

/**
 * Create a test appointment in the database
 * 
 * @param {Object} appointmentData - Appointment data to create
 * @param {string} patientId - Patient ID for the appointment
 * @param {string} doctorId - Doctor ID for the appointment
 * @returns {Promise<Object>} Created appointment object
 */
const createTestAppointment = async (appointmentData = {}, patientId, doctorId) => {
  // Default test appointment data
  const defaultAppointment = {
    patient: patientId,
    doctor: doctorId,
    service: 'General Consultation',
    scheduledDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    consultationType: 'video',
    status: 'scheduled',
    symptoms: 'Test symptoms for automated testing',
    duration: 30, // 30 minutes
    fee: 5000, // $50.00 in cents
    notes: 'This is a test appointment created by automated testing',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Merge provided data with defaults
  const appointment = { ...defaultAppointment, ...appointmentData };
  
  // Create appointment in database
  const db = mongoose.connection.db;
  const result = await db.collection('appointments').insertOne(appointment);
  
  // Return created appointment with ID
  return {
    _id: result.insertedId,
    ...appointment
  };
};

/**
 * Create test service in the database
 * 
 * @param {Object} serviceData - Service data to create
 * @returns {Promise<Object>} Created service object
 */
const createTestService = async (serviceData = {}) => {
  // Default test service data
  const defaultService = {
    name: 'General Consultation',
    description: 'General medical consultation for common health concerns',
    price: 5000, // $50.00 in cents
    duration: 30, // 30 minutes
    category: 'General Medicine',
    isActive: true,
    consultationTypes: ['video', 'chat', 'phone'],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Merge provided data with defaults
  const service = { ...defaultService, ...serviceData };
  
  // Create service in database
  const db = mongoose.connection.db;
  const result = await db.collection('services').insertOne(service);
  
  // Return created service with ID
  return {
    _id: result.insertedId,
    ...service
  };
};

/**
 * Seed the test database with initial data
 * Creates default users, doctors, services, and appointments
 * 
 * @returns {Promise<Object>} Object containing created test data
 */
const seedTestDatabase = async () => {
  try {
    console.log('🌱 Seeding test database...');
    
    // Create test services first
    const generalConsultation = await createTestService({
      name: 'General Consultation',
      price: 5000,
      category: 'General Medicine'
    });
    
    const mentalHealth = await createTestService({
      name: 'Mental Health Consultation',
      price: 7500,
      category: 'Psychology',
      duration: 45
    });
    
    const followUp = await createTestService({
      name: 'Follow-up Consultation',
      price: 3000,
      category: 'General Medicine',
      duration: 15
    });
    
    // Create test patients
    const patient1 = await createTestUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      role: 'patient'
    });
    
    const patient2 = await createTestUser({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@test.com',
      role: 'patient'
    });
    
    // Create test doctors
    const doctor1 = await createTestDoctor({
      firstName: 'Dr. Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@test.com',
      specialty: 'Cardiology',
      experience: 10,
      hourlyRate: 150
    });
    
    const doctor2 = await createTestDoctor({
      firstName: 'Dr. Michael',
      lastName: 'Brown',
      email: 'michael.brown@test.com',
      specialty: 'Psychology',
      experience: 8,
      hourlyRate: 120
    });
    
    // Create test appointments
    const appointment1 = await createTestAppointment(
      {
        service: generalConsultation.name,
        consultationType: 'video',
        symptoms: 'Chest pain and shortness of breath'
      },
      patient1._id,
      doctor1._id
    );
    
    const appointment2 = await createTestAppointment(
      {
        service: mentalHealth.name,
        consultationType: 'chat',
        symptoms: 'Anxiety and stress management',
        status: 'confirmed'
      },
      patient2._id,
      doctor2._id
    );
    
    console.log('✅ Test database seeding complete');
    
    // Return all created test data
    return {
      services: [generalConsultation, mentalHealth, followUp],
      patients: [patient1, patient2],
      doctors: [doctor1, doctor2],
      appointments: [appointment1, appointment2]
    };
    
  } catch (error) {
    console.error('Failed to seed test database:', error);
    throw error;
  }
};

/**
 * Get test data by type
 * 
 * @param {string} type - Type of data to retrieve (users, doctors, appointments, services)
 * @param {Object} filter - MongoDB filter object
 * @returns {Promise<Array>} Array of documents
 */
const getTestData = async (type, filter = {}) => {
  const db = mongoose.connection.db;
  
  const collectionMap = {
    users: 'users',
    doctors: 'users',
    patients: 'users',
    appointments: 'appointments',
    services: 'services',
    notifications: 'notifications'
  };
  
  const collectionName = collectionMap[type];
  if (!collectionName) {
    throw new Error(`Invalid data type: ${type}`);
  }
  
  // Add role filter for doctors and patients
  if (type === 'doctors') {
    filter.role = 'doctor';
  } else if (type === 'patients') {
    filter.role = 'patient';
  }
  
  return await db.collection(collectionName).find(filter).toArray();
};

/**
 * Create test JWT token for authentication
 * 
 * @param {Object} payload - JWT payload (user data)
 * @returns {string} JWT token
 */
const createTestJWT = (payload) => {
  const jwt = require('jsonwebtoken');
  
  const defaultPayload = {
    id: payload._id || payload.id,
    email: payload.email,
    role: payload.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  return jwt.sign(defaultPayload, testConfig.auth.jwtSecret);
};

// Export all database helper functions
module.exports = {
  connectTestDatabase,
  disconnectTestDatabase,
  cleanupTestDatabase,
  createTestUser,
  createTestDoctor,
  createTestAppointment,
  createTestService,
  seedTestDatabase,
  getTestData,
  createTestJWT
};

// CLI support for running database operations
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'setup':
      connectTestDatabase()
        .then(() => seedTestDatabase())
        .then(() => {
          console.log('✅ Test database setup complete');
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Test database setup failed:', error);
          process.exit(1);
        });
      break;
      
    case 'cleanup':
      connectTestDatabase()
        .then(() => cleanupTestDatabase())
        .then(() => disconnectTestDatabase())
        .then(() => {
          console.log('✅ Test database cleanup complete');
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Test database cleanup failed:', error);
          process.exit(1);
        });
      break;
      
    case 'seed':
      connectTestDatabase()
        .then(() => seedTestDatabase())
        .then(() => {
          console.log('✅ Test database seeding complete');
          process.exit(0);
        })
        .catch(error => {
          console.error('❌ Test database seeding failed:', error);
          process.exit(1);
        });
      break;
      
    default:
      console.log('Usage: node database-helpers.js [setup|cleanup|seed]');
      process.exit(1);
  }
} 