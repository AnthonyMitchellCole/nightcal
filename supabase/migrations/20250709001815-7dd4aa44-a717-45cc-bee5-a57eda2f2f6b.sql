-- Create profiles table for user data, preferences, settings, and goals
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  
  -- Macro Goals (can be set by grams or percentage)
  calorie_goal INTEGER DEFAULT 2000,
  carb_goal_grams INTEGER,
  protein_goal_grams INTEGER,
  fat_goal_grams INTEGER,
  carb_goal_percentage DECIMAL(4,1),
  protein_goal_percentage DECIMAL(4,1),
  fat_goal_percentage DECIMAL(4,1),
  goal_type TEXT DEFAULT 'grams' CHECK (goal_type IN ('grams', 'percentage')),
  
  -- User Preferences
  preferences JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create foods table for the food database
CREATE TABLE public.foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  barcode TEXT UNIQUE,
  category TEXT,
  
  -- Nutritional information per 100g base
  calories_per_100g INTEGER NOT NULL,
  carbs_per_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  protein_per_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  fat_per_100g DECIMAL(8,2) NOT NULL DEFAULT 0,
  
  -- Additional nutrients (optional)
  sugar_per_100g DECIMAL(8,2),
  sodium_per_100g DECIMAL(8,2),
  fiber_per_100g DECIMAL(8,2),
  
  -- Meta information
  image_url TEXT,
  is_custom BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create serving_sizes table for multiple serving size options per food
CREATE TABLE public.serving_sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  food_id UUID NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "1 cup", "1 slice", "1 piece"
  grams DECIMAL(8,2) NOT NULL, -- equivalent weight in grams
  is_default BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meals table for user's customizable meals
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  
  -- Optional time slots for auto-selection
  time_slot_start TIME,
  time_slot_end TIME,
  
  -- Ordering and status
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create food_logs table for daily food entries
CREATE TABLE public.food_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES public.foods(id) ON DELETE CASCADE,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  
  -- Quantity and serving information
  quantity DECIMAL(8,2) NOT NULL DEFAULT 1,
  serving_size_id UUID REFERENCES public.serving_sizes(id),
  grams DECIMAL(8,2) NOT NULL, -- actual grams consumed
  
  -- Calculated nutritional values (stored for historical accuracy)
  calories DECIMAL(8,2) NOT NULL,
  carbs DECIMAL(8,2) NOT NULL,
  protein DECIMAL(8,2) NOT NULL,
  fat DECIMAL(8,2) NOT NULL,
  sugar DECIMAL(8,2),
  sodium DECIMAL(8,2),
  fiber DECIMAL(8,2),
  
  -- Log date and time
  log_date DATE NOT NULL DEFAULT CURRENT_DATE,
  log_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.serving_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for foods (public read, authenticated users can add custom foods)
CREATE POLICY "Anyone can view foods" 
ON public.foods 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create custom foods" 
ON public.foods 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by OR created_by IS NULL);

CREATE POLICY "Users can update their own custom foods" 
ON public.foods 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own custom foods" 
ON public.foods 
FOR DELETE 
USING (auth.uid() = created_by);

-- RLS Policies for serving_sizes (follow the food's permissions)
CREATE POLICY "Anyone can view serving sizes" 
ON public.serving_sizes 
FOR SELECT 
USING (true);

CREATE POLICY "Food creators can manage serving sizes" 
ON public.serving_sizes 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.foods 
    WHERE foods.id = serving_sizes.food_id 
    AND (foods.created_by = auth.uid() OR foods.created_by IS NULL)
  )
);

-- RLS Policies for meals
CREATE POLICY "Users can view their own meals" 
ON public.meals 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meals" 
ON public.meals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" 
ON public.meals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" 
ON public.meals 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for food_logs
CREATE POLICY "Users can view their own food logs" 
ON public.food_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own food logs" 
ON public.food_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own food logs" 
ON public.food_logs 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own food logs" 
ON public.food_logs 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('profile-pictures', 'profile-pictures', true),
  ('food-images', 'food-images', true);

-- Storage policies for profile pictures
CREATE POLICY "Profile pictures are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can upload their own profile picture" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile picture" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile picture" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'profile-pictures' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for food images
CREATE POLICY "Food images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'food-images');

CREATE POLICY "Authenticated users can upload food images" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'food-images');

CREATE POLICY "Users can update food images they uploaded" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'food-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete food images they uploaded" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'food-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_foods_name ON public.foods(name);
CREATE INDEX idx_foods_barcode ON public.foods(barcode);
CREATE INDEX idx_foods_created_by ON public.foods(created_by);
CREATE INDEX idx_serving_sizes_food_id ON public.serving_sizes(food_id);
CREATE INDEX idx_meals_user_id ON public.meals(user_id);
CREATE INDEX idx_meals_display_order ON public.meals(display_order);
CREATE INDEX idx_food_logs_user_id ON public.food_logs(user_id);
CREATE INDEX idx_food_logs_log_date ON public.food_logs(log_date);
CREATE INDEX idx_food_logs_food_id ON public.food_logs(food_id);
CREATE INDEX idx_food_logs_meal_id ON public.food_logs(meal_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_foods_updated_at
  BEFORE UPDATE ON public.foods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_logs_updated_at
  BEFORE UPDATE ON public.food_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default meals for new users
INSERT INTO public.meals (user_id, name, time_slot_start, time_slot_end, display_order) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Breakfast', '06:00:00', '09:00:00', 1),
  ('00000000-0000-0000-0000-000000000000', 'Lunch', '11:00:00', '14:00:00', 2),
  ('00000000-0000-0000-0000-000000000000', 'Dinner', '17:00:00', '20:00:00', 3),
  ('00000000-0000-0000-0000-000000000000', 'Snacks', NULL, NULL, 4);

-- Create function to create default meals for new users
CREATE OR REPLACE FUNCTION public.create_default_meals_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.meals (user_id, name, time_slot_start, time_slot_end, display_order)
  VALUES 
    (NEW.user_id, 'Breakfast', '06:00:00', '09:00:00', 1),
    (NEW.user_id, 'Lunch', '11:00:00', '14:00:00', 2),
    (NEW.user_id, 'Dinner', '17:00:00', '20:00:00', 3),
    (NEW.user_id, 'Snacks', NULL, NULL, 4);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create default meals when a profile is created
CREATE TRIGGER create_default_meals_on_profile_creation
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_meals_for_user();