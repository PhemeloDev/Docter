import { FaUser, FaCalendarAlt, FaVideo } from 'react-icons/fa';

const HowItWorks = () => {
  return (
    <section className="container-section bg-light-gray">
      <div className="container-max">
        <h2 className="text-center mb-12">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="card text-center mb-0">
            <div className="text-4xl mb-4 text-primary">
              <FaUser />
            </div>
            <h3 className="mb-3">Sign Up and Choose a Service</h3>
            <p className="text-content">Create an account and select the type of medical consultation you need.</p>
          </div>
          
          <div className="card text-center mb-0">
            <div className="text-4xl mb-4 text-primary">
              <FaCalendarAlt />
            </div>
            <h3 className="mb-3">Book an Appointment</h3>
            <p className="text-content">Select a doctor and schedule a time that works best for you.</p>
          </div>
          
          <div className="card text-center mb-0">
            <div className="text-4xl mb-4 text-primary">
              <FaVideo />
            </div>
            <h3 className="mb-3">See a Doctor via Video or Chat</h3>
            <p className="text-content">Connect with your doctor through secure video or chat for your consultation.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks; 