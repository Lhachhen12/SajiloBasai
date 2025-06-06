import { useState, useEffect } from 'react';
import UserTable from '../components/users/UserTable';
import { getUserList } from '../utils/adminApi';
import { FiUserPlus } from 'react-icons/fi';
import Modal from '../components/shared/Modal';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getUserList();
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-500">View and manage all users on the platform</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 btn-primary flex items-center"
        >
          <FiUserPlus className="mr-2 h-4 w-4" />
          Add New User
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-card p-6">
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="dashboard-card bg-blue-50 border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 mr-4">
                <FiUserPlus className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <p className="text-xl font-bold">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card bg-green-50 border border-green-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 mr-4">
                <FiUserPlus className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Active Users</p>
                <p className="text-xl font-bold">
                  {users.filter(user => user.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card bg-amber-50 border border-amber-100">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-amber-100 mr-4">
                <FiUserPlus className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-amber-600">New This Month</p>
                <p className="text-xl font-bold">12</p>
              </div>
            </div>
          </div>
        </div>
        
        <UserTable users={users} />
      </div>
    </div>
  );
};

export default Users;