import DoctorCard from '../components/DoctorCard';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Mock data for doctors
const doctors = [
  {
    id: 'dr-smith',
    name: 'Dr. Jessica Smith',
    specialty: 'General Practitioner',
    experience: '10+ years',
    rating: 5,
    languages: ['English', 'Spanish'],
    image: '/images/doctor-1.jpg'
  },
  {
    id: 'dr-patel',
    name: 'Dr. Raj Patel',
    specialty: 'Pediatrician',
    experience: '15+ years',
    rating: 5,
    languages: ['English', 'Hindi', 'Gujarati'],
    image: '/images/doctor-2.jpg'
  },
  {
    id: 'dr-chen',
    name: 'Dr. Wei Chen',
    specialty: 'Dermatologist',
    experience: '12+ years',
    rating: 4,
    languages: ['English', 'Mandarin'],
    image: '/images/doctor-3.jpg'
  },
  {
    id: 'dr-rodriguez',
    name: 'Dr. Maria Rodriguez',
    specialty: 'Psychiatrist',
    experience: '8+ years',
    rating: 5,
    languages: ['English', 'Spanish'],
    image: '/images/doctor-4.jpg'
  },
  {
    id: 'dr-johnson',
    name: 'Dr. Michael Johnson',
    specialty: 'General Practitioner',
    experience: '20+ years',
    rating: 4,
    languages: ['English'],
    image: '/images/doctor-5.jpg'
  },
  {
    id: 'dr-kim',
    name: 'Dr. Soo-Jin Kim',
    specialty: 'Pediatrician',
    experience: '9+ years',
    rating: 5,
    languages: ['English', 'Korean'],
    image: '/images/doctor-6.jpg'
  }
];

export default function DoctorsPage() {
  return (
    <main>
      <Header />
      
      <section className="section-padding bg-light-gray">
        <div className="container-max">
          <div className="text-center mb-16">
            <h1 className="mb-4">Our Doctors</h1>
            <p className="text-subtitle max-w-3xl mx-auto">
              Meet our team of experienced healthcare professionals ready to provide you with quality care.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 