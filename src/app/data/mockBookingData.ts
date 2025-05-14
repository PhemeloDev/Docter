import React from 'react';
import { FiActivity, FiHeart, FiUsers, FiCamera, FiFileText } from 'react-icons/fi';

export interface Service {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  relevantSpecialties: string[];
}

export const services: Service[] = [
  { id: 'general', name: 'General Consultation', icon: FiActivity, description: 'Consult with a general practitioner for common health concerns', relevantSpecialties: ['General Practitioner'] },
  { id: 'mental', name: 'Mental Health', icon: FiHeart, description: 'Speak with licensed therapists and psychiatrists', relevantSpecialties: ['Psychiatrist', 'Mental Health Specialist'] },
  { id: 'pediatrics', name: 'Pediatrics', icon: FiUsers, description: 'Professional care for your children', relevantSpecialties: ['Pediatrician'] },
  { id: 'dermatology', name: 'Dermatology', icon: FiCamera, description: 'Get skin conditions diagnosed and treated', relevantSpecialties: ['Dermatologist'] },
  { id: 'prescription', name: 'Prescription Refill', icon: FiFileText, description: 'Easily renew your prescriptions', relevantSpecialties: ['General Practitioner', 'Psychiatrist', 'Pediatrician', 'Dermatologist'] }
];

export const doctors = [
  { id: 'dr-smith', name: 'Dr. Jessica Smith', specialty: 'General Practitioner' },
  { id: 'dr-patel', name: 'Dr. Raj Patel', specialty: 'Pediatrician' },
  { id: 'dr-chen', name: 'Dr. Wei Chen', specialty: 'Dermatologist' },
  { id: 'dr-rodriguez', name: 'Dr. Maria Rodriguez', specialty: 'Psychiatrist' },
  { id: 'dr-johnson', name: 'Dr. Michael Johnson', specialty: 'General Practitioner' },
  { id: 'dr-kim', name: 'Dr. Soo-Jin Kim', specialty: 'Mental Health Specialist' }
];

export const timeSlots = [
  '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
]; 