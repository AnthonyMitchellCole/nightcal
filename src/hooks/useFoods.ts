import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { calculatePerServing } from '@/lib/nutritionCalculations';
import type { Tables } from '@/integrations/supabase/types';

type Food = Tables<'foods'>;
type FoodLog = Tables<'food_logs'>;
type ServingSize = Tables<'serving_sizes'>;

export interface FoodWithServing extends Food {
  default_serving?: ServingSize;
  calories_per_serving?: number;
  carbs_per_serving?: number;
  protein_per_serving?: number;
  fat_per_serving?: number;
  serving_display?: string;
}

// Query key factories for consistent cache management
const foodsKeys = {
  all: ['foods'] as const,
  search: (searchQuery?: string) => [...foodsKeys.all, 'search', searchQuery || 'all'] as const,
  recent: (userId: string) => [...foodsKeys.all, 'recent', userId] as const,
};

// Fetch foods with serving size calculations
const fetchFoods = async (searchQuery?: string): Promise<FoodWithServing[]> => {
  let query = supabase
    .from('foods')
    .select(`
      *,
      serving_sizes!inner(*)
    `)
    .eq('serving_sizes.is_default', true)
    .order('name');

  if (searchQuery && searchQuery.trim()) {
    query = query.or(`name.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Process foods with serving size calculations
  return (data || []).map((food: any) => {
    const defaultServing = food.serving_sizes?.[0];
    
    if (defaultServing) {
      const perServingValues = calculatePerServing(food, defaultServing.grams);
      return {
        ...food,
        default_serving: defaultServing,
        calories_per_serving: Math.round(perServingValues.calories),
        carbs_per_serving: perServingValues.carbs,
        protein_per_serving: perServingValues.protein,
        fat_per_serving: perServingValues.fat,
        serving_display: defaultServing.name
      };
    }
    
    // Fallback to 100g serving if no default serving size
    return {
      ...food,
      calories_per_serving: food.calories_per_100g,
      carbs_per_serving: food.carbs_per_100g,
      protein_per_serving: food.protein_per_100g,
      fat_per_serving: food.fat_per_100g,
      serving_display: 'per 100g'
    };
  });
};

// Fetch recent foods for a user
const fetchRecentFoods = async (userId: string): Promise<(FoodWithServing & { last_logged: string })[]> => {
  const { data, error } = await supabase
    .from('food_logs')
    .select(`
      food_id,
      log_date,
      foods (*)
    `)
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .limit(25);

  if (error) throw error;

  // Get unique foods with their last logged date
  const uniqueFoods = new Map();
  for (const log of data || []) {
    if (log.foods && !uniqueFoods.has(log.food_id)) {
      uniqueFoods.set(log.food_id, {
        ...log.foods,
        last_logged: log.log_date
      });
    }
  }

  // Fetch serving sizes for these foods
  const foodIds = Array.from(uniqueFoods.keys());
  const { data: servingData } = await supabase
    .from('serving_sizes')
    .select('*')
    .in('food_id', foodIds)
    .eq('is_default', true);

  // Process foods with serving size calculations
  return Array.from(uniqueFoods.values()).map((food: any) => {
    const defaultServing = servingData?.find(s => s.food_id === food.id);
    
    if (defaultServing) {
      const perServingValues = calculatePerServing(food, defaultServing.grams);
      return {
        ...food,
        default_serving: defaultServing,
        calories_per_serving: Math.round(perServingValues.calories),
        carbs_per_serving: perServingValues.carbs,
        protein_per_serving: perServingValues.protein,
        fat_per_serving: perServingValues.fat,
        serving_display: defaultServing.name
      };
    }
    
    // Fallback to 100g serving if no default serving size
    return {
      ...food,
      calories_per_serving: food.calories_per_100g,
      carbs_per_serving: food.carbs_per_100g,
      protein_per_serving: food.protein_per_100g,
      fat_per_serving: food.fat_per_100g,
      serving_display: 'per 100g'
    };
  });
};

export const useFoods = (searchQuery?: string) => {
  const {
    data: foods = [],
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: foodsKeys.search(searchQuery),
    queryFn: () => fetchFoods(searchQuery),
    staleTime: 60 * 60 * 1000, // Foods data is cached for 1 hour (relatively static)
    gcTime: 2 * 60 * 60 * 1000, // Keep in memory for 2 hours
  });

  const error = queryError instanceof Error ? queryError.message : null;

  return { foods, loading, error };
};

export const useRecentFoods = () => {
  const { user } = useAuth();

  const {
    data: recentFoods = [],
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: foodsKeys.recent(user?.id || ''),
    queryFn: () => fetchRecentFoods(user!.id),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Recent foods cached for 5 minutes
    gcTime: 15 * 60 * 1000, // Keep in memory for 15 minutes
  });

  const error = queryError instanceof Error ? queryError.message : null;

  return { recentFoods, loading, error };
};

export const useCreateFood = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createFoodMutation = useMutation({
    mutationFn: async (foodData: {
      name: string;
      brand?: string;
      calories_per_100g: number;
      carbs_per_100g: number;
      protein_per_100g: number;
      fat_per_100g: number;
      sugar_per_100g?: number;
      sodium_per_100g?: number;
      fiber_per_100g?: number;
      barcode?: string;
      category?: string;
      image_url?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('foods')
        .insert({
          ...foodData,
          created_by: user.id,
          is_custom: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate foods queries to show the new food
      queryClient.invalidateQueries({ queryKey: foodsKeys.all });
    },
  });

  const createFood = async (foodData: Parameters<typeof createFoodMutation.mutateAsync>[0]) => {
    try {
      const data = await createFoodMutation.mutateAsync(foodData);
      return data;
    } catch (err) {
      console.error('Error creating food:', err);
      throw err;
    }
  };

  return { createFood, loading: createFoodMutation.isPending };
};