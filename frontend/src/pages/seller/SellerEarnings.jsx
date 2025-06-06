import { useState, useEffect } from 'react';
import { getSellerEarningsSummary } from '../../api/bookingApi';
import { useAuth } from '../../contexts/AuthContext';
import { FaMoneyBillWave, FaPercentage, FaChartLine, FaBookmark } from 'react-icons/fa';
import StatCard from '../../components/StatCard';

const SellerEarnings = () => {
  const { currentUser } = useAuth();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        const data = await getSellerEarningsSummary(currentUser?.id || 2);
        setEarnings(data);
      } catch (error) {
        console.error('Error loading earnings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEarnings();
  }, [currentUser]);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Earnings Summary</h1>
        <p className="text-gray-600">Track your earnings and commission details</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-lg shadow-sm animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Earnings"
            value={earnings?.totalEarnings || 0}
            icon={<FaMoneyBillWave className="text-xl" />}
            color="green"
            change={15}
          />
          
          <StatCard
            title="Commission Paid"
            value={earnings?.totalCommission || 0}
            icon={<FaPercentage className="text-xl" />}
            color="red"
          />
          
          <StatCard
            title="Net Earnings"
            value={earnings?.netEarnings || 0}
            icon={<FaChartLine className="text-xl" />}
            color="blue"
            change={12}
          />
          
          <StatCard
            title="Total Bookings"
            value={earnings?.totalBookings || 0}
            icon={<FaBookmark className="text-xl" />}
            color="purple"
          />
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Commission Structure</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaPercentage className="text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-900">Platform Commission</h3>
              <p className="mt-1 text-sm text-blue-700">
                A 5% commission is charged on all successful bookings. This helps us maintain and improve the platform while providing you with quality services and buyer connections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Commission Calculation</h4>
              <p className="text-sm text-gray-600">
                Commission = Booking Amount × 5%
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Payment Schedule</h4>
              <p className="text-sm text-gray-600">
                Net earnings are transferred within 7 days of booking confirmation
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Cancellation Policy</h4>
              <p className="text-sm text-gray-600">
                Commission is refunded for cancelled bookings within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;