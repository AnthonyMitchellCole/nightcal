import React, { useState, useEffect } from 'react';
import { Save, Calculator } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  prePopulatedData?: {
    foodName?: string;
    mealId?: string;
    calories?: string;
    carbs?: string;
    protein?: string;
    fat?: string;
  };
}

export const QuickAddModal = ({ isOpen, onClose, prePopulatedData }: QuickAddModalProps) => {
  const [mode, setMode] = useState<'calories' | 'macros'>('macros');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    foodName: prePopulatedData?.foodName || '',
    mealId: prePopulatedData?.mealId || '',
    calories: prePopulatedData?.calories || '',
    carbs: prePopulatedData?.carbs || '',
    protein: prePopulatedData?.protein || '',
    fat: prePopulatedData?.fat || ''
  });

  const [meals, setMeals] = useState<any[]>([]);

  // Fetch user meals when modal opens and auto-select appropriate meal
  useEffect(() => {
    if (isOpen && user) {
      const fetchMeals = async () => {
        const { data } = await supabase
          .from('meals')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('display_order');
        
        if (data) {
          setMeals(data);
          
          // Auto-select meal based on time slot if no pre-populated data
          if (!prePopulatedData?.mealId) {
            const currentHour = new Date().getHours();
            const currentTime = `${String(currentHour).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}:00`;
            
            const appropriateMeal = data.find(meal => {
              if (!meal.time_slot_start || !meal.time_slot_end) return false;
              return currentTime >= meal.time_slot_start && currentTime <= meal.time_slot_end;
            });

            if (appropriateMeal) {
              setFormData(prev => ({ ...prev, mealId: appropriateMeal.id }));
            } else if (data.length > 0) {
              setFormData(prev => ({ ...prev, mealId: data[0].id }));
            }
          }
        }
      };
      fetchMeals();
    }
  }, [isOpen, user, prePopulatedData?.mealId]);

  // Reset form data when prePopulatedData changes
  useEffect(() => {
    if (prePopulatedData) {
      setFormData({
        foodName: prePopulatedData.foodName || '',
        mealId: prePopulatedData.mealId || '',
        calories: prePopulatedData.calories || '',
        carbs: prePopulatedData.carbs || '',
        protein: prePopulatedData.protein || '',
        fat: prePopulatedData.fat || ''
      });
    }
  }, [prePopulatedData]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateCaloriesFromMacros = () => {
    const carbs = Number(formData.carbs) || 0;
    const protein = Number(formData.protein) || 0;
    const fat = Number(formData.fat) || 0;
    
    // 4 cal/g for carbs and protein, 9 cal/g for fat
    const totalCalories = Math.round((carbs * 4) + (protein * 4) + (fat * 9));
    handleChange('calories', totalCalories.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Auto-calculate calories if macros are entered but calories is 0 or empty
      let finalCalories = Number(formData.calories) || 0;
      const carbs = Number(formData.carbs) || 0;
      const protein = Number(formData.protein) || 0;
      const fat = Number(formData.fat) || 0;
      
      // If calories is 0 but at least one macro is entered, auto-calculate
      if (finalCalories === 0 && (carbs > 0 || protein > 0 || fat > 0)) {
        finalCalories = Math.round((carbs * 4) + (protein * 4) + (fat * 9));
      }

      // Create a quick add food log entry directly (no food record needed)
      const now = new Date();
      const localDate = now.toLocaleDateString('en-CA'); // YYYY-MM-DD format
      const localTime = now.toISOString(); // Keep as ISO string for timestamp with timezone
      
      const { error: logError } = await supabase
        .from('food_logs')
        .insert({
          user_id: user.id,
          food_id: null, // No associated food for quick add
          meal_id: formData.mealId,
          quantity: 1,
          grams: 100, // Quick add uses 100g as base unit
          calories: finalCalories,
          carbs: carbs,
          protein: protein,
          fat: fat,
          log_type: 'quick_add',
          quick_add_name: formData.foodName || 'Quick Add',
          log_date: localDate,
          log_time: localTime
        });

      if (logError) throw logError;

      toast({
        title: "Success",
        description: "Food logged successfully",
      });

      // Reset form and close modal
      setFormData({
        foodName: '',
        mealId: '',
        calories: '',
        carbs: '',
        protein: '',
        fat: ''
      });
      onClose();
    } catch (error) {
      console.error('Error quick adding food:', error);
      toast({
        title: "Error",
        description: "Failed to log food. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-bg border-border max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-text text-center text-xl">Quick Add</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex bg-bg-light rounded-lg p-1">
            <Button
              type="button"
              variant={mode === 'macros' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setMode('macros')}
            >
              Full Macros
            </Button>
            <Button
              type="button"
              variant={mode === 'calories' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setMode('calories')}
            >
              Calories Only
            </Button>
          </div>

          {/* Food Name */}
          <div>
            <Label htmlFor="foodName">Food Name (Optional)</Label>
            <Input
              id="foodName"
              value={formData.foodName}
              onChange={(e) => handleChange('foodName', e.target.value)}
              placeholder="e.g., Homemade meal"
            />
          </div>

          {/* Meal Selection */}
          <div>
            <Label>Meal</Label>
            <Select value={formData.mealId} onValueChange={(value) => handleChange('mealId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select meal" />
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

          {mode === 'calories' ? (
            /* Calories Only Mode */
            <div>
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={formData.calories}
                onChange={(e) => handleChange('calories', e.target.value)}
                placeholder="e.g., 250"
                required
              />
            </div>
          ) : (
            /* Full Macros Mode */
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.fat}
                    onChange={(e) => handleChange('fat', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.carbs}
                    onChange={(e) => handleChange('carbs', e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.protein}
                    onChange={(e) => handleChange('protein', e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={calculateCaloriesFromMacros}
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Calories from Macros
              </Button>

              <div>
                <Label htmlFor="calories">Calculated Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={(e) => handleChange('calories', e.target.value)}
                  placeholder="Auto-calculated"
                />
              </div>
            </div>
          )}

          {/* Summary Card */}
          {(formData.calories || formData.carbs || formData.protein || formData.fat) && (
            <Card className="bg-glass border-glass">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Quick Log Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Calories: {formData.calories || 0}</div>
                  <div>Fat: {formData.fat || 0}g</div>
                  <div>Carbs: {formData.carbs || 0}g</div>
                  <div>Protein: {formData.protein || 0}g</div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !formData.mealId || (!formData.calories && mode === 'calories')}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Logging...' : 'Log Food'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};