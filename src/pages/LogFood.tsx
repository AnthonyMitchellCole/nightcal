import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const LogFood = () => {
  const { foodId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState('1');
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  // Mock food data - replace with actual Supabase query
  const food = {
    id: foodId,
    name: "Greek Yogurt",
    brand: "Fage",
    caloriesPer100g: 97,
    carbsPer100g: 4,
    proteinPer100g: 10,
    fatPer100g: 5
  };

  // Mock serving sizes
  const servingSizes = [
    { id: '1', name: '1 cup (245g)', grams: 245 },
    { id: '2', name: '1/2 cup (123g)', grams: 123 },
    { id: '3', name: '100g', grams: 100 }
  ];

  const [selectedServing, setSelectedServing] = useState(servingSizes[0].id);

  // Calculate nutrition based on quantity and serving
  const selectedServingData = servingSizes.find(s => s.id === selectedServing);
  const totalGrams = selectedServingData ? parseFloat(quantity) * selectedServingData.grams : 0;
  const multiplier = totalGrams / 100;

  const calculatedNutrition = {
    calories: Math.round(food.caloriesPer100g * multiplier),
    carbs: Math.round(food.carbsPer100g * multiplier),
    protein: Math.round(food.proteinPer100g * multiplier),
    fat: Math.round(food.fatPer100g * multiplier)
  };

  // Mock meal options
  const meals = [
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'snacks', name: 'Snacks' }
  ];

  const handleSave = () => {
    // TODO: Save to Supabase
    console.log('Saving food log:', {
      foodId,
      quantity: parseFloat(quantity),
      servingId: selectedServing,
      meal: selectedMeal,
      nutrition: calculatedNutrition
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky top-0 bg-glass border-b border-glass backdrop-blur-glass p-4 flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{food.name}</h1>
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
        <Card className="bg-glass border-glass">
          <CardHeader>
            <CardTitle className="text-lg">Nutrition Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {calculatedNutrition.calories}
                </div>
                <div className="text-sm text-text-muted">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-text">
                  {totalGrams.toFixed(0)}g
                </div>
                <div className="text-sm text-text-muted">Weight</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Carbs</span>
                  <span>{calculatedNutrition.carbs}g</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein</span>
                  <span>{calculatedNutrition.protein}g</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fat</span>
                  <span>{calculatedNutrition.fat}g</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full">
          Add to Log
        </Button>
      </div>
    </div>
  );
};

export default LogFood;