/*
  # Fix booking schema

  1. Changes
    - Remove slot_id column since we're using start_time and end_time
    - Update column names to match frontend expectations
    - Add proper constraints and indexes
    - Enable RLS with appropriate policies

  2. Security
    - Enable RLS
    - Add policies for user operations
*/

-- Drop existing table
DROP TABLE IF EXISTS bookings CASCADE;

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id uuid REFERENCES locations(id) ON DELETE CASCADE,
  date date NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  vehicle_number text NOT NULL,
  price integer NOT NULL CHECK (price > 0),
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  duration integer NOT NULL DEFAULT 1 CHECK (duration > 0),
  created_at timestamptz DEFAULT now()
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