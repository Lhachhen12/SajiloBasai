import { useState, useEffect } from 'react';
import { FiMapPin, FiTarget } from 'react-icons/fi';
import PropertyCard from './PropertyCard';
import { getLocationBasedRecommendations } from '../api/api';
// import { formatDistance } from '../utils/locationService';

const LocationBasedRecommendations = ({ userLocation, searchCriteria }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userLocation?.latitude && userLocation?.longitude) {
      fetchRecommendations();
    }
  }, [userLocation, searchCriteria]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const requestData = {
        userLocation: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        preferences: {
          type: searchCriteria?.type,
          minPrice: searchCriteria?.minPrice,
          maxPrice: searchCriteria?.maxPrice,
          features: searchCriteria?.features
        },
        limit: 8
      };

      const response = await getLocationBasedRecommendations(requestData);

      if (response.success) {
        setRecommendations(response.recommendations || []);
      } else {
        setError(response.message || 'Failed to load recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Unable to load recommendations at this time');
    } finally {
      setLoading(false);
    }
  };

  // Don't render if no location or no recommendations
  if (!userLocation?.latitude || (!loading && recommendations.length === 0)) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <FiTarget className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Properties Near You
            </h2>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <FiMapPin className="h-4 w-4" />
            <span className="text-sm">
              {userLocation.source === 'gps' 
                ? `Based on your current location${userLocation.city ? ` in ${userLocation.city}` : ''}`
                : userLocation.source === 'ip'
                ? `Based on your approximate location in ${userLocation.city}`
                : `Showing properties in ${userLocation.city}`
              }
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchRecommendations}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Recommendations */}
        {!loading && !error && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.map((property) => (
              <div key={property._id || property.id} className="relative">
                <PropertyCard property={{
                  ...property,
                  id: property._id || property.id,
                  imageUrl: property.images?.[0] || '/placeholder-property.jpg',
                  inWishlist: false // You can implement wishlist logic here
                }} />
                
                {/* Distance Badge */}
                {property.distance && (
                  <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                    {formatDistance(property.distance)}
                  </div>
                )}
                
                {/* Recommendation Score Badge */}
                {property.recommendationScore > 80 && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                    Perfect Match
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* View More Button */}
        {!loading && !error && recommendations.length >= 4 && (
          <div className="text-center mt-8">
            <button
              onClick={() => window.location.href = `/properties?userLat=${userLocation.latitude}&userLon=${userLocation.longitude}`}
              className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              View More Properties Near You
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationBasedRecommendations;