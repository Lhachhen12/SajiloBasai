import { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import Modal from '../shared/Modal';
import ConfirmDialog from '../shared/ConfirmDialog';
import { useAppContext } from '../../context/AppContext';

const ListingTable = ({ listings }) => {
  const { deleteProperty, updateProperty } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    type: '',
    price: '',
    location: '',
    status: ''
  });

  const handleEdit = (listing) => {
    setSelectedListing(listing);
    setEditForm(listing);
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    updateProperty(selectedListing.id, editForm);
    setShowEditModal(false);
  };

  const handleDelete = () => {
    deleteProperty(selectedListing.id);
    setShowDeleteDialog(false);
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || listing.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative md:w-64">
          <input
            type="text"
            placeholder="Search listings..."
            className="form-input w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select 
            className="form-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Studio">Studio</option>
            <option value="Room">Room</option>
          </select>
          
          <select 
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredListings.map((listing) => (
              <tr key={listing.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                      <div className="text-sm text-gray-500">{listing.location}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{listing.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">${listing.price}/mo</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{listing.owner}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    listing.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {listing.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {listing.created}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleEdit(listing)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FiEye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleEdit(listing)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedListing(listing);
                        setShowDeleteDialog(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Property"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={editForm.type}
              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Studio">Studio</option>
              <option value="Room">Room</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              value={editForm.price}
              onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
      />
    </div>
  );
};

export default ListingTable;