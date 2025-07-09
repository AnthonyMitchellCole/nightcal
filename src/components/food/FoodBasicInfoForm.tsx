import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FoodBasicInfoFormProps {
  formData: {
    name: string;
    brand: string;
    barcode: string;
    category: string;
  };
  onInputChange: (field: string, value: string) => void;
  canEdit: boolean;
}

export const FoodBasicInfoForm = ({ formData, onInputChange, canEdit }: FoodBasicInfoFormProps) => {
  return (
    <Card className="bg-glass border-glass">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Food Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            required
            disabled={!canEdit}
          />
        </div>

        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => onInputChange('brand', e.target.value)}
            disabled={!canEdit}
          />
        </div>

        <div>
          <Label htmlFor="barcode">Barcode</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => onInputChange('barcode', e.target.value)}
            disabled={!canEdit}
          />
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => onInputChange('category', e.target.value)}
            disabled={!canEdit}
          />
        </div>
      </CardContent>
    </Card>
  );
};