import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  };
  onServingNutritionChange: (nutrition: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    sugar?: number;
    sodium?: number;
    fiber?: number;
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
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const updated = { ...servingNutrition, [field]: numValue };
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
              <Label htmlFor="calories">Calories *</Label>
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