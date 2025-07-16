import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPropertiesBySellerId, deleteProperty } from '../../api/api';
import { useAuth } from '../../contexts/AuthContext';
import { FaEye, FaUserCheck, FaUserSecret, FaEdit, FaTrash, FaPlus, FaSort, FaCheck, FaTimes } from 'react-icons/fa';

const SellerListings = () => {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);

  // Fetch properties
  useEffect(() => {
    const loadProperties = async () => {
      try {
        // In a real app, we would pass the current user ID
        const data = await getPropertiesBySellerId(currentUser?.id || 2);
        setProperties(data);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [currentUser]);

  // Sort properties
  const sortedProperties = [...properties].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    // Special handling for nested properties like views
    if (sortBy === 'views.total') {
      aValue = a.views.total;
      bValue = b.views.total;
    } else if (sortBy === 'views.loggedIn') {
      aValue = a.views.loggedIn;
      bValue = b.views.loggedIn;
    } else if (sortBy === 'views.anonymous') {
      aValue = a.views.anonymous;
      bValue = b.views.anonymous;
    }
    
    // For string values, use localeCompare
    if (typeof aValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    // For numeric values, use simple comparison
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Handle sort
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Format price
 const formatPrice = (price) => {
  return new Intl.NumberFormat('ne-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0
  }).format(price);
};

  // Handle delete property
  const handleDelete = async () => {
    if (!propertyToDelete) return;
    
    try {
      const response = await deleteProperty(propertyToDelete);
      if (response.success) {
        // Update the local state
        setProperties(properties.filter(property => property.id !== propertyToDelete));
        setDeleteModalOpen(false);
        setPropertyToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  // Open delete modal
  const openDeleteModal = (id) => {
    setPropertyToDelete(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Listings</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <Link 
          to="/seller/add-property" 
          className="btn-primary mt-4 md:mt-0 flex items-center justify-center"
        >
          <FaPlus className="mr-2" />
          <span>Add New Property</span>
        </Link>
      </div>
      
      {/* Property Listings Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Loading your properties...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      <span>ID</span>
                      {sortBy === 'id' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    <div className="flex items-center">
                      <span>Title</span>
                      {sortBy === 'title' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      <span>Type</span>
                      {sortBy === 'type' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center">
                      <span>Price</span>
                      {sortBy === 'price' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      <span>Status</span>
                      {sortBy === 'status' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('views.total')}
                  >
                    <div className="flex items-center">
                      <span>Views</span>
                      {sortBy === 'views.total' && (
                        <FaSort className="ml-1 text-gray-400" />
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {property.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={property.imageUrl}
                            alt={property.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {property.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {property.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(property.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : property.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      } capitalize`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <FaEye className="mr-1 text-gray-500" />
                          <span>{property.views.total} total</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/property/${property.id}`}
                          className="text-gray-600 hover:text-gray-900"
                          title="View"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          to={`/seller/edit-property/${property.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(property.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              You haven't added any property listings yet.
            </p>
            <Link to="/seller/add-property" className="btn-primary">
              Add Your First Property
            </Link>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Delete Property</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setPropertyToDelete(null);
                }}
                className="btn-outline flex items-center"
              >
                <FaTimes className="mr-2" />
                <span>Cancel</span>
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors flex items-center"
              >
                <FaCheck className="mr-2" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerListings;