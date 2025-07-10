import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('cache-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['profiles', user.id] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'food_logs' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['foodLogs', user.id] });
          queryClient.invalidateQueries({ queryKey: ['favoriteFoods', user.id] });
          queryClient.invalidateQueries({ queryKey: ['foods', 'recent', user.id] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'meals' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['meals', user.id] });
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'foods' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['foods'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
};