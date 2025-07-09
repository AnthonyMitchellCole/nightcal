import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateFood } from '@/hooks/useFoods';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculatePer100g } from '@/lib/nutritionCalculations';

interface BasicData {
  name: string;
  brand: string;
  barcode: string;
  category: string;
}

interface ServingData {
  name: string;
  grams: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar?: number;
  sodium?: number;
  fiber?: number;
}

export const useAddFood = (initialBasicData: BasicData) => {
  const navigate = useNavigate();
  const { createFood, loading } = useCreateFood();
  const { toast } = useToast();

  const [step, setStep] = useState<'basic' | 'serving' | 'review'>('basic');
  const [basicData, setBasicData] = useState<BasicData>(initialBasicData);
  const [servingData, setServingData] = useState<ServingData | null>(null);

  const handleBasicChange = (field: string, value: string) => {
    setBasicData(prev => ({ ...prev, [field]: value }));
  };

  const handleServingSubmit = (data: ServingData) => {
    setServingData(data);
    setStep('review');
  };

  const handleFinalSubmit = async () => {
    if (!basicData.name || !servingData) {
      toast({
        title: "Validation Error",
        description: "Please complete all steps",
        variant: "destructive"
      });
      return;
    }

    try {
      // Calculate 100g nutrition values
      const per100gNutrition = calculatePer100g(servingData, servingData.grams);

      const foodData = {
        name: basicData.name,
        brand: basicData.brand || undefined,
        barcode: basicData.barcode || undefined,
        category: basicData.category || undefined,
        ...per100gNutrition
      };

      const newFood = await createFood(foodData);
      
      // Create the default serving size with nutrition
      const { error: servingError } = await supabase
        .from('serving_sizes')
        .insert({
          food_id: newFood.id,
          name: servingData.name,
          grams: servingData.grams,
          is_default: true,
          calories_per_serving: servingData.calories,
          carbs_per_serving: servingData.carbs,
          protein_per_serving: servingData.protein,
          fat_per_serving: servingData.fat,
          sugar_per_serving: servingData.sugar,
          sodium_per_serving: servingData.sodium,
          fiber_per_serving: servingData.fiber
        });

      if (servingError) {
        console.warn('Error creating serving size:', servingError);
      }
      
      toast({
        title: "Success",
        description: "Food added successfully",
      });

      navigate(`/log-food/${newFood.id}`);
    } catch (error) {
      console.error('Error creating food:', error);
      toast({
        title: "Error",
        description: "Failed to add food. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    step,
    setStep,
    basicData,
    servingData,
    loading,
    handleBasicChange,
    handleServingSubmit,
    handleFinalSubmit
  };
};