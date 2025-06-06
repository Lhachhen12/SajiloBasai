import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProperty } from '../../api/api';
import { FaPlus, FaTimes, FaCheck } from 'react-icons/fa';

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [customFeatures, setCustomFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    price: '',
    location: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    features: {
      electricity: false,
      parking: false,
      wifi: false,
      security: false,
      furnished: false,
      waterSupply: false
    },
    images: ['', '', '', ''] // Placeholder for image URLs
  });

  const propertyTypes = [
    { value: '', label: 'Select Category' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'room', label: 'Room' },
    { value: 'flat', label: 'Flat' }
  ];

  const locations = [
    'Kathmandu',
    'Lalitpur',
    'Bhaktapur',
    'Pokhara',
    'Biratnagar',
    'Birgunj',
    'Butwal',
    'Dharan',
    'Bharatpur',
    'Hetauda'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        features: {
          ...prev.features,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addCustomFeature = () => {
    if (newFeature.trim()) {
      setCustomFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeCustomFeature = (index) => {
    setCustomFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const propertyData = {
        ...formData,
        customFeatures,
        sellerId: 2, // In a real app, this would come from auth context
        status: 'available',
        views: {
          total: 0,
          loggedIn: 0,
          anonymous: 0
        }
      };

      const response = await addProperty(propertyData);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/seller/listings');
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dimensions based on area
  const dimensions = formData.area ? Math.sqrt(Number(formData.area)) : 0;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Add New Property</h1>
          <p className="text-gray-600">Fill in the details to list your property</p>
        </div>

        {success ? (
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="text-2xl text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">Property Added Successfully!</h2>
            <p className="text-green-600">Redirecting to your listings...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="type" className="form-label">Property Category *</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    {propertyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="form-label">Location *</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="title" className="form-label">Property Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Modern Apartment in City Center"
                    className="input-field"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="form-label">Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="input-field"
                    placeholder="Describe your property..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="form-label">Price (NPR) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="area" className="form-label">Area (sqft) *</label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Total area in square feet"
                    className="input-field"
                    required
                  />
                  {dimensions > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      Approx. {Math.round(dimensions)} x {Math.round(dimensions)} ft
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="bedrooms" className="form-label">Bedrooms</label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    placeholder="Number of bedrooms"
                    className="input-field"
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="bathrooms" className="form-label">Bathrooms</label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    placeholder="Number of bathrooms"
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Property Images</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.images.map((url, index) => (
                  <div key={index}>
                    <label htmlFor={`image-${index}`} className="form-label">
                      Image URL {index + 1}
                    </label>
                    <input
                      type="url"
                      id={`image-${index}`}
                      value={url}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="Enter image URL"
                      className="input-field"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {Object.entries(formData.features).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={key}
                      checked={value}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>

              {/* Custom Features */}
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-2">Custom Features</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add custom feature"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={addCustomFeature}
                    className="btn-primary p-2"
                  >
                    <FaPlus />
                  </button>
                </div>

                {customFeatures.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full flex items-center space-x-2"
                      >
                        <span className="text-gray-700">{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeCustomFeature(index)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary px-8"
                disabled={loading}
              >
                {loading ? 'Adding Property...' : 'Add Property'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddProperty;