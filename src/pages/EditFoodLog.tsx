import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingEmblem } from '@/components/ui/loading-emblem';
import { useEditFoodLog } from '@/hooks/useEditFoodLog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const EditFoodLog = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
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
    updating
  } = useEditFoodLog(id);

  if (loading) {
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
            <span>Loading food log...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!foodLogData) {
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
          <h1 className="text-lg font-semibold">Food Log Not Found</h1>
        </div>
      </div>
    );
  }

  // Calculate nutrition for preview (non-quick add only)
  const getCalculatedNutrition = () => {
    if (foodLogData.isQuickAdd || !foodLogData.food) {
      return {
        calories: parseFloat(quickAddData.calories) || 0,
        carbs: parseFloat(quickAddData.carbs) || 0,
        protein: parseFloat(quickAddData.protein) || 0,
        fat: parseFloat(quickAddData.fat) || 0
      };
    }

    const selectedServingData = servingSizes.find(s => s.id === selectedServing);
    const totalGrams = selectedServingData ? parseFloat(quantity) * selectedServingData.grams : 0;
    const multiplier = totalGrams / 100;

    return {
      calories: Math.round(foodLogData.food.calories_per_100g * multiplier),
      carbs: Math.round(foodLogData.food.carbs_per_100g * multiplier),
      protein: Math.round(foodLogData.food.protein_per_100g * multiplier),
      fat: Math.round(foodLogData.food.fat_per_100g * multiplier)
    };
  };

  const calculatedNutrition = getCalculatedNutrition();

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
          <h1 className="text-lg font-semibold">
            {foodLogData.isQuickAdd ? 'Edit Quick Add' : `Edit ${foodLogData.food?.name}`}
          </h1>
          {!foodLogData.isQuickAdd && foodLogData.food?.brand && (
            <p className="text-sm text-text-muted">{foodLogData.food.brand}</p>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" disabled={deleting}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Food Log</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this food log entry? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="p-4 space-y-6">
        {foodLogData.isQuickAdd ? (
          // Quick Add Form
          <>
            <div className="space-y-2">
              <Label htmlFor="quickAddName">Food Name</Label>
              <Input
                id="quickAddName"
                value={quickAddData.name}
                onChange={(e) => setQuickAddData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quickAddCalories">Calories</Label>
                <Input
                  id="quickAddCalories"
                  type="number"
                  step="0.1"
                  min="0"
                  value={quickAddData.calories}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, calories: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickAddCarbs">Carbs (g)</Label>
                <Input
                  id="quickAddCarbs"
                  type="number"
                  step="0.1"
                  min="0"
                  value={quickAddData.carbs}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, carbs: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickAddProtein">Protein (g)</Label>
                <Input
                  id="quickAddProtein"
                  type="number"
                  step="0.1"
                  min="0"
                  value={quickAddData.protein}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, protein: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickAddFat">Fat (g)</Label>
                <Input
                  id="quickAddFat"
                  type="number"
                  step="0.1"
                  min="0"
                  value={quickAddData.fat}
                  onChange={(e) => setQuickAddData(prev => ({ ...prev, fat: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>
          </>
        ) : (
          // Regular Food Form
          <>
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

            {servingSizes.length > 0 && (
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
            )}
          </>
        )}

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

        {/* Nutrition Preview */}
        <Card className="glass-elevated shadow-deep backdrop-blur-glass">
          <CardHeader>
            <CardTitle>Nutrition Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {calculatedNutrition.calories}
                </div>
                <div className="text-sm text-text-muted">Calories</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Fat:</span> {calculatedNutrition.fat}g
                </div>
                <div className="text-sm">
                  <span className="font-medium">Carbs:</span> {calculatedNutrition.carbs}g
                </div>
                <div className="text-sm">
                  <span className="font-medium">Protein:</span> {calculatedNutrition.protein}g
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={handleUpdate} 
            disabled={updating || !selectedMeal}
            className="flex-1"
          >
            {updating ? 'Updating...' : 'Update Entry'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditFoodLog;