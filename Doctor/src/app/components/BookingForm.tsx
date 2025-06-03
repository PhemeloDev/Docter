"use client";

import React, { useState, useMemo } from 'react';
import { FiArrowRight, FiCalendar, FiClock, FiCreditCard } from 'react-icons/fi';
import { services, doctors, timeSlots } from '../data/mockBookingData';
import type { Service } from '../data/mockBookingData';

const BookingForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    doctor: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    paymentMethod: 'credit-card'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // If service changes, reset doctor as the list might change
    if (name === 'service') {
      setFormData({ ...formData, [name]: value, doctor: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const selectService = (serviceId: string) => {
    setFormData({ ...formData, service: serviceId, doctor: '' }); // Reset doctor when service changes
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Booking submitted successfully!\n' + JSON.stringify(formData, null, 2));
  };

  const selectedServiceDetails = useMemo(() => {
    return services.find(s => s.id === formData.service);
  }, [formData.service]);

  const filteredDoctors = useMemo(() => {
    if (!selectedServiceDetails) return doctors; // Show all if no service selected or service not found
    return doctors.filter(doctor => 
      selectedServiceDetails.relevantSpecialties.includes(doctor.specialty)
    );
  }, [selectedServiceDetails]);

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Step 1: Choose Service
  const renderStep1 = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Choose a Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {services.map((serviceItem: Service) => {
          const IconComponent = serviceItem.icon;
          return (
            <div 
              key={serviceItem.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                formData.service === serviceItem.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => selectService(serviceItem.id)}
            >
              <div className="flex items-center mb-2">
                <IconComponent className="w-6 h-6 text-blue-500" />
                <div className="font-medium ml-2">{serviceItem.name}</div>
              </div>
              <p className="text-sm text-black">{serviceItem.description}</p>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={nextStep}
          disabled={!formData.service}
          className="px-6 py-2 bg-blue-600 text-white rounded-md flex items-center disabled:bg-gray-400"
        >
          Next <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  // Step 2: Select Doctor and Time
  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Select Doctor & Appointment Time</h2>
      <div className="mb-6">
        <label htmlFor="doctor" className="block text-black mb-2">Select Doctor</label>
        <select
          id="doctor"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={!formData.service} // Disable if no service is chosen
        >
          <option value="">{formData.service ? "Choose a doctor" : "Please select a service first"}</option>
          {filteredDoctors.map((doctor) => (
            <option key={doctor.id} value={doctor.id}>
              {doctor.name} - {doctor.specialty}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="date" className="block text-black mb-2">Select Date</label>
        <div className="relative">
          <FiCalendar className="absolute left-3 top-3 text-gray-400" />
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            min={getTodayDateString()} // Prevent selecting past dates
            onChange={handleChange}
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-black mb-2">Select Time</label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {timeSlots.map((time) => (
            <div
              key={time}
              className={`p-3 border rounded-md text-center cursor-pointer transition-colors ${
                formData.time === time 
                  ? 'border-blue-500 bg-blue-50 text-blue-600' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => setFormData({ ...formData, time })}
            >
              <div className="flex items-center justify-center">
                <FiClock className="mr-2" />
                {time}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-2 border border-gray-300 rounded-md"
        >
          Back
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!formData.doctor || !formData.date || !formData.time}
          className="px-6 py-2 bg-blue-600 text-white rounded-md flex items-center disabled:bg-gray-400"
        >
          Next <FiArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );

  // Step 3: Enter Details
  const renderStep3 = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Your Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="firstName" className="block text-black mb-2">First Name</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-black mb-2">Last Name</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="email" className="block text-black mb-2">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label htmlFor="phone" className="block text-black mb-2">Phone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="reason" className="block text-black mb-2">Reason for Visit</label>
        <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows={4} className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
      </div>
      <div className="flex justify-between mt-8">
        <button type="button" onClick={prevStep} className="px-6 py-2 border border-gray-300 rounded-md">Back</button>
        <button type="button" onClick={nextStep} disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone} className="px-6 py-2 bg-blue-600 text-white rounded-md flex items-center disabled:bg-gray-400">Next <FiArrowRight className="ml-2" /></button>
      </div>
    </div>
  );

  // Step 4: Payment
  const renderStep4 = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Payment Information</h2>
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="text-lg font-medium mb-3">Appointment Summary</h3>
        <div className="grid grid-cols-2 gap-y-2">
          <div className="text-black">Service:</div>
          <div>{services.find(s => s.id === formData.service)?.name}</div>
          <div className="text-black">Doctor:</div>
          <div>{doctors.find(d => d.id === formData.doctor)?.name}</div>
          <div className="text-black">Date:</div>
          <div>{formData.date}</div>
          <div className="text-black">Time:</div>
          <div>{formData.time}</div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>$99.00</span> 
          </div>
        </div>
      </div>
      <div className="mb-6">
        <label className="block text-black mb-2">Payment Method</label>
        <div className="space-y-3">
          <label className="flex items-center p-3 border rounded-md cursor-pointer">
            <input type="radio" name="paymentMethod" value="credit-card" checked={formData.paymentMethod === 'credit-card'} onChange={handleChange} className="mr-3" />
            <FiCreditCard className="mr-2" /> Credit Card
          </label>
          <label className="flex items-center p-3 border rounded-md cursor-pointer">
            <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleChange} className="mr-3" />
            PayPal
          </label>
        </div>
      </div>
      {formData.paymentMethod === 'credit-card' && (
        <div>
          <div className="mb-4">
            <label htmlFor="cardNumber" className="block text-gray-700 mb-2">Card Number</label>
            <input type="text" id="cardNumber" placeholder="1234 5678 9012 3456" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="expDate" className="block text-gray-700 mb-2">Expiration Date</label>
              <input type="text" id="expDate" placeholder="MM/YY" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-gray-700 mb-2">CVV</label>
              <input type="text" id="cvv" placeholder="123" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between mt-8">
        <button type="button" onClick={prevStep} className="px-6 py-2 border border-gray-300 rounded-md">Back</button>
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md">Confirm Booking</button>
      </div>
    </div>
  );

  // Progress indicator
  const renderProgressBar = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center w-1/4">
              <div 
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mb-2 transition-all duration-300 ${
                  step >= stepNumber ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
              <div className={`text-xs text-center ${step >= stepNumber ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                {stepNumber === 1 && 'Service'}
                {stepNumber === 2 && 'Schedule'}
                {stepNumber === 3 && 'Details'}
                {stepNumber === 4 && 'Payment'}
              </div>
            </div>
          ))}
        </div>
        <div className="relative mt-2 h-1 bg-gray-200 rounded-full">
          <div 
            className="absolute top-0 left-0 h-1 bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {renderProgressBar()}
      <form onSubmit={handleSubmit}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </form>
    </div>
  );
};

export default BookingForm; 