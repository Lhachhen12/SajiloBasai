import { useState, useEffect } from 'react';
import BookingTable from '../components/bookings/BookingTable';
import { mockApi } from '../utils/adminApi';
import { FiBookmark, FiPlusCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await mockApi.getBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-sm text-gray-500">View and manage property bookings</p>
        </div>
        
        <Link to="/add-booking" className="mt-4 sm:mt-0 btn-primary flex items-center">
          <FiPlusCircle className="mr-2 h-4 w-4" />
          Add New Booking
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="dashboard-card bg-blue-50 border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FiBookmark className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Bookings</p>
                <p className="text-xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card bg-green-50 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FiBookmark className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Active Bookings</p>
                <p className="text-xl font-bold">
                  {bookings.filter(booking => new Date(booking.checkInDate) <= new Date()).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card bg-amber-50 border border-amber-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 mr-4">
                <FiBookmark className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">Upcoming</p>
                <p className="text-xl font-bold">
                  {bookings.filter(booking => new Date(booking.checkInDate) > new Date()).length}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <BookingTable bookings={bookings} />
      </div>
    </div>
  );
};

export default Bookings;