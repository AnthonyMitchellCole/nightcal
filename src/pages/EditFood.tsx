import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingEmblem } from '@/components/ui/loading-emblem';
import { FoodBasicInfoForm } from '@/components/food/FoodBasicInfoForm';
import { FoodNutritionForm } from '@/components/food/FoodNutritionForm';
import { calculatePer100g } from '@/lib/nutritionCalculations';
import { ServingSizesManager } from '@/components/food/ServingSizesManager';
import { FoodActionButtons } from '@/components/food/FoodActionButtons';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const EditFood = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [defaultServing, setDefaultServing] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    barcode: '',
    category: '',
    calories_per_100g: '',
    carbs_per_100g: '',
    protein_per_100g: '',
    fat_per_100g: '',
    sugar_per_100g: '',
    sodium_per_100g: '',
    fiber_per_100g: '',
  });

  useEffect(() => {
    if (id) {
      fetchFood();
    }
  }, [id]);

  const fetchFood = async () => {
    try {
      // Fetch food and default serving size in parallel
      const [{ data: food, error: foodError }, { data: servings, error: servingError }] = await Promise.all([
        supabase.from('foods').select('*').eq('id', id).single(),
        supabase.from('serving_sizes').select('*').eq('food_id', id).eq('is_default', true).single()
      ]);

      if (foodError) throw foodError;

      if (food) {
        setFormData({
          name: food.name || '',
          brand: food.brand || '',
          barcode: food.barcode || '',
          category: food.category || '',
          calories_per_100g: food.calories_per_100g?.toString() || '',
          carbs_per_100g: food.carbs_per_100g?.toString() || '',
          protein_per_100g: food.protein_per_100g?.toString() || '',
          fat_per_100g: food.fat_per_100g?.toString() || '',
          sugar_per_100g: food.sugar_per_100g?.toString() || '',
          sodium_per_100g: food.sodium_per_100g?.toString() || '',
          fiber_per_100g: food.fiber_per_100g?.toString() || '',
        });

        // Set default serving if found
        if (servings && !servingError) {
          setDefaultServing(servings);
        }

        // Check if user can edit this food (custom food created by them)
        setCanEdit(food.is_custom && food.created_by === user?.id);
      }
    } catch (error) {
      console.error('Error fetching food:', error);
      toast({
        title: "Error",
        description: "Failed to load food details",
        variant: "destructive"
      });
      navigate('/all-foods');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServingNutritionChange = async (nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    sugar?: number;
    sodium?: number;
    fiber?: number;
  }) => {
    if (!defaultServing || !canEdit) return;

    try {
      // Update serving nutrition
      const { error: servingError } = await supabase
        .from('serving_sizes')
        .update({
          calories_per_serving: nutrition.calories,
          carbs_per_serving: nutrition.carbs,
          protein_per_serving: nutrition.protein,
          fat_per_serving: nutrition.fat,
          sugar_per_serving: nutrition.sugar,
          sodium_per_serving: nutrition.sodium,
          fiber_per_serving: nutrition.fiber,
        })
        .eq('id', defaultServing.id);

      if (servingError) throw servingError;

      // Calculate and update 100g values
      const per100gValues = calculatePer100g(nutrition, defaultServing.grams);
      
      const { error: foodError } = await supabase
        .from('foods')
        .update(per100gValues)
        .eq('id', id);

      if (foodError) throw foodError;

      // Update local state
      setDefaultServing(prev => ({ ...prev, ...nutrition }));
      setFormData(prev => ({
        ...prev,
        calories_per_100g: per100gValues.calories_per_100g.toString(),
        carbs_per_100g: per100gValues.carbs_per_100g.toString(),
        protein_per_100g: per100gValues.protein_per_100g.toString(),
        fat_per_100g: per100gValues.fat_per_100g.toString(),
        sugar_per_100g: per100gValues.sugar_per_100g?.toString() || '',
        sodium_per_100g: per100gValues.sodium_per_100g?.toString() || '',
        fiber_per_100g: per100gValues.fiber_per_100g?.toString() || '',
      }));

      toast({
        title: "Success",
        description: "Nutrition updated successfully",
      });
    } catch (error) {
      console.error('Error updating nutrition:', error);
      toast({
        title: "Error",
        description: "Failed to update nutrition",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('foods')
        .update({
          name: formData.name,
          brand: formData.brand || null,
          barcode: formData.barcode || null,
          category: formData.category || null,
          calories_per_100g: parseInt(formData.calories_per_100g) || 0,
          carbs_per_100g: parseFloat(formData.carbs_per_100g) || 0,
          protein_per_100g: parseFloat(formData.protein_per_100g) || 0,
          fat_per_100g: parseFloat(formData.fat_per_100g) || 0,
          sugar_per_100g: formData.sugar_per_100g ? parseFloat(formData.sugar_per_100g) : null,
          sodium_per_100g: formData.sodium_per_100g ? parseFloat(formData.sodium_per_100g) : null,
          fiber_per_100g: formData.fiber_per_100g ? parseFloat(formData.fiber_per_100g) : null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Food updated successfully",
      });

      navigate('/all-foods');
    } catch (error) {
      console.error('Error updating food:', error);
      toast({
        title: "Error",
        description: "Failed to update food",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canEdit) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Food deleted successfully",
      });

      navigate('/all-foods');
    } catch (error) {
      console.error('Error deleting food:', error);
      toast({
        title: "Error",
        description: "Failed to delete food",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <LoadingEmblem size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky top-0 bg-glass border-b border-glass backdrop-blur-glass p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/all-foods')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {canEdit ? 'Edit Food' : 'Food Details'}
          </h1>
        </div>
      </div>

      <div className="p-4">
        {!canEdit && (
          <Alert className="mb-6">
            <AlertDescription>
              This is a public food item and cannot be edited. Only custom foods you've created can be modified.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FoodBasicInfoForm 
            formData={formData}
            onInputChange={handleInputChange}
            canEdit={canEdit}
          />

          <FoodNutritionForm 
            defaultServing={defaultServing}
            onServingNutritionChange={handleServingNutritionChange}
            canEdit={canEdit}
          />

          {id && (
            <ServingSizesManager 
              foodId={id}
              canEdit={canEdit}
            />
          )}

          <FoodActionButtons
            canEdit={canEdit}
            loading={loading}
            deleting={deleting}
            onSave={handleSubmit}
            onDelete={handleDelete}
            onAddToLog={() => navigate(`/log-food/${id}`)}
          />
        </form>
      </div>
    </div>
  );
};

export default EditFood;