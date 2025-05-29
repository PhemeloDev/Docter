const steps = [
  {
    id: 1,
    title: 'Sign Up and Choose a Service',
    description: 'Create an account and select the type of medical consultation you need.',
    icon: '👤'
  },
  {
    id: 2,
    title: 'Book an Appointment',
    description: 'Select a doctor and schedule a time that works best for you.',
    icon: '📅'
  },
  {
    id: 3,
    title: 'See a Doctor via Video or Chat',
    description: 'Connect with your doctor through secure video or chat for your consultation.',
    icon: '🎥'
  }
];

const HowItWorks = () => {
  return (
    <section className="container-section bg-light-gray">
      <div className="container-max">
        <h2 className="text-center mb-12">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className="card text-center"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="mb-3">{step.title}</h3>
              <p className="text-text-secondary">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 