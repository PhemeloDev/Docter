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
    <div className="flex justify-center mb-12" style={{padding: '20px'}}>
      <div style={{clear: 'both', padding: '10px'}}></div>
      <div className="flex items-center space-x-6">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${
              step >= stepNumber ? 'bg-primary text-white' : 'bg-gray-200 text-black'
            }`} style={{margin: '8px'}}>
              {stepNumber}
            </div>
            <div style={{clear: 'both', padding: '5px'}}></div>
            {stepNumber < 3 && (
              <div className={`w-20 h-2 mx-4 ${
                step > stepNumber ? 'bg-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
      <div style={{clear: 'both', padding: '15px'}}></div>
    </div>
  );

  const renderServiceSelection = () => (
    <div style={{padding: '20px'}}>
      <h2 className="text-center mb-8">Select a Service</h2>
      <div style={{clear: 'both', padding: '10px'}}></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service._id}
            className="card cursor-pointer group"
            onClick={() => handleServiceSelect(service)}
            style={{padding: '30px', margin: '15px'}}
          >
            <div className="text-4xl mb-6">{service.icon}</div>
            <div style={{clear: 'both', padding: '5px'}}></div>
            <h3 className="mb-4">{service.name}</h3>
            <div style={{clear: 'both', padding: '5px'}}></div>
            <p className="text-content mb-6 text-sm">{service.description}</p>
            <div style={{clear: 'both', padding: '5px'}}></div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-primary">${service.basePrice}</span>
              <span className="text-sm text-content">{service.duration} min</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{clear: 'both', padding: '15px'}}></div>
    </div>
  );

  const renderDoctorSelection = () => (
    <div style={{padding: '20px'}}>
      <div className="flex justify-between items-center mb-8" style={{padding: '15px'}}>
        <h2>Choose Your Doctor</h2>
        <div style={{clear: 'both', padding: '10px'}}></div>
        <button
          onClick={() => setStep(1)}
          className="btn-secondary text-sm"
          style={{margin: '10px'}}
        >
          Change Service
        </button>
      </div>
      <div style={{clear: 'both', padding: '15px'}}></div>
      {selectedService && (
        <div className="bg-primary-light rounded-lg mb-8" style={{color: 'black', padding: '20px', margin: '15px'}}>
          <p className="text-sm text-content mb-2">Selected Service:</p>
          <div style={{clear: 'both', padding: '5px'}}></div>
          <p className="font-semibold">{selectedService.name} - ${selectedService.basePrice}</p>
        </div>        
      )}
      <div style={{clear: 'both', padding: '15px'}}></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="card cursor-pointer group"
            onClick={() => handleDoctorSelect(doctor)}
            style={{padding: '25px', margin: '15px'}}
          >
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-primary-medium rounded-full flex items-center justify-center text-white font-semibold">
                {doctor.user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <div className="flex-1">
                <h3 className="mb-3">{doctor.user.name}</h3>
                <div style={{clear: 'both', padding: '3px'}}></div>
                <p className="text-sm text-content mb-3">{doctor.specialty}</p>
                <div style={{clear: 'both', padding: '3px'}}></div>
                <div className="flex items-center space-x-4 text-sm mb-3">
                  <span>⭐ {doctor.rating.average} ({doctor.rating.count})</span>
                  <span>{doctor.yearsOfExperience} years exp.</span>
                </div>
                <div style={{clear: 'both', padding: '3px'}}></div>
                <p className="text-xs text-content mt-3 line-clamp-2">{doctor.bio}</p>
                <div style={{clear: 'both', padding: '5px'}}></div>
                <p className="text-lg font-semibold text-primary mt-4">${doctor.consultationFee}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{clear: 'both', padding: '15px'}}></div>
    </div>
  );

  const renderAppointmentScheduling = () => (
    <div style={{padding: '20px'}}>
      <div className="flex justify-between items-center mb-8" style={{padding: '15px'}}>
        <h2>Schedule Your Appointment</h2>
        <div style={{clear: 'both', padding: '10px'}}></div>
        <button
          onClick={() => setStep(2)}
          className="btn-secondary text-sm"
          style={{margin: '10px'}}
        >
          Change Doctor
        </button>
      </div>
      <div style={{clear: 'both', padding: '15px'}}></div>

      {selectedDoctor && (
        <div className="bg-primary-light rounded-lg mb-8" style={{padding: '20px', margin: '15px', color: 'black'}}>
          <p className="text-sm text-content mb-2">Appointment with:</p>
          <div style={{clear: 'both', padding: '5px'}}></div>
          <p className="font-semibold">{selectedDoctor.user.name} - {selectedService?.name}</p>
          <div style={{clear: 'both', padding: '5px'}}></div>
          <p className="text-primary font-semibold">${selectedDoctor.consultationFee}</p>
        </div>
      )}
      <div style={{clear: 'both', padding: '15px'}}></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10" style={{padding: '15px'}}>
        <div style={{padding: '20px'}}>
          <h3 className="mb-6">Appointment Details</h3>
          <div style={{clear: 'both', padding: '10px'}}></div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Preferred Date</label>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <input
                type="date"
                className="form-input"
                value={appointmentData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, date: e.target.value }))}
                style={{margin: '5px'}}
              />
            </div>
            <div style={{clear: 'both', padding: '10px'}}></div>

            <div>
              <label className="block text-sm font-medium mb-3">Preferred Time</label>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <select
                className="form-input"
                value={appointmentData.time}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, time: e.target.value }))}
                style={{margin: '5px'}}
              >
                <option value="">Select a time</option>
                {generateTimeSlots().map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div style={{clear: 'both', padding: '10px'}}></div>

            <div>
              <label className="block text-sm font-medium mb-3">Consultation Type</label>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <select
                className="form-input"
                value={appointmentData.type}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, type: e.target.value }))}
                style={{margin: '5px'}}
              >
                <option value="video">Video Call</option>
                <option value="chat">Chat</option>
                <option value="phone">Phone Call</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{padding: '20px'}}>
          <h3 className="mb-6">Medical Information</h3>
          <div style={{clear: 'both', padding: '10px'}}></div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Reason for Visit</label>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Brief description of your concern..."
                value={appointmentData.reasonForVisit}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, reasonForVisit: e.target.value }))}
                style={{margin: '5px'}}
              />
            </div>
            <div style={{clear: 'both', padding: '10px'}}></div>

            <div>
              <label className="block text-sm font-medium mb-3">Symptoms (Optional)</label>
              <div style={{clear: 'both', padding: '5px'}}></div>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Any symptoms you're experiencing..."
                value={appointmentData.symptoms}
                onChange={(e) => setAppointmentData(prev => ({ ...prev, symptoms: e.target.value }))}
                style={{margin: '5px'}}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{clear: 'both', padding: '20px'}}></div>

      <div className="mt-10 pt-8 border-t" style={{padding: '20px', margin: '15px'}}>
        <div className="flex justify-between items-center">
          <div style={{padding: '15px'}}>
            <p className="text-lg font-semibold mb-2">Total: ${selectedDoctor?.consultationFee}</p>
            <div style={{clear: 'both', padding: '5px'}}></div>
            <p className="text-sm text-content">Payment will be processed securely</p>
          </div>
          <div style={{clear: 'both', padding: '10px'}}></div>
          <button
            onClick={handleBooking}
            disabled={loading || !appointmentData.date || !appointmentData.time || !appointmentData.reasonForVisit}
            className="btn-primary"
            style={{margin: '15px', padding: '15px 30px'}}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </div>
      <div style={{clear: 'both', padding: '20px'}}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div style={{clear: 'both', padding: '20px'}}></div>
      
      <main className="container-section" style={{padding: '30px', margin: '20px'}}>
        <div className="container-max" style={{padding: '25px'}}>
          <div style={{clear: 'both', padding: '15px'}}></div>
          {renderStepIndicator()}
          <div style={{clear: 'both', padding: '20px'}}></div>
          
          {step === 1 && renderServiceSelection()}
          {step === 2 && renderDoctorSelection()}
          {step === 3 && renderAppointmentScheduling()}
          
          <div style={{clear: 'both', padding: '25px'}}></div>
        </div>
      </main>
      <div style={{clear: 'both', padding: '20px'}}></div>

      <Footer />
    </div>
  );
};

export default BookingPage; 