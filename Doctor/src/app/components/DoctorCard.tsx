import Image from 'next/image';
import Link from 'next/link';
import { FiStar } from 'react-icons/fi';

type DoctorProps = {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  languages: string[];
  image: string;
};

const DoctorCard = ({ doctor }: { doctor: DoctorProps }) => {
  return (
    <div className="card card-interactive hover-lift focus-ring group">
      <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">{doctor.name}</h3>
          <p className="text-primary font-medium">{doctor.specialty}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${
                  i < doctor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-content font-medium">({doctor.rating}.0)</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <p className="text-content">
            <span className="font-semibold text-black">Experience:</span> {doctor.experience}
          </p>
          <p className="text-content">
            <span className="font-semibold text-black">Languages:</span> {doctor.languages.join(', ')}
          </p>
        </div>
        
        <Link 
          href={`/book/${doctor.id}`}
          className="btn-primary w-full hover-lift focus-ring"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard; 