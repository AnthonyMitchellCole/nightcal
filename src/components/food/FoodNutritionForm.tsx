import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FoodNutritionFormProps {
  formData: {
    calories_per_100g: string;
    carbs_per_100g: string;
    protein_per_100g: string;
    fat_per_100g: string;
    sugar_per_100g: string;
    sodium_per_100g: string;
    fiber_per_100g: string;
  };
  onInputChange: (field: string, value: string) => void;
  canEdit: boolean;
}

export const FoodNutritionForm = ({ formData, onInputChange, canEdit }: FoodNutritionFormProps) => {
  return (
    <Card className="bg-glass border-glass">
      <CardHeader>
        <CardTitle>Nutritional Information (per 100g)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="calories">Calories *</Label>
            <Input
              id="calories"
              type="number"
              value={formData.calories_per_100g}
              onChange={(e) => onInputChange('calories_per_100g', e.target.value)}
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
              value={formData.carbs_per_100g}
              onChange={(e) => onInputChange('carbs_per_100g', e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div>
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              step="0.1"
              value={formData.protein_per_100g}
              onChange={(e) => onInputChange('protein_per_100g', e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div>
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              type="number"
              step="0.1"
              value={formData.fat_per_100g}
              onChange={(e) => onInputChange('fat_per_100g', e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div>
            <Label htmlFor="sugar">Sugar (g)</Label>
            <Input
              id="sugar"
              type="number"
              step="0.1"
              value={formData.sugar_per_100g}
              onChange={(e) => onInputChange('sugar_per_100g', e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div>
            <Label htmlFor="sodium">Sodium (mg)</Label>
            <Input
              id="sodium"
              type="number"
              step="0.1"
              value={formData.sodium_per_100g}
              onChange={(e) => onInputChange('sodium_per_100g', e.target.value)}
              disabled={!canEdit}
            />
          </div>

          <div>
            <Label htmlFor="fiber">Fiber (g)</Label>
            <Input
              id="fiber"
              type="number"
              step="0.1"
              value={formData.fiber_per_100g}
              onChange={(e) => onInputChange('fiber_per_100g', e.target.value)}
              disabled={!canEdit}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};