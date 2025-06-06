// src/pages/PropertyDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPropertyById, addToWishlist } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import { FaHeart, FaRegHeart, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaEye, FaUserCheck, FaUserSecret, FaEnvelope, FaPhone, FaUser } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import ChatModal from '../../components/ChatModal';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, currentUser } = useAuth();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Mock seller data (in a real app, this would come from the API)
  const seller = {
    id: 'seller123',
    name: 'Jane Smith',
    phone: '+977-1-234567',
    email: 'jane@example.com'
  };

  // Mock images array
  const images = [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227',
    'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
  ];

  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true);
      try {
        const response = await getPropertyById(id);
        if (response.success) {
          setProperty(response.property);
          setInWishlist(false);
        } else {
          setError(response.message);
        }
      } catch (error) {
        console.error('Error loading property:', error);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await addToWishlist(currentUser.id, property.id);
      if (response.success) {
        setInWishlist(!inWishlist);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const handleChatClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setShowChatModal(true);
  };

  const handleBookNow = () => {
    if (!isLoggedIn) {
      navigate('/login', { 
        state: { 
          from: `/book/${id}`,
          message: 'Please log in to book this property'
        }
      });
      return;
    }
    navigate(`/book/${id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ne-NP', {
      style: 'currency',
      currency: 'NPR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
        <div className="container-custom">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4 w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded mb-6 w-1/2"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 h-64"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
        <div className="container-custom">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "We couldn't find the property you're looking for."}</p>
            <button
              onClick={() => navigate('/properties')}
              className="btn-primary"
            >
              Browse Other Properties
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section */}
          <div className="lg:col-span-2">
            {/* Image Slider */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className="h-96"
              >
                {images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Property view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-primary-500" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <p className="text-3xl font-bold text-primary-600">{formatPrice(property.price)}</p>
                  <p className="text-sm text-gray-600 text-right">/ per month</p>
                </div>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaBed className="text-xl text-primary-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Bedrooms</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-700">{property.bedrooms}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaBath className="text-xl text-primary-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Bathrooms</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-700">{property.bathrooms}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaRulerCombined className="text-xl text-primary-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Area</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-700">{property.area} sqft</p>
                  <p className="text-sm text-gray-600">
                    ({Math.round(Math.sqrt(property.area))} x {Math.round(Math.sqrt(property.area))} ft)
                  </p>
                </div>
              </div>

              {/* Book Now button */}
              <div className="flex justify-end mb-6">
                <button
                  onClick={handleBookNow}
                  className="btn-primary flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-teal-500/30 transition-all duration-300 py-3 px-6 rounded-lg"
                >
                  Book Now
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
              </div>

              {/* Features List */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Features</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Free Electricity
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Parking Available
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    Free Wi-Fi
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                    24/7 Security
                  </li>
                </ul>
              </div>
            </div>

            {/* Property Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Property Interest</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <FaEye className="text-2xl text-blue-500 mr-3" />
                  <div>
                    <h4 className="text-sm text-gray-600">Total Views</h4>
                    <p className="text-xl font-bold text-gray-800">{property.views.total}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <FaUserCheck className="text-2xl text-green-500 mr-3" />
                  <div>
                    <h4 className="text-sm text-gray-600">Logged In Views</h4>
                    <p className="text-xl font-bold text-gray-800">{property.views.loggedIn}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                  <FaUserSecret className="text-2xl text-purple-500 mr-3" />
                  <div>
                    <h4 className="text-sm text-gray-600">Anonymous Views</h4>
                    <p className="text-xl font-bold text-gray-800">{property.views.anonymous}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Seller Profile */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <FaUser className="text-2xl text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{seller.name}</h3>
                    <p className="text-gray-600">Property Owner</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <FaPhone className="mr-3" />
                    <span>{seller.phone}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaEnvelope className="mr-3" />
                    <span>{seller.email}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleChatClick}
                  className="w-full btn-primary flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-teal-500/30 transition-all duration-300 py-3 px-4 rounded-lg"
                >
                  <FaEnvelope className="mr-2" />
                  Chat with Seller
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="w-full btn-outline flex items-center justify-center py-3 px-4 rounded-lg border border-gray-300 hover:border-primary-500 hover:text-primary-500 transition-colors duration-300"
                >
                  {inWishlist ? (
                    <>
                      <FaHeart className="mr-2 text-red-500" />
                      Remove from Wishlist
                    </>
                  ) : (
                    <>
                      <FaRegHeart className="mr-2" />
                      Add to Wishlist
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Required Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to perform this action. Would you like to log in now?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="btn-outline py-2 px-4 rounded-lg border border-gray-300 hover:border-primary-500 hover:text-primary-500 transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate('/login');
                }}
                className="btn-primary py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <ChatModal 
          propertyId={id} 
          sellerId={seller.id} 
          onClose={() => setShowChatModal(false)} 
        />
      )}
    </div>
  );
};

export default PropertyDetailPage;