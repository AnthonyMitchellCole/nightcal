-- Ensure all foods have at least one default serving size (100g)
INSERT INTO public.serving_sizes (food_id, name, grams, is_default)
SELECT 
  f.id,
  '100g',
  100,
  true
FROM public.foods f
WHERE NOT EXISTS (
  SELECT 1 
  FROM public.serving_sizes ss 
  WHERE ss.food_id = f.id
);

-- Add index for better performance on serving size queries
CREATE INDEX IF NOT EXISTS idx_serving_sizes_food_id ON public.serving_sizes(food_id);
CREATE INDEX IF NOT EXISTS idx_serving_sizes_default ON public.serving_sizes(food_id, is_default) WHERE is_default = true;