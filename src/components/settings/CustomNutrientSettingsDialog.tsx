import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/hooks/useProfile';
import { toast } from '@/hooks/use-toast';

interface CustomNutrientSettingsDialogProps {
  children: React.ReactNode;
}

interface NutrientOption {
  id: string;
  name: string;
  unit: string;
  defaultGoal: number;
}

const AVAILABLE_NUTRIENTS: NutrientOption[] = [
  { id: 'sugar', name: 'Sugar', unit: 'g', defaultGoal: 50 },
  { id: 'fiber', name: 'Fiber', unit: 'g', defaultGoal: 35 },
  { id: 'sodium', name: 'Sodium', unit: 'mg', defaultGoal: 2300 },
  { id: 'saturated_fat', name: 'Saturated Fat', unit: 'g', defaultGoal: 20 },
  { id: 'trans_fat', name: 'Trans Fat', unit: 'g', defaultGoal: 2 },
  { id: 'cholesterol', name: 'Cholesterol', unit: 'mg', defaultGoal: 300 },
  { id: 'vitamin_a', name: 'Vitamin A', unit: 'mcg', defaultGoal: 900 },
  { id: 'vitamin_c', name: 'Vitamin C', unit: 'mg', defaultGoal: 90 },
  { id: 'calcium', name: 'Calcium', unit: 'mg', defaultGoal: 1000 },
  { id: 'iron', name: 'Iron', unit: 'mg', defaultGoal: 18 },
  { id: 'potassium', name: 'Potassium', unit: 'mg', defaultGoal: 3500 },
  { id: 'magnesium', name: 'Magnesium', unit: 'mg', defaultGoal: 400 }
];

export const CustomNutrientSettingsDialog = ({ children }: CustomNutrientSettingsDialogProps) => {
  const { profile, updateProfile } = useProfile();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [nutrient1, setNutrient1] = useState<string>('');
  const [nutrient1Goal, setNutrient1Goal] = useState<string>('');
  const [nutrient2, setNutrient2] = useState<string>('');
  const [nutrient2Goal, setNutrient2Goal] = useState<string>('');

  // Load current settings when dialog opens
  useEffect(() => {
    if (open && profile?.preferences) {
      const customNutrients = (profile.preferences as any)?.custom_nutrients || {};
      
      if (customNutrients.nutrient_1) {
        setNutrient1(customNutrients.nutrient_1.name);
        setNutrient1Goal(customNutrients.nutrient_1.goal.toString());
      }
      
      if (customNutrients.nutrient_2) {
        setNutrient2(customNutrients.nutrient_2.name);
        setNutrient2Goal(customNutrients.nutrient_2.goal.toString());
      }
    }
  }, [open, profile]);

  const handleNutrient1Change = (value: string) => {
    const selectedValue = value === 'none' ? '' : value;
    setNutrient1(selectedValue);
    const nutrient = AVAILABLE_NUTRIENTS.find(n => n.id === selectedValue);
    if (nutrient) {
      setNutrient1Goal(nutrient.defaultGoal.toString());
    } else {
      setNutrient1Goal('');
    }
  };

  const handleNutrient2Change = (value: string) => {
    const selectedValue = value === 'none' ? '' : value;
    setNutrient2(selectedValue);
    const nutrient = AVAILABLE_NUTRIENTS.find(n => n.id === selectedValue);
    if (nutrient) {
      setNutrient2Goal(nutrient.defaultGoal.toString());
    } else {
      setNutrient2Goal('');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    const customNutrients: any = {};
    
    if (nutrient1 && nutrient1Goal) {
      const nutrientData = AVAILABLE_NUTRIENTS.find(n => n.id === nutrient1);
      if (nutrientData) {
        customNutrients.nutrient_1 = {
          name: nutrient1,
          goal: parseFloat(nutrient1Goal),
          unit: nutrientData.unit
        };
      }
    }
    
    if (nutrient2 && nutrient2Goal) {
      const nutrientData = AVAILABLE_NUTRIENTS.find(n => n.id === nutrient2);
      if (nutrientData) {
        customNutrients.nutrient_2 = {
          name: nutrient2,
          goal: parseFloat(nutrient2Goal),
          unit: nutrientData.unit
        };
      }
    }

    const updatedPreferences = {
      ...(profile?.preferences as any || {}),
      custom_nutrients: customNutrients
    };

    const { error } = await updateProfile({
      preferences: updatedPreferences
    });

    if (error) {
      toast({
        title: "Error saving settings",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Custom nutrients updated",
        description: "Your custom nutrient tracking preferences have been saved."
      });
      setOpen(false);
    }
    
    setLoading(false);
  };

  const availableNutrients1 = AVAILABLE_NUTRIENTS.filter(n => n.id !== nutrient2);
  const availableNutrients2 = AVAILABLE_NUTRIENTS.filter(n => n.id !== nutrient1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-glass border-glass backdrop-blur-glass">
        <DialogHeader>
          <DialogTitle>Custom Nutrient Tracking</DialogTitle>
          <p className="text-sm text-text-muted">
            Choose up to 2 additional nutrients to track on your dashboard
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* First Custom Nutrient */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">First Custom Nutrient</Label>
            <Select value={nutrient1 || 'none'} onValueChange={handleNutrient1Change}>
              <SelectTrigger className="bg-bg-light border-border">
                <SelectValue placeholder="Select a nutrient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {availableNutrients1.map((nutrient) => (
                  <SelectItem key={nutrient.id} value={nutrient.id}>
                    {nutrient.name} ({nutrient.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {nutrient1 && (
              <div>
                <Label className="text-xs text-text-muted">Daily Goal</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={nutrient1Goal}
                    onChange={(e) => setNutrient1Goal(e.target.value)}
                    className="bg-bg-light border-border"
                    step="0.1"
                  />
                  <span className="text-sm text-text-muted">
                    {AVAILABLE_NUTRIENTS.find(n => n.id === nutrient1)?.unit}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Second Custom Nutrient */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Second Custom Nutrient</Label>
            <Select value={nutrient2 || 'none'} onValueChange={handleNutrient2Change}>
              <SelectTrigger className="bg-bg-light border-border">
                <SelectValue placeholder="Select a nutrient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {availableNutrients2.map((nutrient) => (
                  <SelectItem key={nutrient.id} value={nutrient.id}>
                    {nutrient.name} ({nutrient.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {nutrient2 && (
              <div>
                <Label className="text-xs text-text-muted">Daily Goal</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={nutrient2Goal}
                    onChange={(e) => setNutrient2Goal(e.target.value)}
                    className="bg-bg-light border-border"
                    step="0.1"
                  />
                  <span className="text-sm text-text-muted">
                    {AVAILABLE_NUTRIENTS.find(n => n.id === nutrient2)?.unit}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              onClick={handleSave} 
              disabled={loading}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="bg-glass border-border hover:bg-bg-light"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};