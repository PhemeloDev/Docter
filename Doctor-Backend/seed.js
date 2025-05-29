const mongoose = require('mongoose');
require('dotenv').config();
const seedServices = require('./seeders/services');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Seed services
    await seedServices();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run seeder
connectDB().then(() => {
  seedDatabase();
}); 