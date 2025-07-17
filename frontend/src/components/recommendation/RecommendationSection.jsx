import { useEffect, useState } from 'react';
import PropertyCard from '../PropertyCard';
import { PROPERTIES } from '../../api/api'; // Import your mock data

const RecommendationSection = ({ propertyId }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Filter out the current property and get 4 similar ones
    const similarProperties = PROPERTIES
      .filter(property => property.id !== parseInt(propertyId)) // Exclude current property
      .slice(0, 4); // Limit to 4 recommendations

    setRecommendations(similarProperties);
  }, [propertyId]);

  if (recommendations.length === 0) {
    return <div className="py-12 bg-gray-50 text-center">No recommendations found.</div>;
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Similar Properties You Might Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationSection;