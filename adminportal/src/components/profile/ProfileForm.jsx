import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiLock, FiShield } from 'react-icons/fi';

const ProfileForm = ({ profile }) => {
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState('profile');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-card p-6">
      <div className="mb-6 border-b border-gray-200">
        <div className="flex flex-wrap -mb-px">
          <button
            className={`mr-8 py-4 px-1 text-sm font-medium ${
              activeTab === 'profile'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button
            className={`py-4 px-1 text-sm font-medium ${
              activeTab === 'password'
                ? 'border-b-2 border-primary-600 text-primary-600'
                : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {activeTab === 'profile' ? (
          <div>
            <div className="mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold mr-4">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-medium">{profile.name}</h2>
                  <p className="text-sm text-gray-500">{profile.role}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Your full name"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Your email address"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Your phone number"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Last Login</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiShield className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={profile.lastLogin}
                    className="form-input pl-10"
                    disabled
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button type="submit" className="btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Ensure your account is using a strong password to maintain security.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">Current Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Enter current password"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input pl-10"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button type="submit" className="btn-primary">
                Update Password
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;