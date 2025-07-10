import { useState, useEffect } from 'react';
import { Target, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';

interface GoalSettingsDialogProps {
  children: React.ReactNode;
}

export const GoalSettingsDialog = ({ children }: GoalSettingsDialogProps) => {
  const { profile, updateProfile, loading } = useProfile();
  const [open, setOpen] = useState(false);
  const [goalType, setGoalType] = useState<'grams' | 'percentage'>('grams');
  
  // Grams mode state
  const [calories, setCalories] = useState('2000');
  const [carbGrams, setCarbGrams] = useState('250');
  const [proteinGrams, setProteinGrams] = useState('150');
  const [fatGrams, setFatGrams] = useState('80');

  // Percentage mode state
  const [carbPercent, setCarbPercent] = useState(50);
  const [proteinPercent, setProteinPercent] = useState(25);
  const [fatPercent, setFatPercent] = useState(25);

  // Auto-fill form with current profile values when dialog opens
  useEffect(() => {
    if (open && profile) {
      setGoalType(profile.goal_type as 'grams' | 'percentage' || 'grams');
      setCalories(profile.calorie_goal?.toString() || '2000');
      setCarbGrams(profile.carb_goal_grams?.toString() || '250');
      setProteinGrams(profile.protein_goal_grams?.toString() || '150');
      setFatGrams(profile.fat_goal_grams?.toString() || '80');
      setCarbPercent(profile.carb_goal_percentage || 50);
      setProteinPercent(profile.protein_goal_percentage || 25);
      setFatPercent(profile.fat_goal_percentage || 25);
    }
  }, [open, profile]);

  const totalPercent = carbPercent + proteinPercent + fatPercent;
  const isValidPercentage = Math.abs(totalPercent - 100) < 0.1;

  const calculateGramsFromPercentage = (percent: number, calories: number, caloriesPerGram: number) => {
    return Math.round((percent / 100) * calories / caloriesPerGram);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (goalType === 'percentage' && !isValidPercentage) {
      toast({
        title: "Invalid percentages",
        description: "Macro percentages must total 100%",
        variant: "destructive"
      });
      return;
    }

    const calorieGoal = parseInt(calories);
    
    let updates: any = {
      goal_type: goalType,
      calorie_goal: calorieGoal
    };

    if (goalType === 'grams') {
      updates = {
        ...updates,
        carb_goal_grams: parseInt(carbGrams),
        protein_goal_grams: parseInt(proteinGrams),
        fat_goal_grams: parseInt(fatGrams),
        carb_goal_percentage: null,
        protein_goal_percentage: null,
        fat_goal_percentage: null
      };
    } else {
      updates = {
        ...updates,
        carb_goal_percentage: carbPercent,
        protein_goal_percentage: proteinPercent,
        fat_goal_percentage: fatPercent,
        carb_goal_grams: calculateGramsFromPercentage(carbPercent, calorieGoal, 4),
        protein_goal_grams: calculateGramsFromPercentage(proteinPercent, calorieGoal, 4),
        fat_goal_grams: calculateGramsFromPercentage(fatPercent, calorieGoal, 9)
      };
    }

    const { error } = await updateProfile(updates);

    if (error) {
      toast({
        title: "Error updating goals",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Goals updated",
        description: "Your nutrition goals have been updated successfully."
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-glass border-glass backdrop-blur-glass shadow-layered max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Nutrition Goals</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Goal Type Toggle */}
          <div className="space-y-3">
            <Label>Goal Type</Label>
            <div className="flex items-center justify-between p-3 bg-bg-light rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <Calculator className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-text">
                    {goalType === 'grams' ? 'Grams' : 'Percentage'}
                  </p>
                  <p className="text-sm text-text-muted">
                    {goalType === 'grams' ? 'Set exact gram targets' : 'Set percentage of calories'}
                  </p>
                </div>
              </div>
              <Switch
                checked={goalType === 'percentage'}
                onCheckedChange={(checked) => setGoalType(checked ? 'percentage' : 'grams')}
              />
            </div>
          </div>

          {/* Calorie Goal */}
          <div className="space-y-2">
            <Label htmlFor="calories">Daily Calorie Goal</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="bg-bg-light border-border"
              min="1000"
              max="5000"
            />
          </div>

          <Separator />

          {goalType === 'grams' ? (
            // Grams Mode
            <div className="space-y-4">
              <h4 className="font-medium text-text">Macro Targets (grams)</h4>
              
              <div className="space-y-2">
                <Label htmlFor="fat">Fat</Label>
                <Input
                  id="fat"
                  type="number"
                  value={fatGrams}
                  onChange={(e) => setFatGrams(e.target.value)}
                  className="bg-bg-light border-border"
                  min="0"
                  max="300"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbohydrates</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={carbGrams}
                  onChange={(e) => setCarbGrams(e.target.value)}
                  className="bg-bg-light border-border"
                  min="0"
                  max="1000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="protein">Protein</Label>
                <Input
                  id="protein"
                  type="number"
                  value={proteinGrams}
                  onChange={(e) => setProteinGrams(e.target.value)}
                  className="bg-bg-light border-border"
                  min="0"
                  max="500"
                />
              </div>
            </div>
          ) : (
            // Percentage Mode
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-text">Macro Percentages</h4>
                <div className={`text-sm font-medium ${isValidPercentage ? 'text-success' : 'text-warning'}`}>
                  {totalPercent.toFixed(1)}%
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Fat</Label>
                    <span className="text-sm text-text-muted">
                      {fatPercent}% = {calculateGramsFromPercentage(fatPercent, parseInt(calories), 9)}g
                    </span>
                  </div>
                  <Slider
                    value={[fatPercent]}
                    onValueChange={(value) => setFatPercent(value[0])}
                    max={100}
                    step={2.5}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Carbohydrates</Label>
                    <span className="text-sm text-text-muted">
                      {carbPercent}% = {calculateGramsFromPercentage(carbPercent, parseInt(calories), 4)}g
                    </span>
                  </div>
                  <Slider
                    value={[carbPercent]}
                    onValueChange={(value) => setCarbPercent(value[0])}
                    max={100}
                    step={2.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Protein</Label>
                    <span className="text-sm text-text-muted">
                      {proteinPercent}% = {calculateGramsFromPercentage(proteinPercent, parseInt(calories), 4)}g
                    </span>
                  </div>
                  <Slider
                    value={[proteinPercent]}
                    onValueChange={(value) => setProteinPercent(value[0])}
                    max={100}
                    step={2.5}
                    className="w-full"
                  />
                </div>
              </div>

              {!isValidPercentage && (
                <p className="text-sm text-warning">
                  Percentages must total 100%
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 bg-glass border-border hover:bg-bg-light"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (goalType === 'percentage' && !isValidPercentage)}
              className="flex-1"
            >
              {loading ? 'Saving...' : 'Save Goals'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};