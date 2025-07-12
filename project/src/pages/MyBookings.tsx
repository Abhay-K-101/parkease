import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isAfter, parseISO } from 'date-fns';
import { Clock, Calendar, MapPin, CheckCircle2, XCircle, IndianRupee, Car, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Booking, Location } from '../types';

interface BookingWithLocation extends Booking {
  location: Location;
}

const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingWithLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            location:locations(*)
          `)
          .eq('user_id', user.id)
          .order('date', { ascending: true });
        
        if (error) {
          console.error('Error fetching bookings:', error);
          return;
        }
        
        setBookings(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const cancelBooking = async (bookingId: string) => {
    if (!user) return;
    
    try {
      setCancellingBookingId(bookingId);
      
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error cancelling booking:', error);
        return;
      }
      
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        )
      );
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCancellingBookingId(null);
    }
  };

  const isUpcoming = (date: string, endTime: string) => {
    // Add validation for endTime
    if (!endTime) return false;
    
    const today = new Date();
    const bookingDate = parseISO(date);
    
    // If booking date is today, check the time
    if (format(bookingDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      const [timeStr, period] = endTime.split(' '); // e.g., "12:00 PM"
      if (!timeStr || !period) return false;
      
      const [hours, minutes] = timeStr.split(':').map(Number);
      if (isNaN(hours) || isNaN(minutes)) return false;
      
      let hour = hours;
      
      // Convert to 24-hour format if PM
      if (period === 'PM' && hours !== 12) {
        hour += 12;
      }
      // Convert 12 AM to 0
      if (period === 'AM' && hours === 12) {
        hour = 0;
      }
      
      const endDateTime = new Date(
        bookingDate.getFullYear(),
        bookingDate.getMonth(),
        bookingDate.getDate(),
        hour,
        minutes
      );
      
      return isAfter(endDateTime, today);
    }
    
    // For future dates
    return isAfter(bookingDate, today);
  };

  const filteredBookings = bookings.filter(booking => {
    if (booking.status === 'cancelled') return false;
    const upcoming = isUpcoming(booking.date, booking.endTime);
    return activeTab === 'upcoming' ? upcoming : !upcoming;
  });

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-800 border-t-transparent"></div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors shadow-sm"
        >
          <Car className="h-5 w-5 mr-2" />
          Book New Spot
        </Link>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
        <div className="flex border-b">
          {['upcoming', 'past'].map((tab) => (
            <button
              key={tab}
              className={`
                flex-1 py-4 text-center font-medium transition-all
                ${activeTab === tab
                  ? 'text-blue-800 border-b-2 border-blue-800 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
              onClick={() => setActiveTab(tab as 'upcoming' | 'past')}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Bookings
            </button>
          ))}
        </div>
        
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} bookings found
            </h3>
            <p className="text-gray-500 mb-8">
              {activeTab === 'upcoming'
                ? "You don't have any upcoming parking reservations."
                : "You don't have any past parking reservations."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {booking.location.name}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-1 text-blue-800" />
                      <span>{booking.location.address}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    disabled={cancellingBookingId === booking.id}
                    className={`
                      px-4 py-2.5 rounded-lg text-sm font-medium 
                      transition-all duration-200 flex items-center
                      ${cancellingBookingId === booking.id
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-sm'
                      }
                    `}
                  >
                    {cancellingBookingId === booking.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent mr-2" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Booking
                      </>
                    )}
                  </button>
                </div>
                
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 mr-3 text-blue-800" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm font-medium">
                        {format(parseISO(booking.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 mr-3 text-blue-800" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="text-sm font-medium">
                        {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <IndianRupee className="h-5 w-5 mr-3 text-blue-800" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Price</p>
                      <p className="text-sm font-medium">₹{booking.price}</p>
                    </div>
                  </div>
                </div>
                
                {activeTab === 'past' && (
                  <div className="mt-4 flex items-center text-green-600 bg-green-50 px-3 py-2 rounded-lg inline-block">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {activeTab === 'upcoming' && filteredBookings.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm flex items-start">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Cancellation Policy:</p>
            <p>You can cancel your booking up to 1 hour before the reserved time without any charges.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;