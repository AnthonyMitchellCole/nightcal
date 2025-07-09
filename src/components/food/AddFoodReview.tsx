import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatePer100g } from '@/lib/nutritionCalculations';

interface BasicData {
  name: string;
  brand: string;
  barcode: string;
  category: string;
}

interface ServingData {
  name: string;
  grams: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar?: number;
  sodium?: number;
  fiber?: number;
}

interface AddFoodReviewProps {
  basicData: BasicData;
  servingData: ServingData;
  loading: boolean;
  onBack: () => void;
  onSubmit: () => void;
}

export const AddFoodReview = ({ 
  basicData, 
  servingData, 
  loading, 
  onBack, 
  onSubmit 
}: AddFoodReviewProps) => {
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
              <div><span className="text-text-muted">Fat:</span> {servingData.fat}g</div>
              <div><span className="text-text-muted">Carbs:</span> {servingData.carbs}g</div>
              <div><span className="text-text-muted">Protein:</span> {servingData.protein}g</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Calculated per 100g</h4>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div><span className="text-text-muted">Calories:</span> {per100gValues.calories_per_100g}</div>
              <div><span className="text-text-muted">Fat:</span> {per100gValues.fat_per_100g}g</div>
              <div><span className="text-text-muted">Carbs:</span> {per100gValues.carbs_per_100g}g</div>
              <div><span className="text-text-muted">Protein:</span> {per100gValues.protein_per_100g}g</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex space-x-3">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex-1"
        >
          Back to Edit
        </Button>
        <Button 
          onClick={onSubmit}
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