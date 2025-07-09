import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { LoadingEmblem } from '@/components/ui/loading-emblem';
import { useAuth } from '@/contexts/AuthContext';
import { useLogFood, useDailySummary } from '@/hooks/useFoodLogs';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

const LogFood = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { logFood, loading: logLoading } = useLogFood();
  const { summary, loading: summaryLoading } = useDailySummary();
  const { profile, loading: profileLoading } = useProfile();
  const { toast } = useToast();

  // Get URL parameters for pre-population
  const presetQuantity = searchParams.get('quantity');
  const presetMealId = searchParams.get('mealId');
  const presetServingSizeId = searchParams.get('servingSizeId');
  const isFromBarcode = searchParams.get('source') === 'barcode';

  const [quantity, setQuantity] = useState(presetQuantity || '1');
  const [selectedMeal, setSelectedMeal] = useState(presetMealId || '');
  const [selectedServing, setSelectedServing] = useState(presetServingSizeId || '');
  
  const [food, setFood] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [servingSizes, setServingSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!foodId || !user) return;

      try {
        // Fetch food details
        const { data: foodData, error: foodError } = await supabase
          .from('foods')
          .select('*')
          .eq('id', foodId)
          .single();

        if (foodError) throw foodError;
        setFood(foodData);

        // Fetch user's meals
        const { data: mealsData, error: mealsError } = await supabase
          .from('meals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('display_order');

        if (mealsError) throw mealsError;
        setMeals(mealsData || []);

        // Auto-select meal based on current time
        const currentHour = new Date().getHours();
        const currentTime = `${String(currentHour).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}:00`;
        
        const appropriateMeal = mealsData?.find(meal => {
          if (!meal.time_slot_start || !meal.time_slot_end) return false;
          return currentTime >= meal.time_slot_start && currentTime <= meal.time_slot_end;
        });

        // Auto-select meal based on preset or current time
        if (presetMealId && mealsData?.find(m => m.id === presetMealId)) {
          setSelectedMeal(presetMealId);
        } else {
          const appropriateMeal = mealsData?.find(meal => {
            if (!meal.time_slot_start || !meal.time_slot_end) return false;
            return currentTime >= meal.time_slot_start && currentTime <= meal.time_slot_end;
          });

          if (appropriateMeal) {
            setSelectedMeal(appropriateMeal.id);
          } else if (mealsData && mealsData.length > 0) {
            setSelectedMeal(mealsData[0].id);
          }
        }

        // Fetch serving sizes
        const { data: servingData, error: servingError } = await supabase
          .from('serving_sizes')
          .select('*')
          .eq('food_id', foodId)
          .order('is_default', { ascending: false })
          .order('name');

        if (servingError) {
          console.error('Error fetching serving sizes:', servingError);
          toast({
            title: "Warning",
            description: "Could not load serving sizes. Using default 100g.",
            variant: "destructive"
          });
        }
        
        const servings = servingData && servingData.length > 0 ? servingData : [
          { id: 'default-100', name: '100g', grams: 100, is_default: true, food_id: foodId, created_at: new Date().toISOString() }
        ];
        
        setServingSizes(servings);
        
        // Set serving size based on preset or default
        if (presetServingSizeId && servings.find(s => s.id === presetServingSizeId)) {
          setSelectedServing(presetServingSizeId);
        } else {
          setSelectedServing(servings[0]?.id || 'default-100');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load food details",
          variant: "destructive"
        });
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [foodId, user, navigate, toast, presetMealId, presetServingSizeId]);

  // Get goals from profile or use defaults
  const dailyGoals = {
    calories: profile?.calorie_goal || 2100,
    carbs: profile?.carb_goal_grams || 250,
    protein: profile?.protein_goal_grams || 150,
    fat: profile?.fat_goal_grams || 80
  };

  // Calculate remaining amounts (goals - current intake)
  const remaining = {
    calories: Math.max(0, dailyGoals.calories - summary.calories),
    carbs: Math.max(0, dailyGoals.carbs - summary.carbs),
    protein: Math.max(0, dailyGoals.protein - summary.protein),
    fat: Math.max(0, dailyGoals.fat - summary.fat)
  };

  if (loading || !food || summaryLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <div className="sticky-header bg-gradient-glass border-b border-glass backdrop-blur-glass shadow-deep p-4 flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Loading...</h1>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <LoadingEmblem />
            <span>Loading food details...</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate nutrition based on quantity and serving
  const selectedServingData = servingSizes.find(s => s.id === selectedServing);
  const totalGrams = selectedServingData ? parseFloat(quantity) * selectedServingData.grams : 0;
  const multiplier = totalGrams / 100;

  const calculatedNutrition = {
    calories: Math.round(food.calories_per_100g * multiplier),
    carbs: Math.round(food.carbs_per_100g * multiplier),
    protein: Math.round(food.protein_per_100g * multiplier),
    fat: Math.round(food.fat_per_100g * multiplier),
    fiber: food.fiber_per_100g ? Math.round(food.fiber_per_100g * multiplier) : undefined,
    sugar: food.sugar_per_100g ? Math.round(food.sugar_per_100g * multiplier) : undefined,
    sodium: food.sodium_per_100g ? Math.round(food.sodium_per_100g * multiplier) : undefined
  };

  const handleSave = async () => {
    if (!selectedMeal) {
      toast({
        title: "Validation Error",
        description: "Please select a meal",
        variant: "destructive"
      });
      return;
    }

    try {
      await logFood({
        food_id: food.id,
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
        serving_size_id: selectedServing !== 'default-100' ? selectedServing : undefined
      });

      toast({
        title: "Success",
        description: "Food logged successfully",
      });

      navigate('/');
    } catch (error) {
      console.error('Error logging food:', error);
      toast({
        title: "Error",
        description: "Failed to log food. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky-header bg-gradient-glass border-b border-glass backdrop-blur-glass shadow-deep p-4 flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{food.name}</h1>
            {isFromBarcode && (
              <span className="bg-success/20 text-success text-xs px-2 py-1 rounded-full border border-success/30">
                Scanned
              </span>
            )}
          </div>
          <p className="text-sm text-text-muted">{food.brand}</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quantity Input */}
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            step="0.1"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Serving Size Selection */}
        <div className="space-y-2">
          <Label>Serving Size</Label>
          <Select value={selectedServing} onValueChange={setSelectedServing}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {servingSizes.map((serving) => (
                <SelectItem key={serving.id} value={serving.id}>
                  {serving.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Meal Selection */}
        <div className="space-y-2">
          <Label>Meal</Label>
          <Select value={selectedMeal} onValueChange={setSelectedMeal}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meals.map((meal) => (
                <SelectItem key={meal.id} value={meal.id}>
                  {meal.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nutrition Summary */}
        <Card className="glass-elevated shadow-deep backdrop-blur-glass">
          <CardHeader>
            <CardTitle>Nutrition Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-sm text-text-muted/70">
                  {Math.round(summary.calories)} + 
                </div>
                <div className="text-xl font-semibold text-primary">
                  {calculatedNutrition.calories}
                </div>
                <div className="text-lg text-text">
                  = {Math.round(summary.calories + calculatedNutrition.calories)} / {dailyGoals.calories} Cal 
                  <span className="font-bold text-text"> ({Math.max(0, dailyGoals.calories - Math.round(summary.calories + calculatedNutrition.calories))} Left)</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-text">
                  {Math.round((calculatedNutrition.calories / dailyGoals.calories) * 100)}% of goal
                </div>
                <div className="text-sm font-medium text-text-muted">
                  {remaining.calories > 0 ? Math.round((calculatedNutrition.calories / remaining.calories) * 100) : '100+'}% of remaining
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span>Fat</span>
                  <div className="text-right">
                    <span className="text-text-muted/70">{Math.round(summary.fat)}g + </span>
                    <span className="font-semibold text-warning">{calculatedNutrition.fat}g</span>
                    <span className="text-text"> = {Math.round(summary.fat + calculatedNutrition.fat)}g</span>
                    <span className="text-text-muted"> / {dailyGoals.fat}g </span><span className="font-bold">({Math.max(0, dailyGoals.fat - Math.round(summary.fat + calculatedNutrition.fat))}g Left)</span>
                  </div>
                </div>
                <div className="relative h-3 bg-border-muted rounded-full overflow-hidden">
                  {/* Already logged amount */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-text-muted/30 rounded-l-full"
                    style={{ width: `${Math.min((summary.fat / dailyGoals.fat) * 100, 100)}%` }}
                  />
                  {/* Current food amount stacked on top */}
                  <div 
                    className="absolute top-0 h-full bg-warning rounded-r-full"
                    style={{ 
                      left: `${Math.min((summary.fat / dailyGoals.fat) * 100, 100)}%`,
                      width: `${Math.min((calculatedNutrition.fat / dailyGoals.fat) * 100, 100 - Math.min((summary.fat / dailyGoals.fat) * 100, 100))}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>{Math.round((calculatedNutrition.fat / dailyGoals.fat) * 100)}% of goal</span>
                  <span>{remaining.fat > 0 ? Math.round((calculatedNutrition.fat / remaining.fat) * 100) : '100+'}% of remaining</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span>Carbs</span>
                  <div className="text-right">
                    <span className="text-text-muted/70">{Math.round(summary.carbs)}g + </span>
                    <span className="font-semibold text-info">{calculatedNutrition.carbs}g</span>
                    <span className="text-text"> = {Math.round(summary.carbs + calculatedNutrition.carbs)}g</span>
                    <span className="text-text-muted"> / {dailyGoals.carbs}g </span><span className="font-bold">({Math.max(0, dailyGoals.carbs - Math.round(summary.carbs + calculatedNutrition.carbs))}g Left)</span>
                  </div>
                </div>
                <div className="relative h-3 bg-border-muted rounded-full overflow-hidden">
                  {/* Already logged amount */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-text-muted/30 rounded-l-full"
                    style={{ width: `${Math.min((summary.carbs / dailyGoals.carbs) * 100, 100)}%` }}
                  />
                  {/* Current food amount stacked on top */}
                  <div 
                    className="absolute top-0 h-full bg-info rounded-r-full"
                    style={{ 
                      left: `${Math.min((summary.carbs / dailyGoals.carbs) * 100, 100)}%`,
                      width: `${Math.min((calculatedNutrition.carbs / dailyGoals.carbs) * 100, 100 - Math.min((summary.carbs / dailyGoals.carbs) * 100, 100))}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>{Math.round((calculatedNutrition.carbs / dailyGoals.carbs) * 100)}% of goal</span>
                  <span>{remaining.carbs > 0 ? Math.round((calculatedNutrition.carbs / remaining.carbs) * 100) : '100+'}% of remaining</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span>Protein</span>
                  <div className="text-right">
                    <span className="text-text-muted/70">{Math.round(summary.protein)}g + </span>
                    <span className="font-semibold text-success">{calculatedNutrition.protein}g</span>
                    <span className="text-text"> = {Math.round(summary.protein + calculatedNutrition.protein)}g</span>
                    <span className="text-text-muted"> / {dailyGoals.protein}g </span><span className="font-bold">({Math.max(0, dailyGoals.protein - Math.round(summary.protein + calculatedNutrition.protein))}g Left)</span>
                  </div>
                </div>
                <div className="relative h-3 bg-border-muted rounded-full overflow-hidden">
                  {/* Already logged amount */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-text-muted/30 rounded-l-full"
                    style={{ width: `${Math.min((summary.protein / dailyGoals.protein) * 100, 100)}%` }}
                  />
                  {/* Current food amount stacked on top */}
                  <div 
                    className="absolute top-0 h-full bg-success rounded-r-full"
                    style={{ 
                      left: `${Math.min((summary.protein / dailyGoals.protein) * 100, 100)}%`,
                      width: `${Math.min((calculatedNutrition.protein / dailyGoals.protein) * 100, 100 - Math.min((summary.protein / dailyGoals.protein) * 100, 100))}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>{Math.round((calculatedNutrition.protein / dailyGoals.protein) * 100)}% of goal</span>
                  <span>{remaining.protein > 0 ? Math.round((calculatedNutrition.protein / remaining.protein) * 100) : '100+'}% of remaining</span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-text-muted pt-2 border-t border-border">
              Weight: {totalGrams.toFixed(0)}g
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          className="w-full" 
          disabled={logLoading || !selectedMeal}
        >
          {logLoading ? 'Adding to Log...' : 'Add to Log'}
        </Button>
      </div>
    </div>
  );
};

export default LogFood;