-- Add timezone-aware date handling
-- Update the food_logs table to handle local timezone properly

-- First, let's create a function to get the local date string
CREATE OR REPLACE FUNCTION public.get_local_date_string(input_timestamp timestamptz DEFAULT now())
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  -- This will return the date in the user's timezone (to be handled by client)
  -- For now, we'll keep it simple and let the client handle timezone conversion
  RETURN input_timestamp::date::text;
END;
$$;

-- Update the default for log_date to be explicitly set by the client
-- We'll remove the default and require explicit date setting
ALTER TABLE public.food_logs 
ALTER COLUMN log_date DROP DEFAULT;

-- Update the default for log_time to be explicitly set by the client
ALTER TABLE public.food_logs 
ALTER COLUMN log_time DROP DEFAULT;