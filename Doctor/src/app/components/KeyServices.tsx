import Link from 'next/link';
import { FaStethoscope, FaBrain, FaBaby, FaStar, FaPills } from 'react-icons/fa';

const KeyServices = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-6">Our Key Services</h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Professional healthcare services delivered through secure, convenient online consultations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link 
            href="/services/general"
            className="card card-interactive hover-lift focus-ring group p-8"
          >
            <div className="text-5xl mb-6 text-primary transition-transform duration-300 group-hover:scale-110">
              <FaStethoscope />
            </div>
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">General Consultations</h3>
            <p className="text-content mb-6 leading-relaxed">Consult with a general practitioner for common health concerns and medical advice.</p>
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
              <span>Learn more</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          
          <Link 
            href="/services/mental-health"
            className="card card-interactive hover-lift focus-ring group p-8"
          >
            <div className="text-5xl mb-6 text-primary transition-transform duration-300 group-hover:scale-110">
              <FaBrain />
            </div>
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Mental Health</h3>
            <p className="text-content mb-6 leading-relaxed">Speak with licensed therapists and psychiatrists for mental health support.</p>
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
              <span>Learn more</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          
          <Link 
            href="/services/pediatrics"
            className="card card-interactive hover-lift focus-ring group p-8"
          >
            <div className="text-5xl mb-6 text-primary transition-transform duration-300 group-hover:scale-110">
              <FaBaby />
            </div>
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Pediatrics</h3>
            <p className="text-content mb-6 leading-relaxed">Professional care for your children from experienced pediatricians.</p>
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
              <span>Learn more</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          
          <Link 
            href="/services/dermatology"
            className="card card-interactive hover-lift focus-ring group p-8"
          >
            <div className="text-5xl mb-6 text-primary transition-transform duration-300 group-hover:scale-110">
              <FaStar />
            </div>
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Dermatology</h3>
            <p className="text-content mb-6 leading-relaxed">Get skin conditions diagnosed and treated by dermatology specialists.</p>
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
              <span>Learn more</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          
          <Link 
            href="/services/prescriptions"
            className="card card-interactive hover-lift focus-ring group p-8"
          >
            <div className="text-5xl mb-6 text-primary transition-transform duration-300 group-hover:scale-110">
              <FaPills />
            </div>
            <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">Prescription Refills</h3>
            <p className="text-content mb-6 leading-relaxed">Easily renew your prescriptions without visiting a physical pharmacy.</p>
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
              <span>Learn more</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default KeyServices; 