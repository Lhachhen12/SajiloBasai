import { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaMapMarkerAlt } from 'react-icons/fa';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sita Rai",
      role: "Flat Buyer",
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      text: "SajiloBasai made finding my dream apartment incredibly easy. The detailed filters helped me narrow down exactly what I was looking for, and I was able to contact the owner directly. Couldn't be happier with my new place!",
      rating: 5,
      location: "Kathmandu"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Property Owner",
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      text: "As a property owner, I've tried several platforms to list my properties. SajiloBasai stands out with its intuitive interface and the quality of inquiries I receive. The analytics showing property views is incredibly helpful!",
      rating: 5,
      location: "Pokhara"
    },
    {
      id: 3,
      name: "Anya Sharma",
      role: "Student Renter",
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      text: "Finding a room near campus was a breeze with SajiloBasai. The platform's search filters let me find affordable options within walking distance to my university. The whole process from search to move-in took just two weeks!",
      rating: 5,
      location: "Lalitpur"
    },
    {
      id: 4,
      name: "Bishal Thapa",
      role: "Real Estate Investor",
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      text: "I manage multiple rental properties and SajiloBasai has significantly streamlined my workflow. The dashboard gives me a clear overview of all my listings and their performance. Definitely the best property platform I've used.",
      rating: 4,
      location: "Bhaktapur"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-teal-50 py-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-teal-200/30 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-teal-200/30 rounded-full translate-x-32 translate-y-32"></div>
      
      <div className="container-custom relative">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-teal-100 rounded-full px-4 py-1 mb-4">
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
              Customer Stories
            </span>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Don't just take our word for it. Here's what people who have used our platform have to say.
          </p>
        </div>
        
        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="min-w-full px-4">
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50 mx-auto">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                        <FaQuoteLeft className="text-white text-xl" />
                      </div>
                    </div>
                    
                    {/* Rating */}
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-lg mx-1" />
                      ))}
                    </div>
                    
                    {/* Testimonial Text */}
                    <p className="text-gray-700 text-center leading-relaxed mb-6">
                      "{testimonial.text}"
                    </p>
                    
                    {/* User Info */}
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name} 
                          className="w-14 h-14 rounded-full border-4 border-white shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="ml-4 text-center">
                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                        <p className="text-blue-600 font-medium text-sm">{testimonial.role}</p>
                        <div className="flex items-center justify-center mt-1">
                          <FaMapMarkerAlt className="text-gray-400 text-xs mr-1" />
                          <span className="text-gray-500 text-xs">{testimonial.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300 flex items-center justify-center group"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-300 flex items-center justify-center group"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 ${
                  currentIndex === index 
                    ? 'w-6 h-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full' 
                    : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Trust Indicators */}
        {/* <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent mb-1">
                10,000+
              </div>
              <p className="text-gray-600 text-sm">Happy Users</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent mb-1">
                5,000+
              </div>
              <p className="text-gray-600 text-sm">Properties Listed</p>
            </div>
            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent mb-1">
                4.9/5
              </div>
              <p className="text-gray-600 text-sm">Average Rating</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default TestimonialsSection;