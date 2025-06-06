import { useState } from 'react';
import { FiSave, FiUser, FiHome, FiImage, FiMapPin, FiDollarSign, FiMaximize } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AddProperty = () => {
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
    type: 'Apartment',
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
    
    if (!propertyData.title || !propertyData.price || !propertyData.location) {
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
      toast.success('Property created successfully!', {
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
      toast.error('Failed to create property', {
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
        <p className="text-sm text-gray-500">Create a new property listing with seller details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Seller Details Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-primary-50 rounded-lg">
              <FiUser className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-lg font-medium ml-3">Seller Details</h2>
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seller Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={sellerData.name}
                onChange={handleSellerChange}
                className="form-input w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={sellerData.email}
                onChange={handleSellerChange}
                className="form-input w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={sellerData.phone}
                onChange={handleSellerChange}
                className="form-input w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
          </form>
        </div>

        {/* Property Details Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-primary-50 rounded-lg">
              <FiHome className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-lg font-medium ml-3">Property Details</h2>
          </div>

          <form onSubmit={handleSaveProperty} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={propertyData.title}
                onChange={handlePropertyChange}
                className="form-input w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={propertyData.description}
                onChange={handlePropertyChange}
                rows="4"
                className="form-textarea w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiDollarSign className="inline-block mr-1" />
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={propertyData.price}
                  onChange={handlePropertyChange}
                  className="form-input w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FiMaximize className="inline-block mr-1" />
                  Size (sqft)
                </label>
                <input
                  type="number"
                  name="size"
                  value={propertyData.size}
                  onChange={handlePropertyChange}
                  className="form-input w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                name="type"
                value={propertyData.type}
                onChange={handlePropertyChange}
                className="form-select w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="Room">Room</option>
                <option value="Flat">Flat</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiMapPin className="inline-block mr-1" />
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={propertyData.location}
                onChange={handlePropertyChange}
                className="form-input w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <FiImage className="inline-block mr-1" />
                Image URL
              </label>
              <input
                type="url"
                name="imageUrl"
                value={propertyData.imageUrl}
                onChange={handlePropertyChange}
                className="form-input w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${propertyData.amenities.includes(amenity)
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                  >
                    {amenity}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Features
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {featuresList.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => handleFeatureToggle(feature)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${propertyData.features.includes(feature)
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-200'
                        : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <FiSave className="h-5 w-5 mr-2" />
                Save Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProperty;