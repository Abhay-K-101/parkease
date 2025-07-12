export interface User {
  id: string;
  email: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  area: string;
  totalSpots: number;
  availableSpots: number;
  hourlyRate?: number;
  hourly_rate?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  features: string[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  locationId: string;
  date: string;
  startTime: string;
  endTime: string;
  vehicleNumber: string;
  price: number;
  status: 'confirmed' | 'cancelled';
  duration: number;
  createdAt: string;
}