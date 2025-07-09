import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type ServingSize = Tables<'serving_sizes'>;

export const useServingSizes = (foodId?: string) => {
  const [servingSizes, setServingSizes] = useState<ServingSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (foodId) {
      fetchServingSizes();
    }
  }, [foodId]);

  const fetchServingSizes = async () => {
    if (!foodId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('serving_sizes')
        .select('*')
        .eq('food_id', foodId)
        .order('is_default', { ascending: false })
        .order('name');

      if (error) throw error;
      setServingSizes(data || []);
    } catch (err) {
      console.error('Error fetching serving sizes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch serving sizes');
    } finally {
      setLoading(false);
    }
  };

  const createServingSize = async (servingData: {
    name: string;
    grams: number;
    is_default?: boolean;
  }) => {
    if (!foodId || !user) throw new Error('Food ID and user required');

    try {
      // If this is being set as default, unset other defaults first
      if (servingData.is_default) {
        await supabase
          .from('serving_sizes')
          .update({ is_default: false })
          .eq('food_id', foodId);
      }

      const { data, error } = await supabase
        .from('serving_sizes')
        .insert({
          food_id: foodId,
          name: servingData.name,
          grams: servingData.grams,
          is_default: servingData.is_default || false
        })
        .select()
        .single();

      if (error) throw error;

      await fetchServingSizes(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error creating serving size:', err);
      throw err;
    }
  };

  const updateServingSize = async (id: string, updates: {
    name?: string;
    grams?: number;
    is_default?: boolean;
  }) => {
    if (!user) throw new Error('User required');

    try {
      // If this is being set as default, unset other defaults first
      if (updates.is_default) {
        await supabase
          .from('serving_sizes')
          .update({ is_default: false })
          .eq('food_id', foodId);
      }

      const { data, error } = await supabase
        .from('serving_sizes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await fetchServingSizes(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error updating serving size:', err);
      throw err;
    }
  };

  const deleteServingSize = async (id: string) => {
    if (!user) throw new Error('User required');

    try {
      // Check if this is the last serving size
      if (servingSizes.length <= 1) {
        throw new Error('Cannot delete the last serving size. Each food must have at least one serving size.');
      }

      const servingToDelete = servingSizes.find(s => s.id === id);
      const { error } = await supabase
        .from('serving_sizes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // If we deleted the default serving size, make another one default
      if (servingToDelete?.is_default && servingSizes.length > 1) {
        const remainingServings = servingSizes.filter(s => s.id !== id);
        if (remainingServings.length > 0) {
          await supabase
            .from('serving_sizes')
            .update({ is_default: true })
            .eq('id', remainingServings[0].id);
        }
      }

      await fetchServingSizes(); // Refresh the list
    } catch (err) {
      console.error('Error deleting serving size:', err);
      throw err;
    }
  };

  return {
    servingSizes,
    loading,
    error,
    createServingSize,
    updateServingSize,
    deleteServingSize,
    refetch: fetchServingSizes
  };
};