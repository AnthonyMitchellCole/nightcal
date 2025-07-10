import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface USDAFood {
  fdcId: number;
  name: string;
  brand: string;
  dataType: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
    sugar?: number;
    saturated_fat?: number;
    trans_fat?: number;
    cholesterol?: number;
    calcium?: number;
    iron?: number;
    magnesium?: number;
    potassium?: number;
    vitamin_a?: number;
    vitamin_c?: number;
  };
}

export interface USDASearchResponse {
  foods: USDAFood[];
  totalHits: number;
  query: string;
  pageNumber: number;
  pageSize: number;
}

export const useUSDASearch = (searchQuery?: string) => {
  const [foods, setFoods] = useState<USDAFood[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalHits, setTotalHits] = useState(0);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query - longer delay to avoid wasting API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery || '');
    }, 1500); // Increased to 1.5 seconds
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setFoods([]);
      setTotalHits(0);
      setError(null);
      return;
    }

    const searchUSDA = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: functionError } = await supabase.functions.invoke('usda-food-search', {
          body: {
            query: debouncedQuery,
            pageSize: 20,
            pageNumber: 1
          }
        });

        if (functionError) {
          throw new Error(functionError.message || 'Failed to search USDA database');
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        setFoods(data?.foods || []);
        setTotalHits(data?.totalHits || 0);
      } catch (err) {
        console.error('USDA search error:', err);
        setError(err instanceof Error ? err.message : 'Failed to search USDA database');
        setFoods([]);
        setTotalHits(0);
      } finally {
        setLoading(false);
      }
    };

    searchUSDA();
  }, [debouncedQuery]);

  const searchMore = async (pageNumber: number) => {
    if (!debouncedQuery.trim() || loading) return;

    setLoading(true);
    try {
      const { data, error: functionError } = await supabase.functions.invoke('usda-food-search', {
        body: {
          query: debouncedQuery,
          pageSize: 20,
          pageNumber
        }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to load more results');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setFoods(prev => [...prev, ...(data?.foods || [])]);
    } catch (err) {
      console.error('USDA search more error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load more results');
    } finally {
      setLoading(false);
    }
  };

  return {
    foods,
    loading,
    error,
    totalHits,
    searchMore
  };
};