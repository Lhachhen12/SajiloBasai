import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { registerUser } from '../../api/api';
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaUserFriends, FaCheck } from 'react-icons/fa';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }
    
    if (!role) {
      setError('Please select a role (Buyer or Seller)');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would register with a backend
      const userData = { name, email, role };
      const response = await registerUser(userData);
      
      if (response.success) {
        register(response.user);
        
        // Navigate based on user role
        if (role === 'buyer') {
          navigate('/buyer/dashboard');
        } else {
          navigate('/seller/dashboard');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-12 bg-gray-50 min-h-screen flex items-center">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Create an Account</h1>
              <p className="text-gray-600">Sign up and get started with HomeHaven</p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="form-group">
                <label className="form-label">I want to:</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                      role === 'buyer'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setRole('buyer')}
                  >
                    <div className={`rounded-full p-3 mb-2 ${
                      role === 'buyer' ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      <FaUserFriends className={`text-xl ${
                        role === 'buyer' ? 'text-primary-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <span className="font-medium">Find a Property</span>
                    <span className="text-xs mt-1">(Buyer)</span>
                    {role === 'buyer' && (
                      <div className="absolute top-2 right-2">
                        <FaCheck className="text-primary-600" />
                      </div>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                      role === 'seller'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setRole('seller')}
                  >
                    <div className={`rounded-full p-3 mb-2 ${
                      role === 'seller' ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      <FaUserTie className={`text-xl ${
                        role === 'seller' ? 'text-primary-600' : 'text-gray-500'
                      }`} />
                    </div>
                    <span className="font-medium">List a Property</span>
                    <span className="text-xs mt-1">(Seller)</span>
                    {role === 'seller' && (
                      <div className="absolute top-2 right-2">
                        <FaCheck className="text-primary-600" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
              
              {/* Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              
              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="input-field pl-10"
                    required
                    minLength="6"
                  />
                </div>
              </div>
              
              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="passwordConfirm"
                    value={passwordConfirm}
                    onChange={(e) => setPasswordConfirm(e.target.value)}
                    placeholder="Confirm your password"
                    className="input-field pl-10"
                    required
                    minLength="6"
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="form-group">
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
              
              <p className="text-xs text-gray-600 mt-4">
                By signing up, you agree to our{' '}
                <a href="#" className="text-primary-600 hover:text-primary-800">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-primary-600 hover:text-primary-800">Privacy Policy</a>.
              </p>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;