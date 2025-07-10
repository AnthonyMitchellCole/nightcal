import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Meal = Tables<'meals'>;

// Query key factories
const mealsKeys = {
  all: ['meals'] as const,
  byUser: (userId: string) => [...mealsKeys.all, userId] as const,
};

// Fetch meals for a user
const fetchMeals = async (userId: string): Promise<Meal[]> => {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('display_order');

  if (error) throw error;
  return data || [];
};

export const useMeals = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: meals = [],
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: mealsKeys.byUser(user?.id || ''),
    queryFn: () => fetchMeals(user!.id),
    enabled: !!user,
    staleTime: 15 * 60 * 1000, // Meals cached for 15 minutes
    gcTime: 30 * 60 * 1000, // Keep in memory for 30 minutes
  });

  const error = queryError instanceof Error ? queryError.message : null;

  // Create meal mutation
  const createMealMutation = useMutation({
    mutationFn: async (mealData: Omit<TablesInsert<'meals'>, 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      // Calculate next display order
      const maxOrder = Math.max(...meals.map(m => m.display_order || 0), 0);
      
      const { data, error } = await supabase
        .from('meals')
        .insert({
          ...mealData,
          user_id: user.id,
          display_order: maxOrder + 1
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealsKeys.byUser(user!.id) });
    },
  });

  const createMeal = async (mealData: Omit<TablesInsert<'meals'>, 'user_id'>) => {
    try {
      const data = await createMealMutation.mutateAsync(mealData);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create meal';
      return { error: errorMessage };
    }
  };

  // Update meal mutation
  const updateMealMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<TablesUpdate<'meals'>> }) => {
      const { data, error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user!.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries({ queryKey: mealsKeys.byUser(user!.id) });
      
      const previousMeals = queryClient.getQueryData<Meal[]>(mealsKeys.byUser(user!.id));
      
      if (previousMeals) {
        queryClient.setQueryData<Meal[]>(mealsKeys.byUser(user!.id), 
          previousMeals.map(meal => 
            meal.id === id ? { ...meal, ...updates } : meal
          )
        );
      }
      
      return { previousMeals };
    },
    onError: (err, variables, context) => {
      if (context?.previousMeals) {
        queryClient.setQueryData(mealsKeys.byUser(user!.id), context.previousMeals);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealsKeys.byUser(user!.id) });
    },
  });

  const updateMeal = async (id: string, updates: Partial<TablesUpdate<'meals'>>) => {
    try {
      const data = await updateMealMutation.mutateAsync({ id, updates });
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update meal';
      return { error: errorMessage };
    }
  };

  // Delete meal mutation
  const deleteMealMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('meals')
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', user!.id);

      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: mealsKeys.byUser(user!.id) });
      
      const previousMeals = queryClient.getQueryData<Meal[]>(mealsKeys.byUser(user!.id));
      
      if (previousMeals) {
        queryClient.setQueryData<Meal[]>(mealsKeys.byUser(user!.id), 
          previousMeals.filter(meal => meal.id !== id)
        );
      }
      
      return { previousMeals };
    },
    onError: (err, variables, context) => {
      if (context?.previousMeals) {
        queryClient.setQueryData(mealsKeys.byUser(user!.id), context.previousMeals);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealsKeys.byUser(user!.id) });
    },
  });

  const deleteMeal = async (id: string) => {
    try {
      await deleteMealMutation.mutateAsync(id);
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete meal';
      return { error: errorMessage };
    }
  };

  // Reorder meals mutation
  const reorderMealsMutation = useMutation({
    mutationFn: async (reorderedMeals: Meal[]) => {
      const updates = reorderedMeals.map((meal, index) => ({
        id: meal.id,
        display_order: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('meals')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
          .eq('user_id', user!.id);

        if (error) throw error;
      }
    },
    onMutate: async (reorderedMeals) => {
      await queryClient.cancelQueries({ queryKey: mealsKeys.byUser(user!.id) });
      
      const previousMeals = queryClient.getQueryData<Meal[]>(mealsKeys.byUser(user!.id));
      
      queryClient.setQueryData<Meal[]>(mealsKeys.byUser(user!.id), reorderedMeals);
      
      return { previousMeals };
    },
    onError: (err, variables, context) => {
      if (context?.previousMeals) {
        queryClient.setQueryData(mealsKeys.byUser(user!.id), context.previousMeals);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealsKeys.byUser(user!.id) });
    },
  });

  const reorderMeals = async (reorderedMeals: Meal[]) => {
    try {
      await reorderMealsMutation.mutateAsync(reorderedMeals);
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder meals';
      return { error: errorMessage };
    }
  };

  return {
    meals,
    loading,
    error,
    createMeal,
    updateMeal,
    deleteMeal,
    reorderMeals
  };
};