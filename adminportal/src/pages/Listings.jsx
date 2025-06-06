import { useState, useEffect } from 'react';
import ListingTable from '../components/listings/ListingTable';
import { getListings } from '../utils/adminApi';
import { FiHome, FiPlusCircle } from 'react-icons/fi';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const listingsData = await getListings();
        setListings(listingsData);
      } catch (error) {
        console.error('Error fetching listings data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Listings Management</h1>
          <p className="text-sm text-gray-500">View and manage property listings</p>
        </div>
        
        <button className="mt-4 sm:mt-0 btn-primary flex items-center">
          <FiPlusCircle className="mr-2 h-4 w-4" />
          Add New Listing
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="dashboard-card bg-blue-50 border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FiHome className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Listings</p>
                <p className="text-xl font-bold">{listings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card bg-green-50 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FiHome className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Active</p>
                <p className="text-xl font-bold">
                  {listings.filter(listing => listing.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card bg-amber-50 border border-amber-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 mr-4">
                <FiHome className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Pending</p>
                <p className="text-xl font-bold">
                  {listings.filter(listing => listing.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card bg-indigo-50 border border-indigo-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 mr-4">
                <FiHome className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">Average Price</p>
                <p className="text-xl font-bold">
                  $
                  {Math.floor(
                    listings.reduce((sum, item) => sum + item.price, 0) / 
                    (listings.length || 1)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <ListingTable listings={listings} />
      </div>
    </div>
  );
};

export default Listings;