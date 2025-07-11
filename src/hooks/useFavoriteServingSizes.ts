import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type FavoriteServingSize = Tables<'favorite_serving_sizes'>;
type ServingSize = Tables<'serving_sizes'>;
type Food = Tables<'foods'>;

export interface FavoriteServingSizeWithDetails extends FavoriteServingSize {
  serving_sizes: ServingSize;
  foods: Food;
}

// Query key factory for consistent cache management
const favoriteServingSizesKeys = {
  all: ['favoriteServingSizes'] as const,
  byUser: (userId: string) => [...favoriteServingSizesKeys.all, userId] as const,
  byFood: (userId: string, foodId: string) => [...favoriteServingSizesKeys.byUser(userId), foodId] as const,
};

// Fetch all favorite serving sizes for a user
const fetchFavoriteServingSizes = async (userId: string): Promise<FavoriteServingSizeWithDetails[]> => {
  const { data, error } = await supabase
    .from('favorite_serving_sizes')
    .select(`
      *,
      serving_sizes (*),
      foods (*)
    `)
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data || []) as FavoriteServingSizeWithDetails[];
};

// Fetch favorite serving size for a specific food
const fetchFavoriteServingSize = async (userId: string, foodId: string): Promise<FavoriteServingSizeWithDetails | null> => {
  const { data, error } = await supabase
    .from('favorite_serving_sizes')
    .select(`
      *,
      serving_sizes (*),
      foods (*)
    `)
    .eq('user_id', userId)
    .eq('food_id', foodId)
    .single();

  if (error) {
    // If no favorite serving size exists, return null instead of throwing
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data as FavoriteServingSizeWithDetails;
};

export const useFavoriteServingSizes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all favorite serving sizes
  const {
    data: favoriteServingSizes = [],
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: favoriteServingSizesKeys.byUser(user?.id || ''),
    queryFn: () => fetchFavoriteServingSizes(user!.id),
    enabled: !!user,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in memory for 30 minutes
  });

  // Set/update favorite serving size mutation
  const setFavoriteServingMutation = useMutation({
    mutationFn: async ({ foodId, servingSizeId }: { foodId: string; servingSizeId: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Use upsert to handle unique constraint
      const { data, error } = await supabase
        .from('favorite_serving_sizes')
        .upsert(
          {
            user_id: user.id,
            food_id: foodId,
            serving_size_id: servingSizeId,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,food_id'
          }
        )
        .select(`
          *,
          serving_sizes (*),
          foods (*)
        `)
        .single();

      if (error) throw error;
      return data as FavoriteServingSizeWithDetails;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ 
        queryKey: favoriteServingSizesKeys.byUser(user!.id) 
      });
    },
  });

  // Delete favorite serving size mutation
  const deleteFavoriteServingMutation = useMutation({
    mutationFn: async (foodId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('favorite_serving_sizes')
        .delete()
        .eq('user_id', user.id)
        .eq('food_id', foodId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ 
        queryKey: favoriteServingSizesKeys.byUser(user!.id) 
      });
    },
  });

  // Helper function to get favorite serving size for a specific food
  const getFavoriteForFood = (foodId: string): FavoriteServingSizeWithDetails | null => {
    return favoriteServingSizes.find(fss => fss.food_id === foodId) || null;
  };

  // Helper function to get favorite serving size ID for a specific food
  const getFavoriteServingSize = (foodId: string): string | null => {
    const favorite = getFavoriteForFood(foodId);
    return favorite?.serving_size_id || null;
  };

  // Set favorite serving size function
  const setFavoriteServing = async (foodId: string, servingSizeId: string) => {
    try {
      const data = await setFavoriteServingMutation.mutateAsync({ foodId, servingSizeId });
      return data;
    } catch (err) {
      console.error('Error setting favorite serving size:', err);
      throw err;
    }
  };

  // Delete favorite serving size function
  const deleteFavoriteServing = async (foodId: string) => {
    try {
      await deleteFavoriteServingMutation.mutateAsync(foodId);
    } catch (err) {
      console.error('Error deleting favorite serving size:', err);
      throw err;
    }
  };

  const error = queryError instanceof Error ? queryError.message : null;

  return {
    favoriteServingSizes,
    getFavoriteForFood,
    getFavoriteServingSize,
    setFavoriteServing,
    deleteFavoriteServing,
    loading: loading || setFavoriteServingMutation.isPending || deleteFavoriteServingMutation.isPending,
    error
  };
};