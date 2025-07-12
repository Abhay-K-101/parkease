/*
  # Remove features column from locations table

  1. Changes
    - Remove features column from locations table
    - Update existing policies to reflect the change
*/

ALTER TABLE locations DROP COLUMN IF EXISTS features;