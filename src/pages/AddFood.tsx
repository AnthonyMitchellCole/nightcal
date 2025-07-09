import { useState } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateFood } from '@/hooks/useFoods';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AddFood = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createFood, loading } = useCreateFood();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: searchParams.get('name') || '',
    brand: '',
    calories_per_100g: '',
    carbs_per_100g: '',
    protein_per_100g: '',
    fat_per_100g: '',
    sugar_per_100g: '',
    sodium_per_100g: '',
    fiber_per_100g: '',
    barcode: searchParams.get('barcode') || '',
    category: ''
  });

  const [servingSizes, setServingSizes] = useState([
    { name: '100g', grams: 100, is_default: true }
  ]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addServingSize = () => {
    setServingSizes(prev => [...prev, { name: '', grams: 0, is_default: false }]);
  };

  const removeServingSize = (index: number) => {
    if (servingSizes.length > 1) {
      setServingSizes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateServingSize = (index: number, field: string, value: string | number | boolean) => {
    setServingSizes(prev => prev.map((serving, i) => 
      i === index ? { ...serving, [field]: value } : serving
    ));
  };

  const setDefaultServing = (index: number) => {
    setServingSizes(prev => prev.map((serving, i) => 
      ({ ...serving, is_default: i === index })
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.calories_per_100g) {
      toast({
        title: "Validation Error",
        description: "Name and calories are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const foodData = {
        name: formData.name,
        brand: formData.brand || undefined,
        calories_per_100g: Number(formData.calories_per_100g),
        carbs_per_100g: Number(formData.carbs_per_100g) || 0,
        protein_per_100g: Number(formData.protein_per_100g) || 0,
        fat_per_100g: Number(formData.fat_per_100g) || 0,
        sugar_per_100g: formData.sugar_per_100g ? Number(formData.sugar_per_100g) : undefined,
        sodium_per_100g: formData.sodium_per_100g ? Number(formData.sodium_per_100g) : undefined,
        fiber_per_100g: formData.fiber_per_100g ? Number(formData.fiber_per_100g) : undefined,
        barcode: formData.barcode || undefined,
        category: formData.category || undefined
      };

      const newFood = await createFood(foodData);
      
      // Create serving sizes for the new food
      const validServingSizes = servingSizes.filter(s => s.name.trim() && s.grams > 0);
      if (validServingSizes.length > 0) {
        const { error: servingError } = await supabase
          .from('serving_sizes')
          .insert(
            validServingSizes.map(serving => ({
              food_id: newFood.id,
              name: serving.name,
              grams: serving.grams,
              is_default: serving.is_default
            }))
          );

        if (servingError) {
          console.warn('Error creating serving sizes:', servingError);
          // Don't fail the whole operation if serving sizes fail
        }
      }
      
      toast({
        title: "Success",
        description: "Food added successfully",
      });

      navigate(`/log-food/${newFood.id}`);
    } catch (error) {
      console.error('Error creating food:', error);
      toast({
        title: "Error",
        description: "Failed to add food. Please try again.",
        variant: "destructive"
      });
    }
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
        <h1 className="text-lg font-semibold">Add New Food</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Basic Information */}
        <Card className="bg-glass border-glass">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Food Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Greek Yogurt"
                required
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="e.g., Fage"
              />
            </div>
            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => handleChange('barcode', e.target.value)}
                placeholder="Product barcode"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g., Dairy, Protein"
              />
            </div>
          </CardContent>
        </Card>

        {/* Macronutrients */}
        <Card className="bg-glass border-glass">
          <CardHeader>
            <CardTitle className="text-lg">Nutrition (per 100g)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="calories">Calories *</Label>
              <Input
                id="calories"
                type="number"
                step="0.1"
                min="0"
                value={formData.calories_per_100g}
                onChange={(e) => handleChange('calories_per_100g', e.target.value)}
                placeholder="e.g., 150"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.carbs_per_100g}
                  onChange={(e) => handleChange('carbs_per_100g', e.target.value)}
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
                  value={formData.protein_per_100g}
                  onChange={(e) => handleChange('protein_per_100g', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.fat_per_100g}
                  onChange={(e) => handleChange('fat_per_100g', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Nutrients */}
        <Card className="bg-glass border-glass">
          <CardHeader>
            <CardTitle className="text-lg">Additional Nutrients (per 100g)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sugar">Sugar (g)</Label>
                <Input
                  id="sugar"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.sugar_per_100g}
                  onChange={(e) => handleChange('sugar_per_100g', e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div>
                <Label htmlFor="fiber">Fiber (g)</Label>
                <Input
                  id="fiber"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.fiber_per_100g}
                  onChange={(e) => handleChange('fiber_per_100g', e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sodium">Sodium (mg)</Label>
              <Input
                id="sodium"
                type="number"
                step="0.1"
                min="0"
                value={formData.sodium_per_100g}
                onChange={(e) => handleChange('sodium_per_100g', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </CardContent>
        </Card>

        {/* Serving Sizes */}
        <Card className="bg-glass border-glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Serving Sizes</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addServingSize}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Serving
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {servingSizes.map((serving, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                <div className="flex-1">
                  <Label>Serving Name</Label>
                  <Input
                    value={serving.name}
                    onChange={(e) => updateServingSize(index, 'name', e.target.value)}
                    placeholder="e.g., 1 cup, 1 slice"
                  />
                </div>
                <div className="w-24">
                  <Label>Grams</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    value={serving.grams}
                    onChange={(e) => updateServingSize(index, 'grams', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant={serving.is_default ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDefaultServing(index)}
                  >
                    Default
                  </Button>
                  {servingSizes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeServingSize(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Adding Food...' : 'Add Food'}
        </Button>
      </form>
    </div>
  );
};

export default AddFood;