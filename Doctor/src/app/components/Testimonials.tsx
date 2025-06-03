const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, NY',
    review: 'The doctor was very professional and thorough. I got my prescription quickly and the entire process was incredibly convenient.',
    rating: 5
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'Los Angeles, CA',
    review: 'As a busy parent, being able to consult with a pediatrician without leaving home was a game-changer. Highly recommend!',
    rating: 5
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    location: 'Chicago, IL',
    review: 'My experience with the mental health services was excellent. The therapist was compassionate and really helped me through a difficult time.',
    rating: 4
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-lg ${
            i < rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="container-section bg-light-gray">
      <div className="container-max">
        <h2 className="text-center mb-12">
          What Our Patients Say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="card"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-content">{testimonial.location}</p>
                  </div>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
              <p className="text-content italic">&ldquo;{testimonial.review}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 