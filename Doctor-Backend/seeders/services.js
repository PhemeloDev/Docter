const mongoose = require('mongoose');
const Service = require('../models/Service');

const services = [
  {
    name: 'General Consultation',
    description: 'Comprehensive consultation with a licensed general practitioner for common health concerns, symptoms assessment, and medical advice.',
    category: 'General Consultations',
    basePrice: 75,
    duration: 30,
    icon: '🩺',
    tags: ['consultation', 'general', 'primary care'],
    requirements: ['Valid ID', 'Medical history form']
  },
  {
    name: 'Mental Health Consultation',
    description: 'Professional mental health support with licensed therapists and psychiatrists for anxiety, depression, stress management, and other mental health concerns.',
    category: 'Mental Health',
    basePrice: 120,
    duration: 45,
    icon: '🧠',
    tags: ['mental health', 'therapy', 'counseling', 'psychiatry'],
    requirements: ['Mental health screening form', 'Previous treatment history if applicable']
  },
  {
    name: 'Pediatric Consultation',
    description: 'Specialized care for children from birth to 18 years old, including wellness checks, illness consultations, and parental guidance.',
    category: 'Pediatrics',
    basePrice: 90,
    duration: 30,
    icon: '👶',
    tags: ['pediatrics', 'children', 'kids health', 'vaccination'],
    requirements: ['Parent/guardian consent', 'Child vaccination records', 'Growth chart if available']
  },
  {
    name: 'Dermatology Consultation',
    description: 'Expert skin condition diagnosis and treatment from board-certified dermatologists for acne, rashes, moles, and other skin concerns.',
    category: 'Dermatology',
    basePrice: 110,
    duration: 25,
    icon: '✨',
    tags: ['dermatology', 'skin care', 'acne', 'rashes'],
    requirements: ['Clear photos of affected areas', 'Previous treatment history']
  },
  {
    name: 'Prescription Refill',
    description: 'Quick and convenient prescription renewals for existing medications with licensed physicians.',
    category: 'Prescription Refills',
    basePrice: 35,
    duration: 15,
    icon: '💊',
    tags: ['prescription', 'refill', 'medication', 'renewal'],
    requirements: ['Current prescription bottle/label', 'Medication history', 'Valid ID']
  }
];

const seedServices = async () => {
  try {
    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert new services
    const createdServices = await Service.insertMany(services);
    console.log(`Created ${createdServices.length} services`);
    
    return createdServices;
  } catch (error) {
    console.error('Error seeding services:', error);
    throw error;
  }
};

module.exports = seedServices; 