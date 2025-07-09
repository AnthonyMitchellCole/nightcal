-- Make food_id nullable in food_logs to allow quick add entries without foods
ALTER TABLE public.food_logs ALTER COLUMN food_id DROP NOT NULL;

-- Add a type field to distinguish between regular food logs and quick add logs
ALTER TABLE public.food_logs ADD COLUMN log_type TEXT DEFAULT 'food' CHECK (log_type IN ('food', 'quick_add'));

-- Update the log_type to 'quick_add' for entries without food_id
UPDATE public.food_logs SET log_type = 'quick_add' WHERE food_id IS NULL;

-- Add a name field for quick add entries (since they don't have an associated food)
ALTER TABLE public.food_logs ADD COLUMN quick_add_name TEXT;

-- Create index for better performance on log_type queries
CREATE INDEX idx_food_logs_log_type ON public.food_logs(log_type);