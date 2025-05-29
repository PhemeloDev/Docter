import Link from 'next/link';
import { 
  FiActivity, 
  FiHeart, 
  FiUsers, 
  FiCamera, 
  FiFileText 
} from 'react-icons/fi';

const services = [
  {
    id: 1,
    title: 'General Consultations',
    description: 'Consult with a general practitioner for common health concerns and medical advice.',
    icon: <FiActivity className="w-10 h-10 text-blue-500" />,
    link: '/services/general'
  },
  {
    id: 2,
    title: 'Mental Health',
    description: 'Speak with licensed therapists and psychiatrists for mental health support.',
    icon: <FiHeart className="w-10 h-10 text-blue-500" />,
    link: '/services/mental-health'
  },
  {
    id: 3,
    title: 'Pediatrics',
    description: 'Professional care for your children from experienced pediatricians.',
    icon: <FiUsers className="w-10 h-10 text-blue-500" />,
    link: '/services/pediatrics'
  },
  {
    id: 4,
    title: 'Dermatology',
    description: 'Get skin conditions diagnosed and treated by dermatology specialists.',
    icon: <FiCamera className="w-10 h-10 text-blue-500" />,
    link: '/services/dermatology'
  },
  {
    id: 5,
    title: 'Prescription Refills',
    description: 'Easily renew your prescriptions without visiting a physical pharmacy.',
    icon: <FiFileText className="w-10 h-10 text-blue-500" />,
    link: '/services/prescriptions'
  }
];

const KeyServices = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Key Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link 
              key={service.id} 
              href={service.link}
              className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <span className="text-blue-600 font-medium">Learn more &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyServices; 