import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="section-padding hero-gradient">
      <div className="container-max">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-display mb-6">
              See a Doctor Online, <span className="text-primary">Anytime</span>
            </h1>
            <p className="text-subtitle mb-8 max-w-lg mx-auto lg:mx-0">
              Get expert medical advice, prescriptions, and more — from the comfort of your home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="/book" 
                className="btn-primary btn-lg hover-lift focus-ring"
              >
                Book an Appointment
              </Link>
              <Link 
                href="/services" 
                className="btn-secondary hover-lift focus-ring"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="relative h-[400px] md:h-[500px] w-full">
              <Image
                src="/images/dr-image.jpg"
                alt="Friendly doctor on video call with patient"
                fill
                className="object-cover rounded-2xl shadow-strong hover-scale"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 