import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2 } from 'lucide-react';
import type { Location, TimeSlot } from '../types';

interface BookingConfirmationProps {
  location: Location;
  date: Date;
  timeSlot: TimeSlot;
  onClose: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  location,
  date,
  timeSlot,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scale-in overflow-hidden">
        <div className="bg-teal-600 p-6 text-white text-center">
          <CheckCircle2 className="h-16 w-16 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="mb-2">
                <span className="font-medium">Location:</span> {location.name}
              </p>
              <p className="mb-2">
                <span className="font-medium">Address:</span> {location.address}
              </p>
              <p className="mb-2">
                <span className="font-medium">Date:</span> {format(date, 'EEEE, MMMM d, yyyy')}
              </p>
              <p>
                <span className="font-medium">Time:</span> {timeSlot.startTime} - {timeSlot.endTime}
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              A confirmation has been sent to your email. You can also view this booking in your booking history.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-800 hover:bg-blue-900 text-white py-2 px-6 rounded-md transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;