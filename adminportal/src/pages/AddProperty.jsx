import { useState } from 'react';
import { FiSave, FiUser, FiHome, FiImage, FiMapPin, FiDollarSign, FiMaximize, FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AddListings = ({ isDark }) => {
  const navigate = useNavigate();
  const { addProperty } = useAppContext();
  
  const [sellerData, setSellerData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'seller'
  });

  const [propertyData, setPropertyData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'Flat', // Default to Flat as per requirements
    location: '',
    size: '',
    imageUrl: '',
    amenities: [],
    features: []
  });

  const amenitiesList = [
    'Parking', 'WiFi', 'AC', 'Furnished', 'Security', 
    'Gym', 'Swimming Pool', 'Elevator', 'Garden', 'CCTV'
  ];

  const featuresList = [
    'Balcony', 'Kitchen', 'Laundry', 'Storage', 'Pet Friendly'
  ];

  const handleSellerChange = (e) => {
    const { name, value } = e.target;
    setSellerData(prev => ({ ...prev, [name]: value }));
  };

  const handlePropertyChange = (e) => {
    const { name, value } = e.target;
    setPropertyData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setPropertyData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFeatureToggle = (feature) => {
    setPropertyData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    
    if (!propertyData.title || !propertyData.price || !propertyData.location || !sellerData.name || !sellerData.email || !sellerData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newProperty = {
        ...propertyData,
        seller: sellerData,
        status: 'Active',
        created: new Date().toLocaleDateString()
      };
      
      addProperty(newProperty);
      toast.success('Listing created successfully!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        icon: '🏠'
      });
      navigate('/listings');
    } catch (error) {
      toast.error('Failed to create listing', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
        },
        icon: '❌'
      });
    }
  };

  // Styles for dark/light mode
  const inputStyles = `w-full px-4 py-3 rounded-lg border transition-colors ${
    isDark 
      ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
  } focus:ring-2 focus:ring-blue-500/20`;

  const cardStyles = `rounded-xl shadow-lg p-6 transition-colors ${
    isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  } border`;

  const labelStyles = `block text-sm font-medium mb-2 ${
    isDark ? 'text-gray-300' : 'text-gray-700'
  }`;

  const sectionTitleStyles = `text-lg font-medium ${
    isDark ? 'text-white' : 'text-gray-900'
  }`;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
          Add New Listing
        </h1>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seller Details Form */}
        <div className={cardStyles}>
          <div className="flex items-center mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg`}>
              <FiUser className="h-5 w-5 text-white" />
            </div>
            <h2 className={`${sectionTitleStyles} ml-3`}>Seller Details</h2>
          </div>

          <form className="space-y-4">
            <div>
              <label className={labelStyles}>
                Seller Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={sellerData.name}
                onChange={handleSellerChange}
                className={inputStyles}
                required
              />
            </div>

            <div>
              <label className={labelStyles}>
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={sellerData.email}
                onChange={handleSellerChange}
                className={inputStyles}
                required
              />
            </div>

            <div>
              <label className={labelStyles}>
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={sellerData.phone}
                onChange={handleSellerChange}
                className={inputStyles}
                required
              />
            </div>
          </form>
        </div>

        {/* Property Details Form */}
        <div className={`lg:col-span-2 ${cardStyles}`}>
          <div className="flex items-center mb-6">
            <div className={`p-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 shadow-lg`}>
              <FiHome className="h-5 w-5 text-white" />
            </div>
            <h2 className={`${sectionTitleStyles} ml-3`}>Listing Details</h2>
          </div>

          <form onSubmit={handleSaveProperty} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelStyles}>
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={propertyData.title}
                onChange={handlePropertyChange}
                className={inputStyles}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelStyles}>
                Description
              </label>
              <textarea
                name="description"
                value={propertyData.description}
                onChange={handlePropertyChange}
                rows="4"
                className={`${inputStyles} min-h-[120px]`}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className={labelStyles}>
                  <FiDollarSign className="inline-block mr-1" />
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={propertyData.price}
                  onChange={handlePropertyChange}
                  className={inputStyles}
                  required
                />
              </div>

              <div className="flex-1">
                <label className={labelStyles}>
                  <FiMaximize className="inline-block mr-1" />
                  Size (sqft)
                </label>
                <input
                  type="number"
                  name="size"
                  value={propertyData.size}
                  onChange={handlePropertyChange}
                  className={inputStyles}
                />
              </div>
            </div>

            <div>
              <label className={labelStyles}>
                Property Type
              </label>
              <select
                name="type"
                value={propertyData.type}
                onChange={handlePropertyChange}
                className={inputStyles}
              >
                <option value="Flat">Flat</option>
                <option value="Room">Room</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>

            <div>
              <label className={labelStyles}>
                <FiMapPin className="inline-block mr-1" />
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={propertyData.location}
                onChange={handlePropertyChange}
                className={inputStyles}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelStyles}>
                <FiImage className="inline-block mr-1" />
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={propertyData.imageUrl}
                onChange={handlePropertyChange}
                className={inputStyles}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelStyles}>
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      propertyData.amenities.includes(amenity)
                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                        : isDark 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelStyles}>
                Features
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {featuresList.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => handleFeatureToggle(feature)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      propertyData.features.includes(feature)
                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                        : isDark 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiSave className="h-5 w-5 mr-2" />
                Save Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddListings;