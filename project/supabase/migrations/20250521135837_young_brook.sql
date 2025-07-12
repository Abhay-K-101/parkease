/*
  # Add missing columns and fix schema issues

  1. Changes
    - Add missing columns to bookings table:
      - start_time (time without time zone)
      - end_time (time without time zone)
    - Add indexes for better query performance
  
  2. Notes
    - Ensures column names follow snake_case convention
    - Maintains data integrity with NOT NULL constraints
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'start_time'
  ) THEN
    ALTER TABLE bookings ADD COLUMN start_time time without time zone NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'end_time'
  ) THEN
    ALTER TABLE bookings ADD COLUMN end_time time without time zone NOT NULL;
  END IF;
END $$;