import Link from 'next/link';
import { FaStethoscope, FaBrain, FaBaby, FaStar, FaPills } from 'react-icons/fa';

const KeyServices = () => {
  return (
    <section className="section-padding bg-white" style={{padding: '40px 20px'}}>
      <div className="container-max" style={{padding: '30px'}}>
        <div style={{clear: 'both', padding: '20px'}}></div>
        <div className="text-center mb-20">
          <h2 className="mb-6">Our Key Services</h2>
          <div style={{clear: 'both', padding: '10px'}}></div>
          <p className="text-subtitle max-w-2xl mx-auto">
            Professional healthcare services delivered through secure, convenient online consultations
          </p>
        </div>
        <div style={{clear: 'both', padding: '25px'}}></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <Link 
            href="/services/general"
            className="card card-interactive hover-lift focus-ring group"
            style={{padding: '35px', margin: '15px'}}
          >
            <div className="text-5xl mb-8 text-primary transition-transform duration-300 group-hover:scale-110">
              <FaStethoscope />
            </div>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <h3 className="mb-5 group-hover:text-primary transition-colors">General Consultations</h3>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <p className="text-content mb-8 leading-relaxed">Consult with a general practitioner for common health concerns and medical advice.</p>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
              <span>Learn more</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          
          <Link 
            href="/services/mental-health"
            className="card card-interactive hover-lift focus-ring group"
            style={{padding: '35px', margin: '15px'}}
          >
            <div className="text-5xl mb-8 text-primary transition-transform duration-300 group-hover:scale-110">
              <FaBrain />
            </div>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <h3 className="mb-5 group-hover:text-primary transition-colors">Mental Health</h3>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <p className="text-content mb-8 leading-relaxed">Speak with licensed therapists and psychiatrists for mental health support.</p>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
              <span>Learn more</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          
          <Link 
            href="/services/pediatrics"
            className="card card-interactive hover-lift focus-ring group"
            style={{padding: '35px', margin: '15px'}}
          >
            <div className="text-5xl mb-8 text-primary transition-transform duration-300 group-hover:scale-110">
              <FaBaby />
            </div>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <h3 className="mb-5 group-hover:text-primary transition-colors">Pediatrics</h3>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <p className="text-content mb-8 leading-relaxed">Professional care for your children from experienced pediatricians.</p>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
              <span>Learn more</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          
          <Link 
            href="/services/dermatology"
            className="card card-interactive hover-lift focus-ring group"
            style={{padding: '35px', margin: '15px'}}
          >
            <div className="text-5xl mb-8 text-primary transition-transform duration-300 group-hover:scale-110">
              <FaStar />
            </div>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <h3 className="mb-5 group-hover:text-primary transition-colors">Dermatology</h3>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <p className="text-content mb-8 leading-relaxed">Get skin conditions diagnosed and treated by dermatology specialists.</p>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
              <span>Learn more</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          
          <Link 
            href="/services/prescriptions"
            className="card card-interactive hover-lift focus-ring group"
            style={{padding: '35px', margin: '15px'}}
          >
            <div className="text-5xl mb-8 text-primary transition-transform duration-300 group-hover:scale-110">
              <FaPills />
            </div>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <h3 className="mb-5 group-hover:text-primary transition-colors">Prescription Refills</h3>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <p className="text-content mb-8 leading-relaxed">Easily renew your prescriptions without visiting a physical pharmacy.</p>
            <div style={{clear: 'both', padding: '8px'}}></div>
            <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
              <span>Learn more</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        </div>
        <div style={{clear: 'both', padding: '30px'}}></div>
      </div>
    </section>
  );
};

export default KeyServices; 