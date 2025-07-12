/*
  # Restore features column to locations table

  1. Changes
    - Add features column back to locations table
    - Update existing locations with default features
*/

-- Add features column back
ALTER TABLE locations ADD COLUMN features text[] NOT NULL DEFAULT '{}';

-- Update existing locations with features
UPDATE locations
SET features = ARRAY[
  CASE WHEN random() < 0.7 THEN 'CCTV' END,
  CASE WHEN random() < 0.7 THEN '24/7' END,
  CASE WHEN random() < 0.7 THEN 'Covered' END,
  CASE WHEN random() < 0.7 THEN 'EV Charging' END,
  CASE WHEN random() < 0.7 THEN 'Valet' END
];