import { NavLink } from 'react-router-dom';
import { FaHome, FaHeart, FaEnvelope, FaUser, FaTimes, FaBars } from 'react-icons/fa';
import { useState } from 'react';

const BuyerSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Sidebar links
  const links = [
    { to: '/buyer/dashboard', icon: <FaHome className="mr-3" />, text: 'Dashboard' },
    { to: '/buyer/wishlist', icon: <FaHeart className="mr-3" />, text: 'My Wishlist' },
    { to: '/buyer/inquiries', icon: <FaEnvelope className="mr-3" />, text: 'My Inquiries' },
    { to: '/buyer/profile', icon: <FaUser className="mr-3" />, text: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-20 right-4 z-30">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-white shadow-md focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar */}
      <div 
        className={`lg:block fixed lg:sticky top-20 z-30 h-[calc(100vh-5rem)] w-64 bg-white shadow-md transition-transform lg:transform-none ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Buyer Dashboard</h2>
        </div>
        
        <nav className="py-4">
          <ul>
            {links.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => 
                    `flex items-center px-5 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                      isActive ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''
                    }`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default BuyerSidebar;