import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllProperties } from '../../api/api';
import PropertyCard from '../../components/PropertyCard';
import SearchFilters from '../../components/SearchFilters';
import { FaSort, FaFilter } from 'react-icons/fa';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('default');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize filters from URL params
  const initialFilters = {
    location: searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
  };

  const [filters, setFilters] = useState(initialFilters);

  // Load properties based on filters
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const data = await getAllProperties(filters);
        setProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [filters]);

  // Handle search submission
  const handleSearch = (searchFilters) => {
    // Update filters state
    setFilters(searchFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });
    
    setSearchParams(params);
  };

  // Sort properties
  const sortProperties = (option) => {
    let sortedProperties = [...properties];
    
    switch (option) {
      case 'price-low-high':
        sortedProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        sortedProperties.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // In a real app, this would sort by date
        // Here we're just shuffling for demo purposes
        sortedProperties.sort(() => Math.random() - 0.5);
        break;
      default:
        // Default sorting (featured or relevance)
        sortedProperties.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }
    
    setProperties(sortedProperties);
    setSortOption(option);
  };

  // Handle sort change
  const handleSortChange = (e) => {
    sortProperties(e.target.value);
  };

  return (
    <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Properties</h1>
          <p className="text-gray-600">
            Find your perfect property from our comprehensive listings
          </p>
        </div>
        
        {/* Mobile Filters Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full btn-outline flex items-center justify-center"
          >
            <FaFilter className="mr-2" />
            <span>{showMobileFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter Properties</h3>
              <SearchFilters onSearch={handleSearch} layout="vertical" />
            </div>
          </div>
          
          {/* Filters - Mobile */}
          {showMobileFilters && (
            <div className="md:hidden">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter Properties</h3>
                <SearchFilters onSearch={handleSearch} layout="vertical" />
              </div>
            </div>
          )}
          
          {/* Property Listings */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between items-center">
              <div className="text-gray-600">
                {loading ? 'Loading properties...' : `${properties.length} properties found`}
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-gray-600 hidden sm:inline">Sort by:</label>
                <div className="relative">
                  <select
                    id="sort"
                    value={sortOption}
                    onChange={handleSortChange}
                    className="appearance-none pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 text-gray-700"
                  >
                    <option value="default">Featured</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="newest">Newest</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <FaSort className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
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
            ) : properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any properties matching your search criteria.
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      location: '',
                      type: '',
                      minPrice: '',
                      maxPrice: '',
                    });
                    setSearchParams({});
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;