import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LocationList from './pages/LocationList';
import SlotBooking from './pages/SlotBooking';
import MyBookings from './pages/MyBookings';
import Home from './pages/Home';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }
  
  return user ? element : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/locations" /> : element;
};

function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route 
              path="/login" 
              element={<PublicRoute element={<Login />} />} 
            />
            <Route 
              path="/signup" 
              element={<PublicRoute element={<Signup />} />} 
            />
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                </>
              }
            />
            <Route
              path="/locations"
              element={
                <PrivateRoute
                  element={
                    <>
                      <Navbar />
                      <LocationList />
                    </>
                  }
                />
              }
            />
            <Route
              path="/book/:id"
              element={
                <PrivateRoute
                  element={
                    <>
                      <Navbar />
                      <SlotBooking />
                    </>
                  }
                />
              }
            />
            <Route
              path="/bookings"
              element={
                <PrivateRoute
                  element={
                    <>
                      <Navbar />
                      <MyBookings />
                    </>
                  }
                />
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default AppRoutes;