import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiGrid, 
  FiBarChart2, 
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiPlusCircle,
  FiFileText,
  FiMessageSquare,
  FiMail,
  FiBookmark,
  FiCalendar,
  FiX
} from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      if (width >= 768 && !isOpen) {
        toggleSidebar();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, toggleSidebar]);

  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FiHome className="w-5 h-5" /> },
    { path: '/users', name: 'Users', icon: <FiUsers className="w-5 h-5" /> },
    { path: '/listings', name: 'Listings', icon: <FiGrid className="w-5 h-5" /> },
    { path: '/add-property', name: 'Add Property', icon: <FiPlusCircle className="w-5 h-5" /> },
    { path: '/bookings', name: 'Bookings', icon: <FiCalendar className="w-5 h-5" /> },
    { path: '/add-booking', name: 'Add Booking', icon: <FiBookmark className="w-5 h-5" /> },
    { path: '/analytics', name: 'Analytics', icon: <FiBarChart2 className="w-5 h-5" /> },
    { path: '/pages', name: 'Pages', icon: <FiFileText className="w-5 h-5" /> },
    { path: '/feedback', name: 'Feedback', icon: <FiMessageSquare className="w-5 h-5" /> },
    { path: '/contact', name: 'Contact', icon: <FiMail className="w-5 h-5" /> },
    { path: '/profile', name: 'Profile Settings', icon: <FiSettings className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-20'} 
          ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 invisible'}`}>
            <h1 className="text-xl font-bold text-primary-800">SajiloBasai</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
          
          <button 
            onClick={toggleSidebar} 
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors
              ${isMobile ? 'absolute right-2' : ''}
            `}
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isMobile && isOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              isOpen ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <ul className="p-3 space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => `
                    flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-150
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    ${!isOpen && !isMobile ? 'justify-center' : ''}
                  `}
                  title={!isOpen ? item.name : undefined}
                >
                  <span className="flex items-center">
                    {item.icon}
                    <span className={`
                      ml-3 transition-all duration-300
                      ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible w-0'}
                      ${isMobile ? 'opacity-100 visible w-auto' : ''}
                    `}>
                      {item.name}
                    </span>
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className={`
          absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white
          ${isOpen ? 'block' : 'hidden'}
        `}>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-semibold">
              A
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-500">admin@sajilobasai.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;