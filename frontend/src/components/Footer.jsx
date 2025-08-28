import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCommentDots } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import FeedbackModal from './FeedbackModal';
import { useState } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleFeedbackClick = () => {
    setIsFeedbackModalOpen(true);
  };
  
  return (
    <>
      <footer className="bg-gradient-to-br from-blue-900 to-teal-800 text-white pt-12 pb-6">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaHome className="text-2xl text-white" />
                <h4 className="text-xl font-bold">SajiloBasai</h4>
              </div>
              <p className="text-blue-100 mb-4">
                Your next home is just a few clicks away. Explore, choose, and book rooms, flats, and apartments with ease
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-blue-700 pb-2">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-blue-200 hover:text-white transition-colors">Home</Link>
                </li>
                <li>
                  <Link to="/properties" className="text-blue-200 hover:text-white transition-colors">Properties</Link>
                </li>
                <li>
                  <Link to="/about" className="text-blue-200 hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-blue-200 hover:text-white transition-colors">Contact Us</Link>
                </li>
                <li>
                  <button
                    onClick={handleFeedbackClick}
                    className="text-blue-200 hover:text-white transition-colors duration-200 text-left flex items-center group"
                  >
                    <FaCommentDots className="mr-2 group-hover:text-blue-400 transition-colors duration-200" size={14} />
                    Help & Feedback
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Properties */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-blue-700 pb-2">Properties</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">Apartments</a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">Houses</a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">Rooms</a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">Flats</a>
                </li>
                <li>
                  <a href="#" className="text-blue-200 hover:text-white transition-colors">Featured Properties</a>
                </li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4 border-b border-blue-700 pb-2">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="text-white mt-1 mr-3" />
                  <span className="text-blue-100">chabahil, kathmandu, 44600</span>
                </li>
                <li className="flex items-center">
                  <FaPhone className="text-white mr-3" />
                  <span className="text-blue-100">+977 9861774657</span>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="text-white mr-3" />
                  <span className="text-blue-100">shreejanlama0@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-4 border-t border-blue-700 text-center text-blue-200 text-sm">
            <p>&copy; {currentYear} SajiloBasai. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
    </>
  );
};

export default Footer;