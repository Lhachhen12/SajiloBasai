import { useState, useEffect } from 'react';
import ProfileForm from '../components/profile/ProfileForm';
import { getAdminProfile } from '../utils/adminApi';
import { FiSettings, FiShield, FiActivity } from 'react-icons/fi';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAdminProfile();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm text-gray-500">Manage your admin account and preferences</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileForm profile={profileData} />
        </div>
        
        <div className="space-y-6">
          <div className="dashboard-card">
            <h3 className="text-lg font-medium mb-4">Account Security</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiShield className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm">Two-factor Authentication</span>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="toggle-2fa" 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                  />
                  <label 
                    htmlFor="toggle-2fa" 
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FiActivity className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm">Login Notifications</span>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input 
                    type="checkbox" 
                    name="toggle" 
                    id="toggle-notifications" 
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                    defaultChecked 
                  />
                  <label 
                    htmlFor="toggle-notifications" 
                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                  ></label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="dashboard-card">
            <h3 className="text-lg font-medium mb-4">API Access</h3>
            <p className="text-sm text-gray-600 mb-4">
              Use API keys to connect external services to your admin account.
            </p>
            <button className="btn-outline w-full">
              Generate API Key
            </button>
          </div>
          
          <div className="dashboard-card">
            <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
            <div className="space-y-4">
              <div className="p-4 border border-red-200 rounded-md bg-red-50">
                <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
                <p className="text-xs text-red-600 mt-1">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="mt-3 px-4 py-2 bg-white border border-red-300 rounded text-red-600 text-sm hover:bg-red-50">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;