import React from 'react';
import { Link } from 'react-router-dom';
import { Car, MapPin, Clock, Shield } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Supercar Image */}
      <div 
        className="relative h-[80vh] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg")'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Secure Parking Solutions
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Book your parking spot in advance at your preferred location.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-all transform hover:scale-105 shadow-lg"
              >
                <Car className="h-5 w-5 mr-2" />
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all">
              <MapPin className="h-12 w-12 text-blue-800 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Multiple Locations</h3>
              <p className="text-gray-600">
                Find parking spots across all major areas in the city.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all">
              <Clock className="h-12 w-12 text-blue-800 mb-4" />
              <h3 className="text-xl font-semibold mb-3">24/7 Access</h3>
              <p className="text-gray-600">
                Access your vehicle anytime with our secure entry system.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all">
              <Shield className="h-12 w-12 text-blue-800 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Enhanced Security</h3>
              <p className="text-gray-600">
                CCTV surveillance and security staff for complete protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;