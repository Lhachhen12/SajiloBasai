import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard';
import { getFeaturedProperties } from '../../api/api';

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await getFeaturedProperties();
        setProperties(data);
      } catch (error) {
        console.error('Error loading featured properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Properties</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Loading featured properties...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Properties</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our handpicked selection of exceptional rooms, flats, and apartments. each chosen for its quality, location, and value. Discover your perfect living space among these featured listing.
        </p>
      </div>
      
      {properties.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/properties" 
              className="btn-primary px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
            >
              View All Properties
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">No featured properties available at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default FeaturedProperties;