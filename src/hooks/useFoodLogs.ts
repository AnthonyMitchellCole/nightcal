import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type FoodLog = Tables<'food_logs'>;
type Food = Tables<'foods'>;
type Meal = Tables<'meals'>;
type ServingSize = Tables<'serving_sizes'>;

export interface FoodLogWithDetails extends FoodLog {
  foods: Food;
  meals: Meal;
  serving_sizes: ServingSize | null;
}

// Query key factories for consistent cache management
export const foodLogsKeys = {
  all: ['foodLogs'] as const,
  byUser: (userId: string) => [...foodLogsKeys.all, userId] as const,
  byDate: (userId: string, date: string) => [...foodLogsKeys.byUser(userId), date] as const,
  dailySummary: (userId: string, date: string) => [...foodLogsKeys.byDate(userId, date), 'summary'] as const,
  mealSummary: (userId: string, date: string) => [...foodLogsKeys.byDate(userId, date), 'meals'] as const,
};

// Fetch food logs for a specific date
const fetchFoodLogs = async (userId: string, date: string): Promise<FoodLogWithDetails[]> => {
  const { data, error } = await supabase
    .from('food_logs')
    .select(`
      *,
      foods (*),
      meals (*),
      serving_sizes (*)
    `)
    .eq('user_id', userId)
    .eq('log_date', date)
    .order('meals(time_slot_start)', { ascending: true, nullsFirst: false })
    .order('meals(name)', { ascending: true })
    .order('log_time', { ascending: true });

  if (error) throw error;
  return (data || []) as FoodLogWithDetails[];
};

export const useFoodLogs = (date?: string) => {
  const { user } = useAuth();
  const logDate = date || new Date().toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD format

  const {
    data: foodLogs = [],
    isLoading: loading,
    error: queryError,
    refetch
  } = useQuery({
    queryKey: foodLogsKeys.byDate(user?.id || '', logDate),
    queryFn: () => fetchFoodLogs(user!.id, logDate),
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // Food logs cached for 5 minutes
    gcTime: 15 * 60 * 1000, // Keep in memory for 15 minutes
  });

  const error = queryError instanceof Error ? queryError.message : null;

  return { 
    foodLogs, 
    loading, 
    error, 
    refetch: () => refetch()
  };
};

export const useDailySummary = (date?: string) => {
  const { user } = useAuth();
  const logDate = date || new Date().toLocaleDateString('en-CA');
  const { foodLogs, loading, error } = useFoodLogs(date);

  // Calculate summary from cached food logs
  const summary = {
    calories: 0,
    carbs: 0,
    protein: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    saturated_fat: 0,
    trans_fat: 0,
    cholesterol: 0,
    vitamin_a: 0,
    vitamin_c: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
    magnesium: 0
  };

  foodLogs.forEach(log => {
    summary.calories += log.calories;
    summary.carbs += log.carbs;
    summary.protein += log.protein;
    summary.fat += log.fat;
    summary.fiber += log.fiber || 0;
    summary.sugar += log.sugar || 0;
    summary.sodium += log.sodium || 0;
    summary.saturated_fat += log.saturated_fat || 0;
    summary.trans_fat += log.trans_fat || 0;
    summary.cholesterol += log.cholesterol || 0;
    summary.vitamin_a += log.vitamin_a || 0;
    summary.vitamin_c += log.vitamin_c || 0;
    summary.calcium += log.calcium || 0;
    summary.iron += log.iron || 0;
    summary.potassium += log.potassium || 0;
    summary.magnesium += log.magnesium || 0;
  });

  return { summary, loading, error };
};

export const useMealSummary = (date?: string) => {
  const { user } = useAuth();
  const logDate = date || new Date().toLocaleDateString('en-CA');
  const { foodLogs, loading, error } = useFoodLogs(date);

  // Calculate meal summary from cached food logs
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
      id: log.foods?.id || log.id,
      logId: log.id,
      name: log.log_type === 'quick_add' ? log.quick_add_name || 'Quick Add' : log.foods?.name || 'Unknown Food',
      brand: log.foods?.brand || null,
      calories: log.calories,
      carbs: log.carbs,
      protein: log.protein,
      fat: log.fat,
      quantity: log.quantity,
      grams: log.grams,
      servingSizeId: log.serving_size_id,
      servingSizeName: log.serving_sizes?.name || null,
      isQuickAdd: log.log_type === 'quick_add'
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
    
    if (mealA?.time_slot_start && mealB?.time_slot_start) {
      return mealA.time_slot_start.localeCompare(mealB.time_slot_start);
    }
    
    if (mealA?.time_slot_start && !mealB?.time_slot_start) return -1;
    if (!mealA?.time_slot_start && mealB?.time_slot_start) return 1;
    
    return a.name.localeCompare(b.name);
  });

  return { 
    meals: sortedMeals, 
    loading, 
    error 
  };
};

export const useLogFood = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const logFoodMutation = useMutation({
    mutationFn: async (foodLog: {
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
      saturated_fat?: number;
      trans_fat?: number;
      cholesterol?: number;
      vitamin_a?: number;
      vitamin_c?: number;
      calcium?: number;
      iron?: number;
      potassium?: number;
      magnesium?: number;
      serving_size_id?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const now = new Date();
      const localDate = now.toLocaleDateString('en-CA');
      const localTime = now.toISOString();
      
      const { data, error } = await supabase
        .from('food_logs')
        .insert({
          ...foodLog,
          user_id: user.id,
          log_date: localDate,
          log_time: localTime
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to refetch food logs
      const logDate = data.log_date;
      queryClient.invalidateQueries({ 
        queryKey: foodLogsKeys.byDate(user!.id, logDate) 
      });
      
      // Also invalidate recent foods as this affects the recent list
      queryClient.invalidateQueries({ 
        queryKey: ['foods', 'recent', user!.id] 
      });
    },
  });

  const logFood = async (foodLog: Parameters<typeof logFoodMutation.mutateAsync>[0]) => {
    try {
      const data = await logFoodMutation.mutateAsync(foodLog);
      return data;
    } catch (err) {
      console.error('Error logging food:', err);
      throw err;
    }
  };

  return { logFood, loading: logFoodMutation.isPending };
};