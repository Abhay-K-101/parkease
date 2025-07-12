/*
  # Add host_id to locations table

  1. Changes
    - Add host_id column to locations table
    - Add foreign key constraint to auth.users
    - Update RLS policies to allow hosts to manage their locations
*/

-- Add host_id column
ALTER TABLE locations ADD COLUMN IF NOT EXISTS host_id uuid REFERENCES auth.users(id);

-- Create policy for hosts to manage their locations
CREATE POLICY "Hosts can manage their own locations"
  ON locations
  FOR ALL
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);