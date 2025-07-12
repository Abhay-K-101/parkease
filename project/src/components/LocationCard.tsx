import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag, Car, Check, IndianRupee } from 'lucide-react';
import type { Location } from '../types';

interface LocationCardProps {
  location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{location.name}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin size={18} className="mr-1" />
          <span>{location.area}</span>
        </div>
        <p className="text-gray-700 mb-4 text-sm">{location.address}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {location.features.filter(Boolean).map((feature, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
            >
              <Check size={12} className="mr-1" />
              {feature}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-500">
              <Car size={16} className="mr-1" />
              <span>{location.availableSpots} spots available</span>
            </div>
            <div className="flex items-center text-sm font-medium text-gray-900">
              <IndianRupee size={16} className="mr-1" />
              <span>₹{location.hourly_rate || location.hourlyRate}/hour</span>
            </div>
          </div>
          <Link 
            to={`/book/${location.id}`}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-md transition-colors"
          >
            View Slots
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;