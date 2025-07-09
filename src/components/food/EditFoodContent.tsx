import { Alert, AlertDescription } from '@/components/ui/alert';
import { FoodBasicInfoForm } from '@/components/food/FoodBasicInfoForm';
import { FoodNutritionForm } from '@/components/food/FoodNutritionForm';
import { ServingSizesManager } from '@/components/food/ServingSizesManager';
import { FoodActionButtons } from '@/components/food/FoodActionButtons';

interface FormData {
  name: string;
  brand: string;
  barcode: string;
  category: string;
  calories_per_100g: string;
  carbs_per_100g: string;
  protein_per_100g: string;
  fat_per_100g: string;
  sugar_per_100g: string;
  sodium_per_100g: string;
  fiber_per_100g: string;
}

interface NutritionData {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar?: number;
  sodium?: number;
  fiber?: number;
}

interface EditFoodContentProps {
  foodId: string;
  canEdit: boolean;
  formData: FormData;
  defaultServing: any;
  loading: boolean;
  deleting: boolean;
  onInputChange: (field: string, value: string) => void;
  onServingNutritionChange: (nutrition: NutritionData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
  onAddToLog: () => void;
}

export const EditFoodContent = ({
  foodId,
  canEdit,
  formData,
  defaultServing,
  loading,
  deleting,
  onInputChange,
  onServingNutritionChange,
  onSubmit,
  onDelete,
  onAddToLog
}: EditFoodContentProps) => {
  return (
    <div className="p-4">
      {!canEdit && (
        <Alert className="mb-6">
          <AlertDescription>
            This is a public food item and cannot be edited. Only custom foods you've created can be modified.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <FoodBasicInfoForm 
          formData={formData}
          onInputChange={onInputChange}
          canEdit={canEdit}
        />

        <FoodNutritionForm 
          defaultServing={defaultServing}
          onServingNutritionChange={onServingNutritionChange}
          canEdit={canEdit}
        />

        <ServingSizesManager 
          foodId={foodId}
          canEdit={canEdit}
        />

        <FoodActionButtons
          canEdit={canEdit}
          loading={loading}
          deleting={deleting}
          onSave={onSubmit}
          onDelete={onDelete}
          onAddToLog={onAddToLog}
        />
      </form>
    </div>
  );
};