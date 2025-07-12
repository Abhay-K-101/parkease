/*
  # Remove host functionality
  
  1. Changes
    - Remove host_id column from locations table
    - Remove host-related policies
*/

-- Remove host-related policy
DROP POLICY IF EXISTS "Hosts can manage their own locations" ON locations;

-- Remove host_id column
ALTER TABLE locations DROP COLUMN IF EXISTS host_id;