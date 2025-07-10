import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { foodLogsKeys } from '@/hooks/useFoodLogs';

interface FoodLogData {
  id: string;
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
  log_date: string;
  log_time: string;
  quick_add_name?: string;
  isQuickAdd?: boolean;
  food?: {
    name: string;
    brand?: string;
    calories_per_100g: number;
    carbs_per_100g: number;
    protein_per_100g: number;
    fat_per_100g: number;
    fiber_per_100g?: number;
    sugar_per_100g?: number;
    sodium_per_100g?: number;
  };
  serving_size?: {
    name: string;
    grams: number;
  };
}

export const useEditFoodLog = (foodLogId: string | undefined) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [foodLogData, setFoodLogData] = useState<FoodLogData | null>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [servingSizes, setServingSizes] = useState<any[]>([]);
  
  // Form state
  const [quantity, setQuantity] = useState('1');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedServing, setSelectedServing] = useState('');

  // Quick add form state
  const [quickAddData, setQuickAddData] = useState({
    name: '',
    calories: '',
    carbs: '',
    protein: '',
    fat: ''
  });

  // Fetch food log data
  useEffect(() => {
    const fetchFoodLog = async () => {
      if (!foodLogId || !user) return;

      try {
        setLoading(true);
        
        // Fetch food log with related data
        const { data: foodLog, error: foodLogError } = await supabase
          .from('food_logs')
          .select(`
            *,
            foods:food_id (
              name,
              brand,
              calories_per_100g,
              carbs_per_100g,
              protein_per_100g,
              fat_per_100g,
              fiber_per_100g,
              sugar_per_100g,
              sodium_per_100g
            ),
            serving_sizes:serving_size_id (
              name,
              grams
            )
          `)
          .eq('id', foodLogId)
          .eq('user_id', user.id)
          .single();

        if (foodLogError) throw foodLogError;
        
        // Check if it's a quick add entry
        const isQuickAdd = !foodLog.food_id;
        
        setFoodLogData({
          ...foodLog,
          isQuickAdd,
          food: foodLog.foods,
          serving_size: foodLog.serving_sizes
        });

        // Set form values
        setQuantity(foodLog.quantity.toString());
        setSelectedMeal(foodLog.meal_id);
        setSelectedServing(foodLog.serving_size_id || 'default-100');

        // Set quick add data if applicable
        if (isQuickAdd) {
          setQuickAddData({
            name: foodLog.quick_add_name || '',
            calories: foodLog.calories.toString(),
            carbs: foodLog.carbs.toString(),
            protein: foodLog.protein.toString(),
            fat: foodLog.fat.toString()
          });
        }

        // Fetch user's meals
        const { data: mealsData, error: mealsError } = await supabase
          .from('meals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('display_order');

        if (mealsError) throw mealsError;
        setMeals(mealsData || []);

        // Fetch serving sizes if not quick add
        if (!isQuickAdd && foodLog.food_id) {
          const { data: servingData, error: servingError } = await supabase
            .from('serving_sizes')
            .select('*')
            .eq('food_id', foodLog.food_id)
            .order('is_default', { ascending: false })
            .order('name');

          if (servingError) {
            console.error('Error fetching serving sizes:', servingError);
          }
          
          const servings = servingData && servingData.length > 0 ? servingData : [
            { id: 'default-100', name: '100g', grams: 100, is_default: true, food_id: foodLog.food_id }
          ];
          
          setServingSizes(servings);
        }

      } catch (error) {
        console.error('Error fetching food log:', error);
        toast({
          title: "Error",
          description: "Failed to load food log details",
          variant: "destructive"
        });
        navigate('/full-log');
      } finally {
        setLoading(false);
      }
    };

    fetchFoodLog();
  }, [foodLogId, user, navigate, toast]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updateData: any) => {
      if (!user || !foodLogData) throw new Error('Invalid state');

      const { data, error } = await supabase
        .from('food_logs')
        .update(updateData)
        .eq('id', foodLogData.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const logDate = data.log_date;
      queryClient.invalidateQueries({ 
        queryKey: foodLogsKeys.byDate(user!.id, logDate) 
      });
      toast({
        title: "Success",
        description: "Food log updated successfully",
      });
      navigate('/full-log');
    },
    onError: (error) => {
      console.error('Error updating food log:', error);
      toast({
        title: "Error",
        description: "Failed to update food log",
        variant: "destructive"
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!user || !foodLogData) throw new Error('Invalid state');

      const { error } = await supabase
        .from('food_logs')
        .delete()
        .eq('id', foodLogData.id)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      const logDate = foodLogData!.log_date;
      queryClient.invalidateQueries({ 
        queryKey: foodLogsKeys.byDate(user!.id, logDate) 
      });
      toast({
        title: "Success",
        description: "Food log deleted successfully",
      });
      navigate('/full-log');
    },
    onError: (error) => {
      console.error('Error deleting food log:', error);
      toast({
        title: "Error",
        description: "Failed to delete food log",
        variant: "destructive"
      });
    }
  });

  const handleUpdate = async () => {
    if (!foodLogData) return;

    try {
      if (foodLogData.isQuickAdd) {
        // Update quick add entry
        await updateMutation.mutateAsync({
          meal_id: selectedMeal,
          quick_add_name: quickAddData.name,
          calories: parseFloat(quickAddData.calories),
          carbs: parseFloat(quickAddData.carbs),
          protein: parseFloat(quickAddData.protein),
          fat: parseFloat(quickAddData.fat),
          grams: 100 // Default for quick add
        });
      } else {
        // Update regular food entry
        const selectedServingData = servingSizes.find(s => s.id === selectedServing);
        const totalGrams = selectedServingData ? parseFloat(quantity) * selectedServingData.grams : 0;
        const multiplier = totalGrams / 100;

        if (foodLogData.food) {
          const calculatedNutrition = {
            calories: Math.round(foodLogData.food.calories_per_100g * multiplier),
            carbs: Math.round(foodLogData.food.carbs_per_100g * multiplier),
            protein: Math.round(foodLogData.food.protein_per_100g * multiplier),
            fat: Math.round(foodLogData.food.fat_per_100g * multiplier),
            fiber: foodLogData.food.fiber_per_100g ? Math.round(foodLogData.food.fiber_per_100g * multiplier) : undefined,
            sugar: foodLogData.food.sugar_per_100g ? Math.round(foodLogData.food.sugar_per_100g * multiplier) : undefined,
            sodium: foodLogData.food.sodium_per_100g ? Math.round(foodLogData.food.sodium_per_100g * multiplier) : undefined
          };

          await updateMutation.mutateAsync({
            meal_id: selectedMeal,
            quantity: parseFloat(quantity),
            grams: totalGrams,
            calories: calculatedNutrition.calories,
            carbs: calculatedNutrition.carbs,
            protein: calculatedNutrition.protein,
            fat: calculatedNutrition.fat,
            fiber: calculatedNutrition.fiber,
            sugar: calculatedNutrition.sugar,
            sodium: calculatedNutrition.sodium,
            serving_size_id: selectedServing !== 'default-100' ? selectedServing : null
          });
        }
      }
    } catch (error) {
      console.error('Error in handleUpdate:', error);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMutation.mutateAsync();
    } finally {
      setDeleting(false);
    }
  };

  return {
    loading,
    deleting,
    foodLogData,
    meals,
    servingSizes,
    quantity,
    setQuantity,
    selectedMeal,
    setSelectedMeal,
    selectedServing,
    setSelectedServing,
    quickAddData,
    setQuickAddData,
    handleUpdate,
    handleDelete,
    updating: updateMutation.isPending
  };
};