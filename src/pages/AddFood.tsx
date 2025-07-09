import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServingSizeNutritionForm } from '@/components/food/ServingSizeNutritionForm';
import { useCreateFood } from '@/hooks/useFoods';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculatePer100g } from '@/lib/nutritionCalculations';

const AddFood = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createFood, loading } = useCreateFood();
  const { toast } = useToast();

  const [step, setStep] = useState<'basic' | 'serving' | 'review'>('basic');
  const [basicData, setBasicData] = useState({
    name: searchParams.get('name') || '',
    brand: '',
    barcode: searchParams.get('barcode') || '',
    category: ''
  });

  const [servingData, setServingData] = useState<{
    name: string;
    grams: number;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    sugar?: number;
    sodium?: number;
    fiber?: number;
  } | null>(null);

  const handleBasicChange = (field: string, value: string) => {
    setBasicData(prev => ({ ...prev, [field]: value }));
  };

  const handleServingSubmit = (data: {
    name: string;
    grams: number;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    sugar?: number;
    sodium?: number;
    fiber?: number;
  }) => {
    setServingData(data);
    setStep('review');
  };

  const handleFinalSubmit = async () => {
    if (!basicData.name || !servingData) {
      toast({
        title: "Validation Error",
        description: "Please complete all steps",
        variant: "destructive"
      });
      return;
    }

    try {
      // Calculate 100g nutrition values
      const per100gNutrition = calculatePer100g(servingData, servingData.grams);

      const foodData = {
        name: basicData.name,
        brand: basicData.brand || undefined,
        barcode: basicData.barcode || undefined,
        category: basicData.category || undefined,
        ...per100gNutrition
      };

      const newFood = await createFood(foodData);
      
      // Create the default serving size with nutrition
      const { error: servingError } = await supabase
        .from('serving_sizes')
        .insert({
          food_id: newFood.id,
          name: servingData.name,
          grams: servingData.grams,
          is_default: true,
          calories_per_serving: servingData.calories,
          carbs_per_serving: servingData.carbs,
          protein_per_serving: servingData.protein,
          fat_per_serving: servingData.fat,
          sugar_per_serving: servingData.sugar,
          sodium_per_serving: servingData.sodium,
          fiber_per_serving: servingData.fiber
        });

      if (servingError) {
        console.warn('Error creating serving size:', servingError);
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

  const renderBasicInfo = () => (
    <Card className="bg-glass border-glass">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Food Name *</Label>
          <Input
            id="name"
            value={basicData.name}
            onChange={(e) => handleBasicChange('name', e.target.value)}
            placeholder="e.g., Greek Yogurt"
            required
          />
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={basicData.brand}
            onChange={(e) => handleBasicChange('brand', e.target.value)}
            placeholder="e.g., Fage"
          />
        </div>
        <div>
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={basicData.barcode}
            onChange={(e) => handleBasicChange('barcode', e.target.value)}
            placeholder="Product barcode"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={basicData.category}
            onChange={(e) => handleBasicChange('category', e.target.value)}
            placeholder="e.g., Dairy, Protein"
          />
        </div>
        <Button 
          onClick={() => setStep('serving')}
          className="w-full mt-6"
          disabled={!basicData.name}
        >
          Continue to Nutrition
        </Button>
      </CardContent>
    </Card>
  );

  const renderReview = () => {
    if (!servingData) return null;
    
    const per100gValues = calculatePer100g(servingData, servingData.grams);
    
    return (
      <div className="space-y-6">
        <Card className="bg-glass border-glass">
          <CardHeader>
            <CardTitle>Review Food Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Basic Info</h4>
              <div className="space-y-1 text-sm">
                <div><span className="text-text-muted">Name:</span> {basicData.name}</div>
                {basicData.brand && <div><span className="text-text-muted">Brand:</span> {basicData.brand}</div>}
                {basicData.category && <div><span className="text-text-muted">Category:</span> {basicData.category}</div>}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Default Serving: {servingData.name} ({servingData.grams}g)</h4>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div><span className="text-text-muted">Calories:</span> {servingData.calories}</div>
                <div><span className="text-text-muted">Carbs:</span> {servingData.carbs}g</div>
                <div><span className="text-text-muted">Protein:</span> {servingData.protein}g</div>
                <div><span className="text-text-muted">Fat:</span> {servingData.fat}g</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Calculated per 100g</h4>
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div><span className="text-text-muted">Calories:</span> {per100gValues.calories_per_100g}</div>
                <div><span className="text-text-muted">Carbs:</span> {per100gValues.carbs_per_100g}g</div>
                <div><span className="text-text-muted">Protein:</span> {per100gValues.protein_per_100g}g</div>
                <div><span className="text-text-muted">Fat:</span> {per100gValues.fat_per_100g}g</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => setStep('serving')}
            className="flex-1"
          >
            Back to Edit
          </Button>
          <Button 
            onClick={handleFinalSubmit}
            disabled={loading}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Adding Food...' : 'Add Food'}
          </Button>
        </div>
      </div>
    );
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

      <div className="p-4">
        {step === 'basic' && renderBasicInfo()}
        {step === 'serving' && (
          <ServingSizeNutritionForm
            onSubmit={handleServingSubmit}
            onCancel={() => setStep('basic')}
            loading={loading}
          />
        )}
        {step === 'review' && renderReview()}
      </div>
    </div>
  );
};

export default AddFood;