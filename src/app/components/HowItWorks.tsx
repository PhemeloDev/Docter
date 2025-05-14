import { FiUserPlus, FiCalendar, FiVideo } from 'react-icons/fi';

const steps = [
  {
    id: 1,
    title: 'Sign Up and Choose a Service',
    description: 'Create an account and select the type of medical consultation you need.',
    icon: <FiUserPlus className="w-8 h-8 text-blue-500" />
  },
  {
    id: 2,
    title: 'Book an Appointment',
    description: 'Select a doctor and schedule a time that works best for you.',
    icon: <FiCalendar className="w-8 h-8 text-blue-500" />
  },
  {
    id: 3,
    title: 'See a Doctor via Video or Chat',
    description: 'Connect with your doctor through secure video or chat for your consultation.',
    icon: <FiVideo className="w-8 h-8 text-blue-500" />
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 