-- Add duration column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS duration integer NOT NULL DEFAULT 1;

-- Add vehicle_number column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS vehicle_number text NOT NULL;

-- Add price column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS price integer NOT NULL;

-- Add constraint to ensure duration is positive
ALTER TABLE bookings ADD CONSTRAINT bookings_duration_check CHECK (duration > 0);

-- Add constraint to ensure price is positive
ALTER TABLE bookings ADD CONSTRAINT bookings_price_check CHECK (price > 0);