import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);

  const addProperty = (property) => {
    setProperties(prev => [...prev, { ...property, id: Date.now() }]);
  };

  const addBooking = (booking) => {
    setBookings(prev => [...prev, { ...booking, id: Date.now() }]);
  };

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(property => property.id !== id));
    toast.success('Property deleted successfully');
  };

  const deleteBooking = (id) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
    toast.success('Booking deleted successfully');
  };

  const updateProperty = (id, updatedProperty) => {
    setProperties(prev => prev.map(property => 
      property.id === id ? { ...property, ...updatedProperty } : property
    ));
    toast.success('Property updated successfully');
  };

  const updateBooking = (id, updatedBooking) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, ...updatedBooking } : booking
    ));
    toast.success('Booking updated successfully');
  };

  const value = {
    properties,
    bookings,
    addProperty,
    addBooking,
    deleteProperty,
    deleteBooking,
    updateProperty,
    updateBooking
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};