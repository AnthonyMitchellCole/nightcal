-- Add nutrition columns to serving_sizes table
ALTER TABLE public.serving_sizes 
ADD COLUMN calories_per_serving numeric,
ADD COLUMN carbs_per_serving numeric DEFAULT 0,
ADD COLUMN protein_per_serving numeric DEFAULT 0,
ADD COLUMN fat_per_serving numeric DEFAULT 0,
ADD COLUMN sugar_per_serving numeric,
ADD COLUMN sodium_per_serving numeric,
ADD COLUMN fiber_per_serving numeric;

-- Migrate existing data: calculate serving nutrition from 100g values for existing serving sizes
UPDATE public.serving_sizes 
SET 
  calories_per_serving = ROUND((foods.calories_per_100g * serving_sizes.grams / 100.0)::numeric, 1),
  carbs_per_serving = ROUND((foods.carbs_per_100g * serving_sizes.grams / 100.0)::numeric, 1),
  protein_per_serving = ROUND((foods.protein_per_100g * serving_sizes.grams / 100.0)::numeric, 1),
  fat_per_serving = ROUND((foods.fat_per_100g * serving_sizes.grams / 100.0)::numeric, 1),
  sugar_per_serving = CASE 
    WHEN foods.sugar_per_100g IS NOT NULL 
    THEN ROUND((foods.sugar_per_100g * serving_sizes.grams / 100.0)::numeric, 1)
    ELSE NULL 
  END,
  sodium_per_serving = CASE 
    WHEN foods.sodium_per_100g IS NOT NULL 
    THEN ROUND((foods.sodium_per_100g * serving_sizes.grams / 100.0)::numeric, 1)
    ELSE NULL 
  END,
  fiber_per_serving = CASE 
    WHEN foods.fiber_per_100g IS NOT NULL 
    THEN ROUND((foods.fiber_per_100g * serving_sizes.grams / 100.0)::numeric, 1)
    ELSE NULL 
  END
FROM public.foods 
WHERE serving_sizes.food_id = foods.id;