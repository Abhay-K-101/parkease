import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { PlusCircle, Trash2, Edit, Car, IndianRupee } from 'lucide-react';
import type { Location } from '../types';

const HostDashboard: React.FC = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    area: '',
    totalSpots: 1,
    availableSpots: 1,
    hourlyRate: 40,
  });

  useEffect(() => {
    fetchLocations();
  }, [user]);

  const fetchLocations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('host_id', user.id);
      
      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase.from('locations').insert({
        ...formData,
        host_id: user.id,
        coordinates: { lat: 12.9716, lng: 77.5946 }, // Default to Bangalore coordinates
      });

      if (error) throw error;

      setShowForm(false);
      setFormData({
        name: '',
        address: '',
        area: '',
        totalSpots: 1,
        availableSpots: 1,
        hourlyRate: 40,
      });
      fetchLocations();
    } catch (error) {
      console.error('Error creating location:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-800 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Parking Locations</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Add Location
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Add New Parking Location</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={e => setFormData(prev => ({ ...prev, area: e.target.value }))}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Spots
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.totalSpots}
                      onChange={e => setFormData(prev => ({ ...prev, totalSpots: parseInt(e.target.value) }))}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Available Spots
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={formData.totalSpots}
                      value={formData.availableSpots}
                      onChange={e => setFormData(prev => ({ ...prev, availableSpots: parseInt(e.target.value) }))}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hourly Rate (₹)
                    </label>
                    <input
                      type="number"
                      min="20"
                      value={formData.hourlyRate}
                      onChange={e => setFormData(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) }))}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    Add Location
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {locations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No parking locations yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by adding your first parking location
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Add Location
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map(location => (
            <div key={location.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
              <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
              <p className="text-gray-600 mb-4">{location.address}</p>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <Car className="h-5 w-5 mr-2 text-blue-800" />
                  <span>{location.availableSpots} / {location.totalSpots} spots available</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <IndianRupee className="h-5 w-5 mr-2 text-blue-800" />
                  <span>₹{location.hourlyRate}/hour</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button className="p-2 text-gray-600 hover:text-blue-800 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostDashboard;