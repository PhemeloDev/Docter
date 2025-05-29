import Link from 'next/link';

const services = [
  {
    id: 1,
    title: 'General Consultations',
    description: 'Consult with a general practitioner for common health concerns and medical advice.',
    icon: '🩺',
    link: '/services/general'
  },
  {
    id: 2,
    title: 'Mental Health',
    description: 'Speak with licensed therapists and psychiatrists for mental health support.',
    icon: '🧠',
    link: '/services/mental-health'
  },
  {
    id: 3,
    title: 'Pediatrics',
    description: 'Professional care for your children from experienced pediatricians.',
    icon: '👶',
    link: '/services/pediatrics'
  },
  {
    id: 4,
    title: 'Dermatology',
    description: 'Get skin conditions diagnosed and treated by dermatology specialists.',
    icon: '✨',
    link: '/services/dermatology'
  },
  {
    id: 5,
    title: 'Prescription Refills',
    description: 'Easily renew your prescriptions without visiting a physical pharmacy.',
    icon: '💊',
    link: '/services/prescriptions'
  }
];

const KeyServices = () => {
  return (
    <section className="container-section bg-white">
      <div className="container-max">
        <h2 className="text-center mb-12">
          Our Key Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link 
              key={service.id} 
              href={service.link}
              className="card block group"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="mb-3">{service.title}</h3>
              <p className="text-text-secondary mb-4">{service.description}</p>
              <span className="text-primary font-medium group-hover:text-primary-hover transition-colors">
                Learn more →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyServices; 