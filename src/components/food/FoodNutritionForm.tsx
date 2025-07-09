import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatePer100g } from '@/lib/nutritionCalculations';

interface FoodNutritionFormProps {
  defaultServing?: {
    name: string;
    grams: number;
    calories_per_serving?: number;
    carbs_per_serving?: number;
    protein_per_serving?: number;
    fat_per_serving?: number;
    sugar_per_serving?: number;
    sodium_per_serving?: number;
    fiber_per_serving?: number;
    saturated_fat_per_serving?: number;
    trans_fat_per_serving?: number;
    cholesterol_per_serving?: number;
    vitamin_a_per_serving?: number;
    vitamin_c_per_serving?: number;
    calcium_per_serving?: number;
    iron_per_serving?: number;
    potassium_per_serving?: number;
    magnesium_per_serving?: number;
  };
  onServingNutritionChange: (nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    sugar?: number;
    sodium?: number;
    fiber?: number;
    saturated_fat?: number;
    trans_fat?: number;
    cholesterol?: number;
    vitamin_a?: number;
    vitamin_c?: number;
    calcium?: number;
    iron?: number;
    potassium?: number;
    magnesium?: number;
  }) => void;
  canEdit: boolean;
}

export const FoodNutritionForm = ({ defaultServing, onServingNutritionChange, canEdit }: FoodNutritionFormProps) => {
  const servingNutrition = {
    calories: defaultServing?.calories_per_serving || 0,
    carbs: defaultServing?.carbs_per_serving || 0,
    protein: defaultServing?.protein_per_serving || 0,
    fat: defaultServing?.fat_per_serving || 0,
    sugar: defaultServing?.sugar_per_serving || 0,
    sodium: defaultServing?.sodium_per_serving || 0,
    fiber: defaultServing?.fiber_per_serving || 0,
    saturated_fat: defaultServing?.saturated_fat_per_serving || 0,
    trans_fat: defaultServing?.trans_fat_per_serving || 0,
    cholesterol: defaultServing?.cholesterol_per_serving || 0,
    vitamin_a: defaultServing?.vitamin_a_per_serving || 0,
    vitamin_c: defaultServing?.vitamin_c_per_serving || 0,
    calcium: defaultServing?.calcium_per_serving || 0,
    iron: defaultServing?.iron_per_serving || 0,
    potassium: defaultServing?.potassium_per_serving || 0,
    magnesium: defaultServing?.magnesium_per_serving || 0,
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updated = { ...servingNutrition, [field]: numValue };
    onServingNutritionChange(updated);
  };

  const autoCalculateCalories = () => {
    const carbs = servingNutrition.carbs || 0;
    const protein = servingNutrition.protein || 0;
    const fat = servingNutrition.fat || 0;
    
    // Standard calorie calculation: carbs * 4 + protein * 4 + fat * 9
    const calculatedCalories = Math.round((carbs * 4) + (protein * 4) + (fat * 9));
    
    const updated = { ...servingNutrition, calories: calculatedCalories };
    onServingNutritionChange(updated);
  };

  // Calculate 100g values for display
  const per100gValues = defaultServing?.grams 
    ? calculatePer100g(servingNutrition, defaultServing.grams)
    : null;

  if (!defaultServing) {
    return (
      <Card className="bg-glass border-glass">
        <CardHeader>
          <CardTitle>Nutritional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-text-muted">Set up a default serving size first to enter nutrition information.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-glass border-glass">
      <CardHeader>
        <CardTitle>Nutritional Information</CardTitle>
        <p className="text-sm text-text-muted">
          Enter nutrition facts per {defaultServing.name} ({defaultServing.grams}g)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Per-serving input */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Per {defaultServing.name}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="calories">Calories *</Label>
                {canEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={autoCalculateCalories}
                    className="text-xs"
                  >
                    Auto Calculate
                  </Button>
                )}
              </div>
              <Input
                id="calories"
                type="number"
                value={servingNutrition.calories}
                onChange={(e) => handleInputChange('calories', e.target.value)}
                required
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="carbs">Carbohydrates (g)</Label>
              <Input
                id="carbs"
                type="number"
                step="0.1"
                value={servingNutrition.carbs}
                onChange={(e) => handleInputChange('carbs', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                step="0.1"
                value={servingNutrition.protein}
                onChange={(e) => handleInputChange('protein', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                step="0.1"
                value={servingNutrition.fat}
                onChange={(e) => handleInputChange('fat', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="sugar">Sugar (g)</Label>
              <Input
                id="sugar"
                type="number"
                step="0.1"
                value={servingNutrition.sugar}
                onChange={(e) => handleInputChange('sugar', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="sodium">Sodium (mg)</Label>
              <Input
                id="sodium"
                type="number"
                step="0.1"
                value={servingNutrition.sodium}
                onChange={(e) => handleInputChange('sodium', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="fiber">Fiber (g)</Label>
              <Input
                id="fiber"
                type="number"
                step="0.1"
                value={servingNutrition.fiber}
                onChange={(e) => handleInputChange('fiber', e.target.value)}
                disabled={!canEdit}
              />
            </div>
          </div>

          {/* Additional Nutrients Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="saturated_fat">Saturated Fat (g)</Label>
              <Input
                id="saturated_fat"
                type="number"
                step="0.1"
                value={servingNutrition.saturated_fat}
                onChange={(e) => handleInputChange('saturated_fat', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="trans_fat">Trans Fat (g)</Label>
              <Input
                id="trans_fat"
                type="number"
                step="0.1"
                value={servingNutrition.trans_fat}
                onChange={(e) => handleInputChange('trans_fat', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="cholesterol">Cholesterol (mg)</Label>
              <Input
                id="cholesterol"
                type="number"
                step="0.1"
                value={servingNutrition.cholesterol}
                onChange={(e) => handleInputChange('cholesterol', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="vitamin_a">Vitamin A (mcg)</Label>
              <Input
                id="vitamin_a"
                type="number"
                step="0.1"
                value={servingNutrition.vitamin_a}
                onChange={(e) => handleInputChange('vitamin_a', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="vitamin_c">Vitamin C (mg)</Label>
              <Input
                id="vitamin_c"
                type="number"
                step="0.1"
                value={servingNutrition.vitamin_c}
                onChange={(e) => handleInputChange('vitamin_c', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="calcium">Calcium (mg)</Label>
              <Input
                id="calcium"
                type="number"
                step="0.1"
                value={servingNutrition.calcium}
                onChange={(e) => handleInputChange('calcium', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="iron">Iron (mg)</Label>
              <Input
                id="iron"
                type="number"
                step="0.1"
                value={servingNutrition.iron}
                onChange={(e) => handleInputChange('iron', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="potassium">Potassium (mg)</Label>
              <Input
                id="potassium"
                type="number"
                step="0.1"
                value={servingNutrition.potassium}
                onChange={(e) => handleInputChange('potassium', e.target.value)}
                disabled={!canEdit}
              />
            </div>

            <div>
              <Label htmlFor="magnesium">Magnesium (mg)</Label>
              <Input
                id="magnesium"
                type="number"
                step="0.1"
                value={servingNutrition.magnesium}
                onChange={(e) => handleInputChange('magnesium', e.target.value)}
                disabled={!canEdit}
              />
            </div>
          </div>
        </div>

        {/* Per-100g display (read-only) */}
        {per100gValues && (
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-sm text-text-muted">Calculated per 100g</h4>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-text-muted">Calories:</span>
                <div className="font-medium">{per100gValues.calories_per_100g}</div>
              </div>
              <div>
                <span className="text-text-muted">Carbs:</span>
                <div className="font-medium">{per100gValues.carbs_per_100g}g</div>
              </div>
              <div>
                <span className="text-text-muted">Protein:</span>
                <div className="font-medium">{per100gValues.protein_per_100g}g</div>
              </div>
              <div>
                <span className="text-text-muted">Fat:</span>
                <div className="font-medium">{per100gValues.fat_per_100g}g</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};