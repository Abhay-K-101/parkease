import React from 'react';
import { format, addDays } from 'date-fns';

interface DatePickerProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onDateChange }) => {
  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Select a date:</h3>
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {dates.map((date) => {
          const isSelected = 
            format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
          
          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={`
                flex flex-col items-center justify-center p-3 rounded-lg min-w-[80px]
                transition-all ${
                  isSelected
                    ? 'bg-blue-800 text-white'
                    : 'bg-white hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              <span className="text-xs font-medium">
                {format(date, 'EEE')}
              </span>
              <span className="text-lg font-bold">
                {format(date, 'd')}
              </span>
              <span className="text-xs">
                {format(date, 'MMM')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePicker;