import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Meal = Tables<'meals'>;

export const useMeals = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMeals = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('meals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setMeals(data || []);
      } catch (err) {
        console.error('Error fetching meals:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch meals');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [user]);

  const createMeal = async (mealData: Omit<TablesInsert<'meals'>, 'user_id'>) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);
    setError(null);

    try {
      // Get next display order
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
      
      setMeals(prev => [...prev, data]);
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create meal';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateMeal = async (id: string, updates: Partial<TablesUpdate<'meals'>>) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setMeals(prev => prev.map(meal => meal.id === id ? data : meal));
      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update meal';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const deleteMeal = async (id: string) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('meals')
        .update({ is_active: false })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      setMeals(prev => prev.filter(meal => meal.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete meal';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const reorderMeals = async (reorderedMeals: Meal[]) => {
    if (!user) return { error: 'No user found' };

    setLoading(true);
    setError(null);

    try {
      const updates = reorderedMeals.map((meal, index) => ({
        id: meal.id,
        display_order: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('meals')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
          .eq('user_id', user.id);

        if (error) throw error;
      }

      setMeals(reorderedMeals);
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder meals';
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
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