import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingForm from '../components/BookingForm';

export default function BookingPage() {
  return (
    <main>
      <Header />
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Book Your Appointment
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Fill out the form below to schedule your online consultation with one of our doctors.
            </p>
            
            <BookingForm />
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 