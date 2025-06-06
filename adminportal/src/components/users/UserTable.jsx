import { useState } from 'react';
import { FiEdit, FiTrash2, FiUserX, FiUserCheck } from 'react-icons/fi';
import Modal from '../shared/Modal';
import ConfirmDialog from '../shared/ConfirmDialog';
import toast from 'react-hot-toast';

const UserTable = ({ users: initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'buyer',
    phone: '',
    status: 'active'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now().toString(),
      ...formData,
      visits: 0,
      joinDate: new Date().toLocaleDateString()
    };
    setUsers(prev => [newUser, ...prev]);
    setShowAddModal(false);
    setFormData({
      name: '',
      email: '',
      role: 'buyer',
      phone: '',
      status: 'active'
    });
    toast.success('User added successfully');
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    setUsers(prev => prev.map(user => 
      user.id === selectedUser.id ? { ...user, ...formData } : user
    ));
    setShowEditModal(false);
    toast.success('User updated successfully');
  };

  const handleDeleteUser = () => {
    setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
    setShowDeleteDialog(false);
    toast.success('User deleted successfully');
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
    toast.success(`User ${newStatus.toLowerCase()} successfully`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const UserForm = ({ onSubmit, initialData = formData }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          {initialData ? 'Update User' : 'Add User'}
        </button>
      </div>
    </form>
  );

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative md:w-64">
          <input
            type="text"
            placeholder="Search users..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <select 
              className="form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>
          
          <div>
            <select 
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Site Visits</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="text-sm text-gray-900">{user.email}</p>
                  </td>
                  <td>
                    <p className="text-sm capitalize">{user.role}</p>
                  </td>
                  <td>
                    <span className={`inline-flex ${
                      user.status === 'active' 
                        ? 'status-active' 
                        : user.status === 'inactive'
                          ? 'status-inactive'
                          : 'status-blocked'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <p className="text-sm">{user.visits}</p>
                  </td>
                  <td>
                    <p className="text-sm">{user.joinDate}</p>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 rounded-full hover:bg-gray-100"
                        title="Edit user"
                        onClick={() => {
                          setSelectedUser(user);
                          setFormData(user);
                          setShowEditModal(true);
                        }}
                      >
                        <FiEdit className="h-4 w-4 text-gray-500" />
                      </button>
                      {user.status !== 'active' ? (
                        <button 
                          className="p-1 rounded-full hover:bg-gray-100"
                          title="Approve user"
                          onClick={() => handleStatusChange(user.id, 'active')}
                        >
                          <FiUserCheck className="h-4 w-4 text-green-500" />
                        </button>
                      ) : (
                        <button 
                          className="p-1 rounded-full hover:bg-gray-100"
                          title="Reject user"
                          onClick={() => handleStatusChange(user.id, 'inactive')}
                        >
                          <FiUserX className="h-4 w-4 text-red-500" />
                        </button>
                      )}
                      <button 
                        className="p-1 rounded-full hover:bg-gray-100"
                        title="Delete user"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <FiTrash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No users found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New User"
      >
        <UserForm onSubmit={handleAddUser} />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit User"
      >
        <UserForm onSubmit={handleEditUser} initialData={selectedUser} />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default UserTable;