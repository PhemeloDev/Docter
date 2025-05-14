import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            See a Doctor Online, Anytime
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get expert medical advice, prescriptions, and more — from the comfort of your home.
          </p>
          <Link 
            href="/book" 
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 inline-block"
          >
            Book an Appointment
          </Link>
        </div>
        <div className="w-full md:w-1/2">
          <div className="relative h-[400px] w-full">
            <Image
              src="/images/dr-image.jpg"
              alt="Doctor on video call"
              fill
              className="object-cover rounded-lg shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 