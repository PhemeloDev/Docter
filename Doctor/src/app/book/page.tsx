'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  duration: number;
  icon: string;
}

interface Doctor {
  _id: string;
  user: {
    name: string;
    email: string;
    profilePicture?: string;
  };
  specialty: string;
  yearsOfExperience: number;
  rating: {
    average: number;
    count: number;
  };
  consultationFee: number;
  bio: string;
}

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    reasonForVisit: '',
    symptoms: '',
    type: 'video'
  });

  // Mock data for development
  useEffect(() => {
    setServices([
      {
        _id: '1',
        name: 'General Consultation',
        description: 'Comprehensive consultation with a licensed general practitioner',
        category: 'General Consultations',
        basePrice: 75,
        duration: 30,
        icon: '🩺'
      },
      {
        _id: '2',
        name: 'Mental Health Consultation',
        description: 'Professional mental health support with licensed therapists',
        category: 'Mental Health',
        basePrice: 120,
        duration: 45,
        icon: '🧠'
      },
      {
        _id: '3',
        name: 'Pediatric Consultation',
        description: 'Specialized care for children from birth to 18 years old',
        category: 'Pediatrics',
        basePrice: 90,
        duration: 30,
        icon: '👶'
      }
    ]);

    setDoctors([
      {
        _id: '1',
        user: {
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@healthhive.com'
        },
        specialty: 'General Practice',
        yearsOfExperience: 8,
        rating: { average: 4.8, count: 156 },
        consultationFee: 75,
        bio: 'Experienced general practitioner with a focus on preventive care and patient education.'
      },
      {
        _id: '2',
        user: {
          name: 'Dr. Michael Chen',
          email: 'michael.chen@healthhive.com'
        },
        specialty: 'Mental Health',
        yearsOfExperience: 12,
        rating: { average: 4.9, count: 203 },
        consultationFee: 120,
        bio: 'Licensed psychiatrist specializing in anxiety, depression, and stress management.'
      }
    ]);
  }, []);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
  };

  const handleBooking = async () => {
    setLoading(true);
    // Here you would make the API call to book the appointment
    setTimeout(() => {
      setLoading(false);
      alert('Appointment booked successfully!');
    }, 2000);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200 text-black'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                step > stepNumber ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderServiceSelection = () => (
    <div>
      <h2 className="text-center mb-8">Select a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="card cursor-pointer group"
            onClick={() => handleServiceSelect(service)}
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="mb-2">{service.name}</h3>
            <p className="text-content mb-4 text-sm">{service.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-primary">${service.basePrice}</span>
              <span className="text-sm text-content">{service.duration} min</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDoctorSelection = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Choose Your Doctor</h2>
        <button
          onClick={() => setStep(1)}
          className="btn-secondary text-sm"
        >
          Change Service
        </button>
      </div>

      {selectedService && (
        <div className="bg-primary-light p-4 rounded-lg mb-6">
          <p className="text-sm text-content">Selected Service:</p>
          <p className="font-semibold">{selectedService.name} - ${selectedService.basePrice}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="card cursor-pointer group"
            onClick={() => handleDoctorSelect(doctor)}
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-primary-medium rounded-full flex items-center justify-center text-white font-semibold">
                {doctor.user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h3 className="mb-1">{doctor.user.name}</h3>
                <p className="text-sm text-content mb-2">{doctor.specialty}</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span>⭐ {doctor.rating.average} ({doctor.rating.count})</span>
                  <span>{doctor.yearsOfExperience} years exp.</span>
                </div>
                <p className="text-xs text-content mt-2 line-clamp-2">{doctor.bio}</p>
                <p className="text-lg font-semibold text-primary mt-2">${doctor.consultationFee}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppointmentScheduling = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Schedule Your Appointment</h2>
        <button
          onClick={() => setStep(2)}
          className="btn-secondary text-sm"
        >
          Change Doctor
        </button>
      </div>

      {selectedDoctor && (
        <div className="bg-primary-light p-4 rounded-lg mb-6">
          <p className="text-sm text-content">Appointment with:</p>
          <p className="font-semibold">{selectedDoctor.user.name} - {selectedService?.name}</p>
          <p className="text-primary font-semibold">${selectedDoctor.consultationFee}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="mb-4">Appointment Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Date</label>
              <input
                type="date"
                className="form-input"
                value={appointmentData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Preferred Time</label>
              <select
                className="form-input"
                value={appointmentData.time}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, time: e.target.value }))}
              >
                <option value="">Select a time</option>
                {generateTimeSlots().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Consultation Type</label>
              <select
                className="form-input"
                value={appointmentData.type}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="video">Video Call</option>
                <option value="chat">Chat</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4">Medical Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Reason for Visit</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Brief description of your concern..."
                value={appointmentData.reasonForVisit}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, reasonForVisit: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Symptoms (Optional)</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Any symptoms you're experiencing..."
                value={appointmentData.symptoms}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, symptoms: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold">Total: ${selectedDoctor?.consultationFee}</p>
            <p className="text-sm text-content">Payment will be processed securely</p>
          </div>
          <button
            onClick={handleBooking}
            disabled={loading || !appointmentData.date || !appointmentData.time || !appointmentData.reasonForVisit}
            className="btn-primary"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container-section">
        <div className="container-max">
          {renderStepIndicator()}
          
          {step === 1 && renderServiceSelection()}
          {step === 2 && renderDoctorSelection()}
          {step === 3 && renderAppointmentScheduling()}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage; 