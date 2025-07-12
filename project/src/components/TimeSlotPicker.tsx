import React from 'react';
import { format } from 'date-fns';
import type { TimeSlot } from '../types';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  duration: number;
  onSelectSlot: (slot: TimeSlot) => void;
  onDurationChange: (duration: number) => void;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlot,
  duration,
  onSelectSlot,
  onDurationChange,
}) => {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Select a time slot:</h3>
        <div className="flex items-center space-x-2">
          <label htmlFor="duration" className="text-sm font-medium text-gray-700">
            Duration (hours):
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5, 6, 8, 12, 24].map((hours) => (
              <option key={hours} value={hours}>
                {hours}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {slots.map((slot) => {
          // Check if enough consecutive slots are available
          const endSlotIndex = slots.findIndex(s => s.id === slot.id) + duration;
          const hasEnoughSlots = slots.slice(slots.findIndex(s => s.id === slot.id), endSlotIndex)
            .every(s => s.isAvailable);
          
          const isAvailable = slot.isAvailable && hasEnoughSlots;
          
          return (
            <button
              key={slot.id}
              onClick={() => isAvailable && onSelectSlot(slot)}
              disabled={!isAvailable}
              className={`
                py-3 px-4 rounded-md text-center transition-all
                ${selectedSlot?.id === slot.id
                  ? 'bg-teal-600 text-white border-2 border-teal-700 shadow-md'
                  : isAvailable
                  ? 'bg-white border border-gray-300 hover:border-teal-500 hover:shadow'
                  : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <span className="block font-medium">
                {slot.startTime} - {slot.endTime}
              </span>
              <span className="text-xs mt-1 block">
                {isAvailable ? 'Available' : 'Not Available'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotPicker;