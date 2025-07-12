/*
  # Fix bookings table schema

  1. Changes
    - Drop and recreate bookings table with correct column names and constraints
    - Add necessary indexes and policies
*/

-- Drop existing table
DROP TABLE IF EXISTS bookings CASCADE;

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  date date NOT NULL,
  slot_id uuid REFERENCES time_slots(id) ON DELETE CASCADE,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  vehicle_number text NOT NULL,
  price integer NOT NULL CHECK (price > 0),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  duration integer NOT NULL DEFAULT 1 CHECK (duration > 0)
);

-- Create indexes
CREATE INDEX bookings_user_id_idx ON bookings(user_id);
CREATE INDEX bookings_location_date_idx ON bookings(location_id, date);

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);