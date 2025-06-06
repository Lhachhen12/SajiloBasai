import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';

// Layout components
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Listings from './pages/Listings';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import AddProperty from './pages/AddProperty';
import AddBooking from './pages/AddBooking';
import Bookings from './pages/Bookings';
import Pages from './pages/Pages';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AppProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard\" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="listings" element={<Listings />} />
            <Route path="add-property" element={<AddProperty />} />
            <Route path="add-booking" element={<AddBooking />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="pages" element={<Pages />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="contact" element={<Contact />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;