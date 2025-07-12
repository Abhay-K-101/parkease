import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Car, Menu, X, LogOut, History } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className={`${isHomePage ? 'absolute top-0 left-0 right-0 z-50 bg-transparent' : 'bg-blue-800'} text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Car className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl">ParkEase</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/locations" 
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  Locations
                </Link>
                <Link 
                  to="/bookings" 
                  className="px-3 py-2 rounded-md hover:bg-white/10 transition-colors"
                >
                  My Bookings
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : !isHomePage && (
              <Link
                to="/login"
                className="flex items-center px-4 py-2 rounded-md bg-white text-blue-800 hover:bg-gray-100 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-md"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link 
                  to="/locations" 
                  className="block px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Locations
                </Link>
                <Link 
                  to="/bookings" 
                  className="block px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    <span>My Bookings</span>
                  </div>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left flex items-center px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : !isHomePage && (
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;