import { useDailySummary, useMealSummary } from '@/hooks/useFoodLogs';
import { useProfile } from '@/hooks/useProfile';

export const useFullLog = (date?: string) => {
  const { summary, loading: summaryLoading } = useDailySummary(date);
  const { meals, loading: mealsLoading } = useMealSummary(date);
  const { profile, loading: profileLoading } = useProfile();

  const loading = summaryLoading || mealsLoading || profileLoading;

  // Get goals from profile or use defaults
  const dailyGoals = {
    calories: profile?.calorie_goal || 2100,
    carbs: profile?.carb_goal_grams || 250,
    protein: profile?.protein_goal_grams || 150,
    fat: profile?.fat_goal_grams || 80
  };

  const dailyTotals = {
    calories: Math.round(summary.calories),
    carbs: Math.round(summary.carbs),
    protein: Math.round(summary.protein),
    fat: Math.round(summary.fat)
  };

  return {
    loading,
    dailyGoals,
    dailyTotals,
    meals
  };
};