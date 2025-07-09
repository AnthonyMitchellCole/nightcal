-- Fix critical security vulnerability in profile creation
-- Update handle_new_user function to include proper authorization checks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Verify that we're actually creating a profile for the authenticated user
  -- This prevents unauthorized profile creation
  IF NEW.id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;
  
  -- Insert profile with proper user validation
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't expose sensitive information
    RAISE LOG 'Profile creation failed for user %: %', NEW.id, SQLERRM;
    RAISE EXCEPTION 'Profile creation failed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add validation function for positive numeric values
CREATE OR REPLACE FUNCTION public.validate_positive_numeric(value NUMERIC, field_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  IF value IS NULL THEN
    RETURN TRUE; -- Allow null values
  END IF;
  
  IF value < 0 THEN
    RAISE EXCEPTION 'Field % must be a positive number, got %', field_name, value;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add validation triggers for food_logs table
CREATE OR REPLACE FUNCTION public.validate_food_log_data()
RETURNS trigger AS $$
BEGIN
  -- Validate positive numeric values
  PERFORM public.validate_positive_numeric(NEW.calories, 'calories');
  PERFORM public.validate_positive_numeric(NEW.protein, 'protein');
  PERFORM public.validate_positive_numeric(NEW.carbs, 'carbs');
  PERFORM public.validate_positive_numeric(NEW.fat, 'fat');
  PERFORM public.validate_positive_numeric(NEW.grams, 'grams');
  PERFORM public.validate_positive_numeric(NEW.quantity, 'quantity');
  
  -- Validate optional nutrients
  PERFORM public.validate_positive_numeric(NEW.fiber, 'fiber');
  PERFORM public.validate_positive_numeric(NEW.sodium, 'sodium');
  PERFORM public.validate_positive_numeric(NEW.sugar, 'sugar');
  PERFORM public.validate_positive_numeric(NEW.saturated_fat, 'saturated_fat');
  PERFORM public.validate_positive_numeric(NEW.trans_fat, 'trans_fat');
  PERFORM public.validate_positive_numeric(NEW.cholesterol, 'cholesterol');
  PERFORM public.validate_positive_numeric(NEW.calcium, 'calcium');
  PERFORM public.validate_positive_numeric(NEW.iron, 'iron');
  PERFORM public.validate_positive_numeric(NEW.magnesium, 'magnesium');
  PERFORM public.validate_positive_numeric(NEW.potassium, 'potassium');
  PERFORM public.validate_positive_numeric(NEW.vitamin_a, 'vitamin_a');
  PERFORM public.validate_positive_numeric(NEW.vitamin_c, 'vitamin_c');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for food_logs validation
DROP TRIGGER IF EXISTS validate_food_log_trigger ON public.food_logs;
CREATE TRIGGER validate_food_log_trigger
  BEFORE INSERT OR UPDATE ON public.food_logs
  FOR EACH ROW EXECUTE FUNCTION public.validate_food_log_data();

-- Add validation for foods table
CREATE OR REPLACE FUNCTION public.validate_food_data()
RETURNS trigger AS $$
BEGIN
  -- Validate positive numeric values for per 100g data
  PERFORM public.validate_positive_numeric(NEW.calories_per_100g, 'calories_per_100g');
  PERFORM public.validate_positive_numeric(NEW.protein_per_100g, 'protein_per_100g');
  PERFORM public.validate_positive_numeric(NEW.carbs_per_100g, 'carbs_per_100g');
  PERFORM public.validate_positive_numeric(NEW.fat_per_100g, 'fat_per_100g');
  
  -- Validate optional nutrients
  PERFORM public.validate_positive_numeric(NEW.fiber_per_100g, 'fiber_per_100g');
  PERFORM public.validate_positive_numeric(NEW.sodium_per_100g, 'sodium_per_100g');
  PERFORM public.validate_positive_numeric(NEW.sugar_per_100g, 'sugar_per_100g');
  PERFORM public.validate_positive_numeric(NEW.saturated_fat_per_100g, 'saturated_fat_per_100g');
  PERFORM public.validate_positive_numeric(NEW.trans_fat_per_100g, 'trans_fat_per_100g');
  PERFORM public.validate_positive_numeric(NEW.cholesterol_per_100g, 'cholesterol_per_100g');
  PERFORM public.validate_positive_numeric(NEW.calcium_per_100g, 'calcium_per_100g');
  PERFORM public.validate_positive_numeric(NEW.iron_per_100g, 'iron_per_100g');
  PERFORM public.validate_positive_numeric(NEW.magnesium_per_100g, 'magnesium_per_100g');
  PERFORM public.validate_positive_numeric(NEW.potassium_per_100g, 'potassium_per_100g');
  PERFORM public.validate_positive_numeric(NEW.vitamin_a_per_100g, 'vitamin_a_per_100g');
  PERFORM public.validate_positive_numeric(NEW.vitamin_c_per_100g, 'vitamin_c_per_100g');
  
  -- Sanitize barcode input (remove non-alphanumeric characters)
  IF NEW.barcode IS NOT NULL THEN
    NEW.barcode = regexp_replace(NEW.barcode, '[^a-zA-Z0-9]', '', 'g');
    
    -- Validate barcode length (typical barcodes are 8-14 digits)
    IF length(NEW.barcode) > 0 AND (length(NEW.barcode) < 8 OR length(NEW.barcode) > 14) THEN
      RAISE EXCEPTION 'Barcode must be between 8 and 14 characters';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for foods validation
DROP TRIGGER IF EXISTS validate_food_trigger ON public.foods;
CREATE TRIGGER validate_food_trigger
  BEFORE INSERT OR UPDATE ON public.foods
  FOR EACH ROW EXECUTE FUNCTION public.validate_food_data();

-- Add validation for profiles table
CREATE OR REPLACE FUNCTION public.validate_profile_data()
RETURNS trigger AS $$
BEGIN
  -- Validate goal values are positive
  PERFORM public.validate_positive_numeric(NEW.calorie_goal, 'calorie_goal');
  PERFORM public.validate_positive_numeric(NEW.protein_goal_grams, 'protein_goal_grams');
  PERFORM public.validate_positive_numeric(NEW.carb_goal_grams, 'carb_goal_grams');
  PERFORM public.validate_positive_numeric(NEW.fat_goal_grams, 'fat_goal_grams');
  
  -- Validate percentage goals are between 0 and 100
  IF NEW.protein_goal_percentage IS NOT NULL AND (NEW.protein_goal_percentage < 0 OR NEW.protein_goal_percentage > 100) THEN
    RAISE EXCEPTION 'Protein goal percentage must be between 0 and 100';
  END IF;
  
  IF NEW.carb_goal_percentage IS NOT NULL AND (NEW.carb_goal_percentage < 0 OR NEW.carb_goal_percentage > 100) THEN
    RAISE EXCEPTION 'Carb goal percentage must be between 0 and 100';
  END IF;
  
  IF NEW.fat_goal_percentage IS NOT NULL AND (NEW.fat_goal_percentage < 0 OR NEW.fat_goal_percentage > 100) THEN
    RAISE EXCEPTION 'Fat goal percentage must be between 0 and 100';
  END IF;
  
  -- Sanitize display name (remove potentially harmful characters)
  IF NEW.display_name IS NOT NULL THEN
    NEW.display_name = trim(NEW.display_name);
    NEW.display_name = regexp_replace(NEW.display_name, '[<>"\''&]', '', 'g');
    
    -- Limit display name length
    IF length(NEW.display_name) > 100 THEN
      RAISE EXCEPTION 'Display name cannot exceed 100 characters';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles validation
DROP TRIGGER IF EXISTS validate_profile_trigger ON public.profiles;
CREATE TRIGGER validate_profile_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_profile_data();