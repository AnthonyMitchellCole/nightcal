-- Create favorite_serving_sizes table for user-specific favorite serving sizes per food
CREATE TABLE public.favorite_serving_sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  serving_size_id UUID NOT NULL REFERENCES public.serving_sizes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unique constraint to prevent duplicate favorite serving sizes per user/food
  UNIQUE(user_id, food_id)
);

-- Enable Row Level Security
ALTER TABLE public.favorite_serving_sizes ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only manage their own favorite serving sizes
CREATE POLICY "Users can manage their own favorite serving sizes"
ON public.favorite_serving_sizes
FOR ALL
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_favorite_serving_sizes_user_id ON public.favorite_serving_sizes(user_id);
CREATE INDEX idx_favorite_serving_sizes_food_id ON public.favorite_serving_sizes(food_id);
CREATE INDEX idx_favorite_serving_sizes_user_food ON public.favorite_serving_sizes(user_id, food_id);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_favorite_serving_sizes_updated_at
  BEFORE UPDATE ON public.favorite_serving_sizes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();