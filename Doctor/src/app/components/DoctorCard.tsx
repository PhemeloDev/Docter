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
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-64 w-full">
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-black mb-1">{doctor.name}</h3>
        <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
        
        <div className="mb-4 flex items-center">
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={`w-4 h-4 ${
                  i < doctor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-black">({doctor.rating}.0)</span>
        </div>
        
        <div className="mb-4">
          <p className="text-black"><span className="font-medium">Experience:</span> {doctor.experience}</p>
          <p className="text-black">
            <span className="font-medium">Languages:</span> {doctor.languages.join(', ')}
          </p>
        </div>
        
        <Link 
          href={`/book/${doctor.id}`}
          className="w-full block text-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard; 