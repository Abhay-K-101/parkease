import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import DatePicker from '../components/DatePicker';
import BookingConfirmation from '../components/BookingConfirmation';
import { useAuth } from '../contexts/AuthContext';
import type { Location, TimeSlot } from '../types';

const SlotBooking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [location, setLocation] = useState<Location | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching location:', error);
          return;
        }
        
        // Ensure hourly_rate is properly mapped to hourlyRate
        setLocation({
          ...data,
          hourlyRate: data.hourly_rate
        });
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);

  const calculateEndTime = (start: string): string => {
    const [hours, minutes] = start.split(':').map(Number);
    const endHour = (hours + duration) % 24;
    return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleBooking = async () => {
    if (!user || !location || !startTime || !vehicleNumber) {
      setError('Please fill in all required fields');
      return;
    }

    // Check if hourly_rate exists in the raw data
    if (!location.hourly_rate && !location.hourlyRate) {
      setError('Invalid hourly rate for this location');
      return;
    }
    
    setBookingLoading(true);
    setError(null);
    
    try {
      const endTime = calculateEndTime(startTime);
      // Use hourly_rate from the database
      const hourlyRate = location.hourly_rate || location.hourlyRate;
      const price = hourlyRate * duration;

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error('Invalid price calculation');
      }
      
      const booking = {
        user_id: user.id,
        location_id: location.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: startTime,
        end_time: endTime,
        vehicle_number: vehicleNumber,
        status: 'confirmed',
        duration: duration,
        price: price
      };
      
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert(booking);
      
      if (bookingError) {
        throw new Error(bookingError.message);
      }
      
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('Failed to create booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Location not found</h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-800 hover:bg-blue-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Locations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center text-gray-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to locations</span>
      </button>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex items-center mb-4 text-gray-700">
          <Calendar className="h-5 w-5 mr-2 text-blue-800" />
          <h2 className="text-xl font-semibold">Book a Parking Slot</h2>
        </div>

        <DatePicker 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
              Start Time
            </label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration (hours)
            </label>
            <select
              id="duration"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 8, 12, 24].map((hours) => (
                <option key={hours} value={hours}>
                  {hours} hour{hours > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
            Vehicle Number
          </label>
          <input
            type="text"
            id="vehicleNumber"
            value={vehicleNumber}
            onChange={(e) => setVehicleNumber(e.target.value)}
            placeholder="Enter your vehicle number"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        {error && (
          <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-md">
            {error}
          </div>
        )}
        
        <div className="mt-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="text-gray-600">
            <p className="font-medium">Booking Summary:</p>
            <p>Duration: {duration} hour{duration > 1 ? 's' : ''}</p>
            <p>Total Price: ₹{(location.hourly_rate || location.hourlyRate) * duration}</p>
          </div>
          
          <button
            onClick={handleBooking}
            disabled={!startTime || !vehicleNumber || bookingLoading}
            className={`
              px-8 py-3 rounded-md font-medium text-white 
              ${startTime && vehicleNumber
                ? 'bg-teal-600 hover:bg-teal-700' 
                : 'bg-gray-400 cursor-not-allowed'
              }
              transition-colors
            `}
          >
            {bookingLoading ? (
              <span className="flex items-center">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Processing...
              </span>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </div>

      {showConfirmation && (
        <BookingConfirmation
          location={location}
          date={selectedDate}
          timeSlot={{ id: '1', startTime, endTime: calculateEndTime(startTime), isAvailable: true }}
          onClose={() => {
            setShowConfirmation(false);
            navigate('/bookings');
          }}
        />
      )}
    </div>
  );
};

export default SlotBooking;