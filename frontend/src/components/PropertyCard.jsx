import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaEye, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { addToWishlist, removeFromWishlist } from '../api/api';

const PropertyCard = ({ property, onWishlistUpdate }) => {
  const {
    id,
    title,
    type,
    price,
    location,
    imageUrl,
    bedrooms,
    bathrooms,
    area,
    status,
    views,
    inWishlist = false
  } = property;

  const [isInWishlist, setIsInWishlist] = useState(inWishlist);
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();

  const formatPrice = new Intl.NumberFormat('ne-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0
  }).format(price);

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'apartment':
        return 'bg-blue-100 text-blue-800';
      case 'house':
        return 'bg-green-100 text-green-800';
      case 'room':
        return 'bg-purple-100 text-purple-800';
      case 'flat':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'for sale':
        return 'bg-green-100 text-green-800';
      case 'sold out':
      case 'not available':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWishlistToggle = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const response = isInWishlist
        ? await removeFromWishlist(currentUser.id, id)
        : await addToWishlist(currentUser.id, id);

      if (response.success) {
        setIsInWishlist(!isInWishlist);
        if (onWishlistUpdate) {
          onWishlistUpdate(id, !isInWishlist);
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
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

  const handleViewDetails = () => {
    navigate(`/property/${id}`);
  };

  const isAvailable = !['sold out', 'not available'].includes(status.toLowerCase());

  return (
    <div className="card group animate-fade-in">
      <div className="relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className={`absolute top-4 left-4 ${getTypeColor(type)} px-2 py-1 rounded text-xs font-medium`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </div>

        <div className={`absolute top-4 right-4 ${getStatusColor(status)} px-2 py-1 rounded text-xs font-medium`}>
          {status}
        </div>

        <button
          onClick={handleWishlistToggle}
          className="absolute bottom-4 right-6 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
        >
          {isInWishlist ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="text-primary-500 mr-1" />
          <p className="text-sm">{location}</p>
        </div>
        
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          {bedrooms && (
            <div className="flex items-center">
              <FaBed className="mr-1" />
              <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          
          {bathrooms && (
            <div className="flex items-center">
              <FaBath className="mr-1" />
              <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FaEye className="mr-1" />
          <span>{views.total} views</span>
        </div>
        
        <div className="space-y-3">
          <p className="text-lg font-bold text-primary-600">
            {formatPrice} <span className="text-sm font-normal text-gray-600">/ per month</span>
          </p>
          
          <div className="flex space-x-2">
            {isAvailable ? (
              <button 
                onClick={handleBookNow}
                className="btn-primary flex-1 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-teal-500/30 transition-all duration-300"
              >
                Book Now
              </button>
            ) : (
              <button 
                disabled
                className="btn-primary flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg cursor-not-allowed"
              >
                Not Available
              </button>
            )}
            <button 
              onClick={handleViewDetails}
              className="btn-outline flex-1"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;