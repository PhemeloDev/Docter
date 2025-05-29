import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

const services = [
  {
    id: 1,
    name: 'General Consultations',
    description: 'Comprehensive consultation with licensed general practitioners for common health concerns, symptoms assessment, and medical advice.',
    price: 75,
    duration: 30,
    icon: '🩺',
    features: [
      'Symptom assessment and diagnosis',
      'Medical advice and treatment plans',
      'Prescription management',
      'Referrals to specialists when needed',
      'Follow-up care coordination'
    ],
    popular: true
  },
  {
    id: 2,
    name: 'Mental Health',
    description: 'Professional mental health support with licensed therapists and psychiatrists for anxiety, depression, stress management, and other concerns.',
    price: 120,
    duration: 45,
    icon: '🧠',
    features: [
      'Anxiety and depression counseling',
      'Stress management techniques',
      'Medication management',
      'Crisis intervention support',
      'Ongoing therapy sessions'
    ]
  },
  {
    id: 3,
    name: 'Pediatrics',
    description: 'Specialized care for children from birth to 18 years old, including wellness checks, illness consultations, and parental guidance.',
    price: 90,
    duration: 30,
    icon: '👶',
    features: [
      'Wellness checks and vaccinations',
      'Developmental assessments',
      'Common childhood illnesses',
      'Parent education and guidance',
      'Growth monitoring'
    ]
  },
  {
    id: 4,
    name: 'Dermatology',
    description: 'Expert skin condition diagnosis and treatment from board-certified dermatologists for acne, rashes, moles, and other skin concerns.',
    price: 110,
    duration: 25,
    icon: '✨',
    features: [
      'Acne treatment and management',
      'Skin cancer screening',
      'Rash and allergy diagnosis',
      'Prescription dermatological treatments',
      'Cosmetic dermatology advice'
    ]
  },
  {
    id: 5,
    name: 'Prescription Refills',
    description: 'Quick and convenient prescription renewals for existing medications with licensed physicians.',
    price: 35,
    duration: 15,
    icon: '💊',
    features: [
      'Medication review and renewal',
      'Dosage adjustments',
      'Drug interaction checks',
      'Alternative medication options',
      'Pharmacy coordination'
    ]
  },
  {
    id: 6,
    name: 'Urgent Care',
    description: 'Immediate medical attention for non-emergency conditions that require prompt care.',
    price: 95,
    duration: 20,
    icon: '⚡',
    features: [
      'Same-day appointments',
      'Urgent symptom evaluation',
      'Minor injury assessment',
      'Infection diagnosis and treatment',
      'Emergency referrals when needed'
    ]
  }
];

const specialties = [
  'Internal Medicine',
  'Family Medicine',
  'Psychiatry',
  'Psychology',
  'Pediatrics',
  'Dermatology',
  'Cardiology',
  'Endocrinology'
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="container-section hero-gradient">
          <div className="container-max text-center">
            <h1 className="mb-4">Our Medical Services</h1>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Access high-quality healthcare from the comfort of your home with our comprehensive range of medical services.
            </p>
            <Link href="/book" className="btn-primary">
              Book an Appointment
            </Link>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container-section">
          <div className="container-max">
            <h2 className="text-center mb-12">Available Services</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.id} className="card relative">
                  {service.popular && (
                    <div className="absolute -top-3 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="mb-3">{service.name}</h3>
                  <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-primary">${service.price}</span>
                      <span className="text-sm text-text-secondary">{service.duration} minutes</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">What&apos;s Included:</h4>
                    <ul className="space-y-1">
                      {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-sm text-text-secondary flex items-center">
                          <span className="text-primary mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                      {service.features.length > 3 && (
                        <li className="text-sm text-text-secondary">
                          + {service.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                  </div>

                  <Link 
                    href={`/book?service=${service.id}`}
                    className="btn-primary w-full text-center block"
                  >
                    Book Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section className="container-section bg-light-gray">
          <div className="container-max">
            <h2 className="text-center mb-8">Medical Specialties</h2>
            <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
              Our network includes board-certified physicians across various specialties to meet all your healthcare needs.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {specialties.map((specialty, index) => (
                <div key={index} className="bg-white p-4 rounded-lg text-center shadow-sm">
                  <p className="font-medium">{specialty}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container-section">
          <div className="container-max">
            <h2 className="text-center mb-12">How Our Services Work</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="mb-3">1. Choose Your Service</h3>
                <p className="text-text-secondary">
                  Select the medical service that best fits your needs from our comprehensive list.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <h3 className="mb-3">2. Meet Your Doctor</h3>
                <p className="text-text-secondary">
                  Connect with a licensed healthcare provider who specializes in your area of concern.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💊</span>
                </div>
                <h3 className="mb-3">3. Get Treatment</h3>
                <p className="text-text-secondary">
                  Receive personalized care, prescriptions, and follow-up recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Insurance and Pricing */}
        <section className="container-section bg-light-gray">
          <div className="container-max">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="mb-6">Transparent Pricing</h2>
                <p className="text-text-secondary mb-6">
                  We believe in transparent, upfront pricing with no hidden fees. Pay only for the services you need.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    No subscription fees
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    Pay per consultation
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    Insurance accepted for eligible services
                  </li>
                  <li className="flex items-center">
                    <span className="text-primary mr-3">✓</span>
                    HSA/FSA eligible
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="mb-4">Average Savings</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Urgent Care Visit</span>
                    <span className="font-semibold">Save $150+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Specialist Consultation</span>
                    <span className="font-semibold">Save $200+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mental Health Session</span>
                    <span className="font-semibold">Save $100+</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-text-secondary">
                    *Compared to average in-person visit costs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-section">
          <div className="container-max text-center">
            <h2 className="mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
              Take the first step towards convenient, quality healthcare. Book your appointment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="btn-primary">
                Book an Appointment
              </Link>
              <Link href="/contact" className="btn-secondary">
                Have Questions?
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
} 