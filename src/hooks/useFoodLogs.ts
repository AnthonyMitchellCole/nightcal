import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type FoodLog = Tables<'food_logs'>;
type Food = Tables<'foods'>;
type Meal = Tables<'meals'>;

export interface FoodLogWithDetails extends FoodLog {
  foods: Food;
  meals: Meal;
}

export const useFoodLogs = (date?: string) => {
  const [foodLogs, setFoodLogs] = useState<FoodLogWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFoodLogs = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const logDate = date || new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('food_logs')
          .select(`
            *,
            foods (*),
            meals (*)
          `)
          .eq('user_id', user.id)
          .eq('log_date', logDate)
          .order('meals(time_slot_start)', { ascending: true, nullsFirst: false })
          .order('meals(name)', { ascending: true })
          .order('log_time', { ascending: true });

        if (error) throw error;
        setFoodLogs((data || []) as FoodLogWithDetails[]);
      } catch (err) {
        console.error('Error fetching food logs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch food logs');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodLogs();
  }, [user, date]);

  const refetch = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const logDate = date || new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('food_logs')
        .select(`
          *,
          foods (*),
          meals (*)
        `)
        .eq('user_id', user.id)
        .eq('log_date', logDate)
        .order('meals(time_slot_start)', { ascending: true, nullsFirst: false })
        .order('meals(name)', { ascending: true })
        .order('log_time', { ascending: true });

      if (error) throw error;
      setFoodLogs((data || []) as FoodLogWithDetails[]);
    } catch (err) {
      console.error('Error fetching food logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch food logs');
    } finally {
      setLoading(false);
    }
  };

  return { foodLogs, loading, error, refetch };
};

export const useDailySummary = (date?: string) => {
  const { foodLogs, loading, error } = useFoodLogs(date);

  const summary = {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0
  };

  foodLogs.forEach(log => {
    summary.calories += log.calories;
    summary.carbs += log.carbs;
    summary.protein += log.protein;
    summary.fat += log.fat;
    summary.fiber += log.fiber || 0;
    summary.sugar += log.sugar || 0;
    summary.sodium += log.sodium || 0;
  });

  return { summary, loading, error };
};

export const useMealSummary = (date?: string) => {
  const { foodLogs, loading, error } = useFoodLogs(date);

  const mealSummary = new Map();

  foodLogs.forEach(log => {
    const mealId = log.meal_id;
    const mealName = log.meals.name;
    
    if (!mealSummary.has(mealId)) {
      mealSummary.set(mealId, {
        id: mealId,
        name: mealName,
        foods: [],
        totals: { calories: 0, carbs: 0, protein: 0, fat: 0 }
      });
    }

    const meal = mealSummary.get(mealId);
    meal.foods.push({
      id: log.foods?.id || log.id, // Use food_id if available, fallback to log id
      logId: log.id, // The actual food_log id
      name: log.log_type === 'quick_add' ? log.quick_add_name || 'Quick Add' : log.foods?.name || 'Unknown Food',
      brand: log.foods?.brand || null,
      calories: log.calories,
      carbs: log.carbs,
      protein: log.protein,
      fat: log.fat,
      quantity: log.quantity,
      grams: log.grams,
      servingSizeId: log.serving_size_id,
      isQuickAdd: log.log_type === 'quick_add' // Add this field to the meal summary
    });

    meal.totals.calories += log.calories;
    meal.totals.carbs += log.carbs;
    meal.totals.protein += log.protein;
    meal.totals.fat += log.fat;
  });

  // Sort meals by time slot, then alphabetically
  const sortedMeals = Array.from(mealSummary.values()).sort((a, b) => {
    const mealA = foodLogs.find(log => log.meal_id === a.id)?.meals;
    const mealB = foodLogs.find(log => log.meal_id === b.id)?.meals;
    
    // If both have time slots, sort by time
    if (mealA?.time_slot_start && mealB?.time_slot_start) {
      return mealA.time_slot_start.localeCompare(mealB.time_slot_start);
    }
    
    // If only one has time slot, put it first
    if (mealA?.time_slot_start && !mealB?.time_slot_start) return -1;
    if (!mealA?.time_slot_start && mealB?.time_slot_start) return 1;
    
    // If neither has time slot, sort alphabetically
    return a.name.localeCompare(b.name);
  });

  return { 
    meals: sortedMeals, 
    loading, 
    error 
  };
};

export const useLogFood = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const logFood = async (foodLog: {
    food_id: string;
    meal_id: string;
    quantity: number;
    grams: number;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
    serving_size_id?: string;
  }) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('food_logs')
        .insert({
          ...foodLog,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error logging food:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { logFood, loading };
};