/*
  # Create locations table with 100 parking spots

  1. New Tables
    - locations
      - id (uuid, primary key)
      - name (text)
      - address (text)
      - area (text)
      - total_spots (integer)
      - available_spots (integer)
      - hourly_rate (integer)
      - image_url (text)
      - coordinates (jsonb)
      - features (text[])
      - created_at (timestamptz)

  2. Security
    - Enable RLS on locations table
    - Add policy for authenticated users to read locations

  3. Data
    - Insert 100 parking locations across Bangalore
    - Locations spread across 10 different areas
    - Dynamic pricing between ₹40-100/hour
    - Various features like CCTV, EV Charging, etc.
*/

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  area text NOT NULL,
  total_spots integer NOT NULL,
  available_spots integer NOT NULL,
  hourly_rate integer NOT NULL,
  image_url text NOT NULL,
  coordinates jsonb NOT NULL,
  features text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Locations are viewable by everyone" ON locations;

-- Create policy to allow all authenticated users to read locations
CREATE POLICY "Locations are viewable by everyone"
  ON locations
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert 100 locations
INSERT INTO locations (name, address, area, total_spots, available_spots, hourly_rate, image_url, coordinates, features)
SELECT 
  'Parking Zone ' || i || ' - ' || 
  CASE (i % 10)
    WHEN 0 THEN 'Indiranagar'
    WHEN 1 THEN 'Koramangala'
    WHEN 2 THEN 'HSR Layout'
    WHEN 3 THEN 'Whitefield'
    WHEN 4 THEN 'JP Nagar'
    WHEN 5 THEN 'Jayanagar'
    WHEN 6 THEN 'BTM Layout'
    WHEN 7 THEN 'Electronic City'
    WHEN 8 THEN 'Marathahalli'
    WHEN 9 THEN 'Bellandur'
  END as name,
  CASE (i % 10)
    WHEN 0 THEN '100 Feet Road'
    WHEN 1 THEN 'Sony World Signal'
    WHEN 2 THEN 'BDA Complex'
    WHEN 3 THEN 'ITPL Main Road'
    WHEN 4 THEN 'Ring Road'
    WHEN 5 THEN '4th Block'
    WHEN 6 THEN 'Madiwala'
    WHEN 7 THEN 'Phase 1'
    WHEN 8 THEN 'Outer Ring Road'
    WHEN 9 THEN 'Sarjapur Road'
  END || ', ' ||
  CASE (i % 10)
    WHEN 0 THEN 'Indiranagar'
    WHEN 1 THEN 'Koramangala'
    WHEN 2 THEN 'HSR Layout'
    WHEN 3 THEN 'Whitefield'
    WHEN 4 THEN 'JP Nagar'
    WHEN 5 THEN 'Jayanagar'
    WHEN 6 THEN 'BTM Layout'
    WHEN 7 THEN 'Electronic City'
    WHEN 8 THEN 'Marathahalli'
    WHEN 9 THEN 'Bellandur'
  END || ', Bengaluru, Karnataka ' || (560000 + i) as address,
  CASE (i % 10)
    WHEN 0 THEN 'Indiranagar'
    WHEN 1 THEN 'Koramangala'
    WHEN 2 THEN 'HSR Layout'
    WHEN 3 THEN 'Whitefield'
    WHEN 4 THEN 'JP Nagar'
    WHEN 5 THEN 'Jayanagar'
    WHEN 6 THEN 'BTM Layout'
    WHEN 7 THEN 'Electronic City'
    WHEN 8 THEN 'Marathahalli'
    WHEN 9 THEN 'Bellandur'
  END as area,
  50 + (i % 150) as total_spots,
  25 + (i % 75) as available_spots,
  40 + (i % 60) as hourly_rate,
  CASE (i % 6)
    WHEN 0 THEN 'https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg'
    WHEN 1 THEN 'https://images.pexels.com/photos/1756957/pexels-photo-1756957.jpeg'
    WHEN 2 THEN 'https://images.pexels.com/photos/2078465/pexels-photo-2078465.jpeg'
    WHEN 3 THEN 'https://images.pexels.com/photos/1687093/pexels-photo-1687093.jpeg'
    WHEN 4 THEN 'https://images.pexels.com/photos/1470607/pexels-photo-1470607.jpeg'
    WHEN 5 THEN 'https://images.pexels.com/photos/586687/pexels-photo-586687.jpeg'
  END as image_url,
  jsonb_build_object(
    'lat', 12.9716 + (random() * 0.2),
    'lng', 77.5946 + (random() * 0.2)
  ) as coordinates,
  ARRAY[
    CASE WHEN i % 2 = 0 THEN 'CCTV' END,
    CASE WHEN i % 3 = 0 THEN '24/7' END,
    CASE WHEN i % 4 = 0 THEN 'Covered' END,
    CASE WHEN i % 5 = 0 THEN 'EV Charging' END,
    CASE WHEN i % 6 = 0 THEN 'Valet' END
  ] as features
FROM generate_series(1, 100) i;