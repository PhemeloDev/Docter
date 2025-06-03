import Link from 'next/link';
import { FaStethoscope, FaBrain, FaBaby, FaStar, FaPills } from 'react-icons/fa';

const KeyServices = () => {
  return (
    <section className="container-section bg-white">
      <div className="container-max">
        <h2 className="text-center mb-12">
          Our Key Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <Link 
            href="/services/general"
            className="card block group mb-0"
          >
            <div className="text-4xl mb-4 text-primary">
              <FaStethoscope />
            </div>
            <h3 className="mb-3">General Consultations</h3>
            <p className="text-content mb-4">Consult with a general practitioner for common health concerns and medical advice.</p>
            <span className="text-primary font-medium group-hover:text-primary-hover transition-colors">
              Learn more →
            </span>
          </Link>
          
          <Link 
            href="/services/mental-health"
            className="card block group mb-0"
          >
            <div className="text-4xl mb-4 text-primary">
              <FaBrain />
            </div>
            <h3 className="mb-3">Mental Health</h3>
            <p className="text-content mb-4">Speak with licensed therapists and psychiatrists for mental health support.</p>
            <span className="text-primary font-medium group-hover:text-primary-hover transition-colors">
              Learn more →
            </span>
          </Link>
          
          <Link 
            href="/services/pediatrics"
            className="card block group mb-0"
          >
            <div className="text-4xl mb-4 text-primary">
              <FaBaby />
            </div>
            <h3 className="mb-3">Pediatrics</h3>
            <p className="text-content mb-4">Professional care for your children from experienced pediatricians.</p>
            <span className="text-primary font-medium group-hover:text-primary-hover transition-colors">
              Learn more →
            </span>
          </Link>
          
          <Link 
            href="/services/dermatology"
            className="card block group mb-0"
          >
            <div className="text-4xl mb-4 text-primary">
              <FaStar />
            </div>
            <h3 className="mb-3">Dermatology</h3>
            <p className="text-content mb-4">Get skin conditions diagnosed and treated by dermatology specialists.</p>
            <span className="text-primary font-medium group-hover:text-primary-hover transition-colors">
              Learn more →
            </span>
          </Link>
          
          <Link 
            href="/services/prescriptions"
            className="card block group mb-0"
          >
            <div className="text-4xl mb-4 text-primary">
              <FaPills />
            </div>
            <h3 className="mb-3">Prescription Refills</h3>
            <p className="text-content mb-4">Easily renew your prescriptions without visiting a physical pharmacy.</p>
            <span className="text-primary font-medium group-hover:text-primary-hover transition-colors">
              Learn more →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default KeyServices; 