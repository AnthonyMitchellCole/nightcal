import { useState } from 'react';
import { Utensils, Plus, Edit, Trash2, GripVertical, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useMeals } from '@/hooks/useMeals';
import type { Tables } from '@/integrations/supabase/types';

type Meal = Tables<'meals'>;

interface MealsManagementDialogProps {
  children: React.ReactNode;
}

interface MealFormData {
  name: string;
  time_slot_start: string;
  time_slot_end: string;
}

export const MealsManagementDialog = ({ children }: MealsManagementDialogProps) => {
  const { meals, loading, createMeal, updateMeal, deleteMeal, reorderMeals } = useMeals();
  const [open, setOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<MealFormData>({
    name: '',
    time_slot_start: '',
    time_slot_end: ''
  });

  const formatTime = (time: string | null) => {
    if (!time) return 'Any time';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a meal name.",
        variant: "destructive"
      });
      return;
    }

    // Validate time slots if provided
    if (formData.time_slot_start && formData.time_slot_end) {
      if (formData.time_slot_start >= formData.time_slot_end) {
        toast({
          title: "Invalid time range",
          description: "Start time must be before end time.",
          variant: "destructive"
        });
        return;
      }
    }

    const mealData = {
      name: formData.name,
      time_slot_start: formData.time_slot_start || null,
      time_slot_end: formData.time_slot_end || null
    };

    let result;
    if (editingMeal) {
      result = await updateMeal(editingMeal.id, mealData);
    } else {
      result = await createMeal(mealData);
    }

    if (result.error) {
      toast({
        title: editingMeal ? "Error updating meal" : "Error creating meal",
        description: result.error,
        variant: "destructive"
      });
    } else {
      toast({
        title: editingMeal ? "Meal updated" : "Meal created",
        description: `${formData.name} has been ${editingMeal ? 'updated' : 'created'} successfully.`
      });
      handleCancelForm();
    }
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setFormData({
      name: meal.name,
      time_slot_start: meal.time_slot_start || '',
      time_slot_end: meal.time_slot_end || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (meal: Meal) => {
    const { error } = await deleteMeal(meal.id);
    
    if (error) {
      toast({
        title: "Error deleting meal",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Meal deleted",
        description: `${meal.name} has been deleted.`
      });
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingMeal(null);
    setFormData({ name: '', time_slot_start: '', time_slot_end: '' });
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newMeals = [...meals];
    [newMeals[index - 1], newMeals[index]] = [newMeals[index], newMeals[index - 1]];
    await reorderMeals(newMeals);
  };

  const moveDown = async (index: number) => {
    if (index === meals.length - 1) return;
    const newMeals = [...meals];
    [newMeals[index], newMeals[index + 1]] = [newMeals[index + 1], newMeals[index]];
    await reorderMeals(newMeals);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-glass border-glass backdrop-blur-glass shadow-layered max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-primary" />
            <span>Manage Meals</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!showAddForm ? (
            <>
              {/* Meals List */}
              <div className="space-y-2">
                {meals.map((meal, index) => (
                  <div
                    key={meal.id}
                    className="flex items-center justify-between p-3 bg-bg-light rounded-lg border border-border"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex flex-col space-y-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 p-0"
                          onClick={() => moveUp(index)}
                          disabled={index === 0 || loading}
                        >
                          <GripVertical className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-4 w-4 p-0"
                          onClick={() => moveDown(index)}
                          disabled={index === meals.length - 1 || loading}
                        >
                          <GripVertical className="w-3 h-3" />
                        </Button>
                      </div>
                      <div>
                        <p className="font-medium text-text">{meal.name}</p>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-text-muted" />
                          <span className="text-sm text-text-muted">
                            {meal.time_slot_start && meal.time_slot_end 
                              ? `${formatTime(meal.time_slot_start)} - ${formatTime(meal.time_slot_end)}`
                              : 'Any time'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(meal)}
                        className="w-8 h-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-8 h-8 text-danger hover:text-danger"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-glass border-glass backdrop-blur-glass">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Meal</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{meal.name}"? This will mark it as inactive but preserve historical data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-glass border-border hover:bg-bg-light">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(meal)}
                              className="bg-danger hover:bg-danger/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Button */}
              <Button
                onClick={() => setShowAddForm(true)}
                className="w-full"
                variant="outline"
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Meal
              </Button>
            </>
          ) : (
            /* Add/Edit Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mealName">Meal Name</Label>
                <Input
                  id="mealName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Breakfast, Post-Workout"
                  className="bg-bg-light border-border"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time (Optional)</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.time_slot_start}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_slot_start: e.target.value }))}
                    className="bg-bg-light border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time (Optional)</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.time_slot_end}
                    onChange={(e) => setFormData(prev => ({ ...prev, time_slot_end: e.target.value }))}
                    className="bg-bg-light border-border"
                  />
                </div>
              </div>

              <p className="text-xs text-text-muted">
                Time slots help auto-select the meal when logging food. Leave empty for "Any time" meals like snacks.
              </p>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelForm}
                  className="flex-1 bg-glass border-border hover:bg-bg-light"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Saving...' : editingMeal ? 'Update Meal' : 'Add Meal'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};