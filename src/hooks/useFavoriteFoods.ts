import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FavoriteFood {
  id: string;
  name: string;
  brand?: string;
  calories_per_100g: number;
  carbs_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  last_logged_quantity: number;
  last_logged_serving_size_id?: string;
  last_logged_serving_name?: string;
  last_logged_serving_grams?: number;
  log_count: number;
  last_logged_date: string;
}

export const useFavoriteFoods = () => {
  const [favoriteFoods, setFavoriteFoods] = useState<FavoriteFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavoriteFoods = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Query to get the most frequently logged foods with their last logged details
        const { data, error: queryError } = await supabase
          .from('food_logs')
          .select(`
            food_id,
            quantity,
            serving_size_id,
            log_date,
            foods!inner(
              id,
              name,
              brand,
              calories_per_100g,
              carbs_per_100g,
              protein_per_100g,
              fat_per_100g
            ),
            serving_sizes(
              id,
              name,
              grams
            )
          `)
          .eq('user_id', user.id)
          .not('food_id', 'is', null) // Exclude quick adds
          .order('log_date', { ascending: false });

        if (queryError) {
          throw queryError;
        }

        // Group by food_id and calculate statistics
        const foodStats = new Map<string, {
          food: any;
          logs: any[];
        }>();

        data?.forEach(log => {
          if (!log.food_id || !log.foods) return;
          
          if (!foodStats.has(log.food_id)) {
            foodStats.set(log.food_id, {
              food: log.foods,
              logs: []
            });
          }
          
          foodStats.get(log.food_id)?.logs.push(log);
        });

        // Convert to favorite foods with last logged details
        const favorites: FavoriteFood[] = [];
        
        for (const [foodId, stats] of foodStats.entries()) {
          const lastLog = stats.logs[0]; // Most recent log (ordered by date desc)
          
          favorites.push({
            id: foodId,
            name: stats.food.name,
            brand: stats.food.brand,
            calories_per_100g: stats.food.calories_per_100g,
            carbs_per_100g: stats.food.carbs_per_100g,
            protein_per_100g: stats.food.protein_per_100g,
            fat_per_100g: stats.food.fat_per_100g,
            last_logged_quantity: lastLog.quantity,
            last_logged_serving_size_id: lastLog.serving_size_id,
            last_logged_serving_name: lastLog.serving_sizes?.name,
            last_logged_serving_grams: lastLog.serving_sizes?.grams,
            log_count: stats.logs.length,
            last_logged_date: lastLog.log_date
          });
        }

        // Sort by log count (most frequent first), then by last logged date
        favorites.sort((a, b) => {
          if (b.log_count !== a.log_count) {
            return b.log_count - a.log_count;
          }
          return new Date(b.last_logged_date).getTime() - new Date(a.last_logged_date).getTime();
        });

        // Take top 10
        setFavoriteFoods(favorites.slice(0, 10));

      } catch (err) {
        console.error('Error fetching favorite foods:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch favorite foods');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteFoods();
  }, [user]);

  return {
    favoriteFoods,
    loading,
    error
  };
};