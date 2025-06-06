import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiBell, FiUser, FiLogOut } from 'react-icons/fi';

const Topbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const notifications = [
    { id: 1, message: 'New user registration', time: '10 minutes ago' },
    { id: 2, message: 'New property listing submitted', time: '1 hour ago' },
    { id: 3, message: 'Report received for Modern 2BHK Apartment', time: '2 hours ago' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 mr-4 rounded-md hover:bg-gray-100 md:hidden"
          aria-label="Toggle sidebar"
        >
          <FiMenu className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (showProfile) setShowProfile(false);
            }}
            className="p-2 rounded-md hover:bg-gray-100 relative"
            aria-label="Notifications"
          >
            <FiBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 w-72 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-200">
                <h3 className="text-sm font-semibold">Notifications</h3>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(notification => (
                  <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-center">
                <button className="text-xs text-primary-600 hover:text-primary-800 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfile(!showProfile);
              if (showNotifications) setShowNotifications(false);
            }}
            className="flex items-center"
            aria-label="Profile menu"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              A
            </div>
          </button>
          
          {showProfile && (
            <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-500 truncate">admin@sajilobasai.com</p>
              </div>
              <div className="py-1">
                <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <FiUser className="mr-3 h-4 w-4" />
                  Profile Settings
                </a>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FiLogOut className="mr-3 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;