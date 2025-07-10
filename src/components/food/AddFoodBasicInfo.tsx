import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BasicData {
  name: string;
  brand: string;
  barcode: string;
  category: string;
}

interface AddFoodBasicInfoProps {
  basicData: BasicData;
  onDataChange: (field: string, value: string) => void;
  onNext: () => void;
}

export const AddFoodBasicInfo = ({ basicData, onDataChange, onNext }: AddFoodBasicInfoProps) => {
  const foodNameInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus food name input on mount
  useEffect(() => {
    if (foodNameInputRef.current) {
      foodNameInputRef.current.focus();
    }
  }, []);

  return (
    <Card className="bg-glass border-glass">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Food Name *</Label>
          <Input
            ref={foodNameInputRef}
            id="name"
            value={basicData.name}
            onChange={(e) => onDataChange('name', e.target.value)}
            placeholder="e.g., Greek Yogurt"
            required
          />
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={basicData.brand}
            onChange={(e) => onDataChange('brand', e.target.value)}
            placeholder="e.g., Fage"
          />
        </div>
        <div>
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={basicData.barcode}
            onChange={(e) => onDataChange('barcode', e.target.value)}
            placeholder="Product barcode"
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={basicData.category}
            onChange={(e) => onDataChange('category', e.target.value)}
            placeholder="e.g., Dairy, Protein"
          />
        </div>
        <Button 
          onClick={onNext}
          className="w-full mt-6"
          disabled={!basicData.name}
        >
          Continue to Nutrition
        </Button>
      </CardContent>
    </Card>
  );
};