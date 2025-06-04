import { FaUser, FaCalendarAlt, FaVideo } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <section className="section-padding bg-light-gray">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="mb-4">How It Works</h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Get started with our simple 3-step process for online healthcare
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card card-elevated text-center hover-lift">
            <div className="relative">
              <div className="text-5xl mb-6 text-primary">
                <FaUser />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
            </div>
            <h3 className="mb-4">Sign Up and Choose a Service</h3>
            <p className="text-content leading-relaxed">Create an account and select the type of medical consultation you need.</p>
          </div>
          
          <div className="card card-elevated text-center hover-lift">
            <div className="relative">
              <div className="text-5xl mb-6 text-primary">
                <FaCalendarAlt />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
            </div>
            <h3 className="mb-4">Book an Appointment</h3>
            <p className="text-content leading-relaxed">Select a doctor and schedule a time that works best for you.</p>
          </div>
          
          <div className="card card-elevated text-center hover-lift">
            <div className="relative">
              <div className="text-5xl mb-6 text-primary">
                <FaVideo />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
            </div>
            <h3 className="mb-4">See a Doctor via Video or Chat</h3>
            <p className="text-content leading-relaxed">Connect with your doctor through secure video or chat for your consultation.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 