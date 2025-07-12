/*
  # Update locations schema
  
  1. Changes:
    - Remove image_url column
    - Use snake_case for column names
    - Add proper constraints and defaults
    - Add 100 locations with randomized data
  
  2. Security:
    - Enable RLS
    - Add policy for authenticated users to read locations
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS locations CASCADE;

CREATE TABLE locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  area text NOT NULL,
  total_spots integer NOT NULL CHECK (total_spots > 0),
  available_spots integer NOT NULL CHECK (available_spots >= 0),
  hourly_rate integer NOT NULL CHECK (hourly_rate > 0),
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
INSERT INTO locations (name, address, area, total_spots, available_spots, hourly_rate, coordinates, features)
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