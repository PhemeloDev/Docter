import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="container-section hero-gradient">
      <div className="container-max">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <h1 className="mb-4">
              See a Doctor Online, Anytime
            </h1>
            <p className="text-xl text-text-secondary mb-8">
              Get expert medical advice, prescriptions, and more — from the comfort of your home.
            </p>
            <Link 
              href="/book" 
              className="btn-primary inline-block"
            >
              Book an Appointment
            </Link>
          </div>
          <div className="w-full md:w-1/2">
            <div className="relative h-[400px] w-full">
              <Image
                src="/images/dr-image.jpg"
                alt="Friendly doctor on video call with patient"
                fill
                className="object-cover rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 