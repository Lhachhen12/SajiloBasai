import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginUser } from '../../api/api';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // For demo purposes, we're using dummy credentials
      // In a real app, this would validate against a backend
      const response = await loginUser(email, password);
      
      if (response.success) {
        login(response.user);
        
        // Navigate based on user role
        if (response.user.role === 'buyer') {
          navigate('/buyer/dashboard');
        } else if (response.user.role === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate(from);
        }
      } else {
        // For demo purposes, we'll always succeed with valid demo accounts
        if (email === 'john@example.com') {
          login({ id: 1, name: 'John Doe', email, role: 'buyer' });
          navigate('/buyer/dashboard');
        } else if (email === 'jane@example.com') {
          login({ id: 2, name: 'Jane Smith', email, role: 'seller' });
          navigate('/seller/dashboard');
        } else {
          setError('Invalid email or password. Try using john@example.com (buyer) or jane@example.com (seller)');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
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
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to continue to your account</p>
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
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
              
              <div className="form-group">
                <div className="flex justify-between">
                  <label htmlFor="password" className="form-label">Password</label>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-800">Forgot Password?</a>
                </div>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input-field pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span>Loading...</span>
                  ) : (
                    <>
                      <FaSignInAlt className="mr-2" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-800 font-medium">
                  Register Now
                </Link>
              </p>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 mb-2 font-medium">Demo Accounts:</p>
              <p className="text-sm text-gray-600">
                <strong>Buyer:</strong> john@example.com<br />
                <strong>Seller:</strong> jane@example.com<br />
                <strong>Password:</strong> any password will work
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;