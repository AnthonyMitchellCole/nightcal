import { useState, useEffect } from 'react';
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

export const useFoods = (searchQuery?: string) => {
  const [foods, setFoods] = useState<FoodWithServing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      setLoading(true);
      setError(null);

      try {
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
        const processedFoods = (data || []).map((food: any) => {
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
              serving_display: `1 serving (${defaultServing.grams}g)`
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

        setFoods(processedFoods);
      } catch (err) {
        console.error('Error fetching foods:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch foods');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [searchQuery]);

  return { foods, loading, error };
};

export const useRecentFoods = () => {
  const [recentFoods, setRecentFoods] = useState<(FoodWithServing & { last_logged: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentFoods = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('food_logs')
          .select(`
            food_id,
            log_date,
            foods (*)
          `)
          .eq('user_id', user.id)
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
        const processedFoods = Array.from(uniqueFoods.values()).map((food: any) => {
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
              serving_display: `1 serving (${defaultServing.grams}g)`
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

        setRecentFoods(processedFoods);
      } catch (err) {
        console.error('Error fetching recent foods:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch recent foods');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentFoods();
  }, [user]);

  return { recentFoods, loading, error };
};

export const useCreateFood = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createFood = async (foodData: {
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

    setLoading(true);
    try {
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
    } catch (err) {
      console.error('Error creating food:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createFood, loading };
};