import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ServingSizeNutritionFormProps {
  onSubmit: (data: {
    name: string;
    grams: number;
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
  onCancel: () => void;
  loading?: boolean;
}

export const ServingSizeNutritionForm = ({ onSubmit, onCancel, loading }: ServingSizeNutritionFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    grams: '',
    calories: '',
    carbs: '',
    protein: '',
    fat: '',
    sugar: '',
    sodium: '',
    fiber: '',
    saturated_fat: '',
    trans_fat: '',
    cholesterol: '',
    vitamin_a: '',
    vitamin_c: '',
    calcium: '',
    iron: '',
    potassium: '',
    magnesium: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const autoCalculateCalories = () => {
    const carbs = parseFloat(formData.carbs) || 0;
    const protein = parseFloat(formData.protein) || 0;
    const fat = parseFloat(formData.fat) || 0;
    
    // Standard calorie calculation: carbs * 4 + protein * 4 + fat * 9
    const calculatedCalories = Math.round((carbs * 4) + (protein * 4) + (fat * 9));
    
    setFormData(prev => ({ ...prev, calories: calculatedCalories.toString() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.grams || !formData.calories) {
      return;
    }

    onSubmit({
      name: formData.name,
      grams: parseFloat(formData.grams),
      calories: parseFloat(formData.calories),
      carbs: parseFloat(formData.carbs) || 0,
      protein: parseFloat(formData.protein) || 0,
      fat: parseFloat(formData.fat) || 0,
      sugar: formData.sugar ? parseFloat(formData.sugar) : undefined,
      sodium: formData.sodium ? parseFloat(formData.sodium) : undefined,
      fiber: formData.fiber ? parseFloat(formData.fiber) : undefined,
      saturated_fat: formData.saturated_fat ? parseFloat(formData.saturated_fat) : undefined,
      trans_fat: formData.trans_fat ? parseFloat(formData.trans_fat) : undefined,
      cholesterol: formData.cholesterol ? parseFloat(formData.cholesterol) : undefined,
      vitamin_a: formData.vitamin_a ? parseFloat(formData.vitamin_a) : undefined,
      vitamin_c: formData.vitamin_c ? parseFloat(formData.vitamin_c) : undefined,
      calcium: formData.calcium ? parseFloat(formData.calcium) : undefined,
      iron: formData.iron ? parseFloat(formData.iron) : undefined,
      potassium: formData.potassium ? parseFloat(formData.potassium) : undefined,
      magnesium: formData.magnesium ? parseFloat(formData.magnesium) : undefined,
    });
  };

  return (
    <Card className="bg-glass border-glass">
      <CardHeader>
        <CardTitle>Default Serving Size & Nutrition</CardTitle>
        <p className="text-sm text-text-muted">
          Enter the serving size and nutrition facts as they appear on the food label
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Serving Size Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="serving-name">Serving Name *</Label>
              <Input
                id="serving-name"
                placeholder="e.g., 2 tbsp, 1 cup, 1 slice"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="serving-grams">Weight (grams) *</Label>
              <Input
                id="serving-grams"
                type="number"
                step="0.1"
                placeholder="e.g., 28"
                value={formData.grams}
                onChange={(e) => handleChange('grams', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Main Macros */}
          <div className="space-y-4">
            <h4 className="font-medium">Nutrition per serving</h4>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="serving-calories">Calories *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={autoCalculateCalories}
                  className="text-xs"
                >
                  Auto Calculate
                </Button>
              </div>
              <Input
                id="serving-calories"
                type="number"
                placeholder="e.g., 90"
                value={formData.calories}
                onChange={(e) => handleChange('calories', e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="serving-carbs">Carbs (g)</Label>
                <Input
                  id="serving-carbs"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={formData.carbs}
                  onChange={(e) => handleChange('carbs', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-protein">Protein (g)</Label>
                <Input
                  id="serving-protein"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={formData.protein}
                  onChange={(e) => handleChange('protein', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-fat">Fat (g)</Label>
                <Input
                  id="serving-fat"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={formData.fat}
                  onChange={(e) => handleChange('fat', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Optional Nutrients */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-text-muted">Optional nutrients</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="serving-sugar">Sugar (g)</Label>
                <Input
                  id="serving-sugar"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.sugar}
                  onChange={(e) => handleChange('sugar', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-sodium">Sodium (mg)</Label>
                <Input
                  id="serving-sodium"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.sodium}
                  onChange={(e) => handleChange('sodium', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-fiber">Fiber (g)</Label>
                <Input
                  id="serving-fiber"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.fiber}
                  onChange={(e) => handleChange('fiber', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Additional Nutrients Section */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-text-muted">Additional nutrients (optional)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="serving-saturated-fat">Saturated Fat (g)</Label>
                <Input
                  id="serving-saturated-fat"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.saturated_fat}
                  onChange={(e) => handleChange('saturated_fat', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-trans-fat">Trans Fat (g)</Label>
                <Input
                  id="serving-trans-fat"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.trans_fat}
                  onChange={(e) => handleChange('trans_fat', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-cholesterol">Cholesterol (mg)</Label>
                <Input
                  id="serving-cholesterol"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.cholesterol}
                  onChange={(e) => handleChange('cholesterol', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-vitamin-a">Vitamin A (mcg)</Label>
                <Input
                  id="serving-vitamin-a"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.vitamin_a}
                  onChange={(e) => handleChange('vitamin_a', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-vitamin-c">Vitamin C (mg)</Label>
                <Input
                  id="serving-vitamin-c"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.vitamin_c}
                  onChange={(e) => handleChange('vitamin_c', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-calcium">Calcium (mg)</Label>
                <Input
                  id="serving-calcium"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.calcium}
                  onChange={(e) => handleChange('calcium', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-iron">Iron (mg)</Label>
                <Input
                  id="serving-iron"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.iron}
                  onChange={(e) => handleChange('iron', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-potassium">Potassium (mg)</Label>
                <Input
                  id="serving-potassium"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.potassium}
                  onChange={(e) => handleChange('potassium', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="serving-magnesium">Magnesium (mg)</Label>
                <Input
                  id="serving-magnesium"
                  type="number"
                  step="0.1"
                  placeholder="Optional"
                  value={formData.magnesium}
                  onChange={(e) => handleChange('magnesium', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              Continue
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};