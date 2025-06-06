import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('propertyFinderUser');
    
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user', error);
        localStorage.removeItem('propertyFinderUser');
      }
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('propertyFinderUser', JSON.stringify(user));
    return true;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('propertyFinderUser');
  };

  // Register function (simplified)
  const register = (user) => {
    setCurrentUser(user);
    localStorage.setItem('propertyFinderUser', JSON.stringify(user));
    return true;
  };

  // Context value
  const value = {
    currentUser,
    login,
    logout,
    register,
    isLoggedIn: !!currentUser,
    isBuyer: currentUser?.role === 'buyer',
    isSeller: currentUser?.role === 'seller'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};