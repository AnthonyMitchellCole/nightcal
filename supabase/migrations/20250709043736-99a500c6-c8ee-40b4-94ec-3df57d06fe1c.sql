-- Add new nutrient columns to foods table
ALTER TABLE public.foods 
ADD COLUMN saturated_fat_per_100g numeric DEFAULT 0,
ADD COLUMN trans_fat_per_100g numeric DEFAULT 0,
ADD COLUMN cholesterol_per_100g numeric DEFAULT 0,
ADD COLUMN vitamin_a_per_100g numeric DEFAULT 0,
ADD COLUMN vitamin_c_per_100g numeric DEFAULT 0,
ADD COLUMN calcium_per_100g numeric DEFAULT 0,
ADD COLUMN iron_per_100g numeric DEFAULT 0,
ADD COLUMN potassium_per_100g numeric DEFAULT 0,
ADD COLUMN magnesium_per_100g numeric DEFAULT 0;

-- Add new nutrient columns to serving_sizes table
ALTER TABLE public.serving_sizes
ADD COLUMN saturated_fat_per_serving numeric DEFAULT 0,
ADD COLUMN trans_fat_per_serving numeric DEFAULT 0,
ADD COLUMN cholesterol_per_serving numeric DEFAULT 0,
ADD COLUMN vitamin_a_per_serving numeric DEFAULT 0,
ADD COLUMN vitamin_c_per_serving numeric DEFAULT 0,
ADD COLUMN calcium_per_serving numeric DEFAULT 0,
ADD COLUMN iron_per_serving numeric DEFAULT 0,
ADD COLUMN potassium_per_serving numeric DEFAULT 0,
ADD COLUMN magnesium_per_serving numeric DEFAULT 0;

-- Add new nutrient columns to food_logs table
ALTER TABLE public.food_logs
ADD COLUMN saturated_fat numeric DEFAULT 0,
ADD COLUMN trans_fat numeric DEFAULT 0,
ADD COLUMN cholesterol numeric DEFAULT 0,
ADD COLUMN vitamin_a numeric DEFAULT 0,
ADD COLUMN vitamin_c numeric DEFAULT 0,
ADD COLUMN calcium numeric DEFAULT 0,
ADD COLUMN iron numeric DEFAULT 0,
ADD COLUMN potassium numeric DEFAULT 0,
ADD COLUMN magnesium numeric DEFAULT 0;