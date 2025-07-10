import { ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AddFoodBasicInfo } from '@/components/food/AddFoodBasicInfo';
import { AddFoodReview } from '@/components/food/AddFoodReview';
import { ServingSizeNutritionForm } from '@/components/food/ServingSizeNutritionForm';
import { useAddFood } from '@/hooks/useAddFood';

const AddFood = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialBasicData = {
    name: searchParams.get('name') || '',
    brand: searchParams.get('brand') || '',
    barcode: searchParams.get('barcode') || '',
    category: searchParams.get('category') || '',
  };

  // Check for pre-filled serving data from URL params (e.g., from USDA search)
  const initialServingData = searchParams.get('source') === 'usda' ? {
    name: searchParams.get('servingName') || '100g',
    grams: Number(searchParams.get('servingGrams')) || 100,
    calories: Number(searchParams.get('calories')) || 0,
    carbs: Number(searchParams.get('carbs')) || 0,
    protein: Number(searchParams.get('protein')) || 0,
    fat: Number(searchParams.get('fat')) || 0,
    sugar: searchParams.get('sugar') ? Number(searchParams.get('sugar')) : undefined,
    sodium: searchParams.get('sodium') ? Number(searchParams.get('sodium')) : undefined,
    fiber: searchParams.get('fiber') ? Number(searchParams.get('fiber')) : undefined,
  } : undefined;

  const {
    step,
    setStep,
    basicData,
    servingData,
    loading,
    handleBasicChange,
    handleServingSubmit,
    handleFinalSubmit
  } = useAddFood(initialBasicData, initialServingData);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky-header bg-gradient-glass border-b border-glass backdrop-blur-glass shadow-deep p-4 flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Add New Food</h1>
          {initialBasicData.barcode && (
            <span className="bg-info/20 text-info text-xs px-2 py-1 rounded-full border border-info/30">
              Barcode Scanned
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {step === 'basic' && (
          <AddFoodBasicInfo
            basicData={basicData}
            onDataChange={handleBasicChange}
            onNext={() => setStep('serving')}
          />
        )}
        {step === 'serving' && (
          <ServingSizeNutritionForm
            onSubmit={handleServingSubmit}
            onCancel={() => setStep('basic')}
            loading={loading}
            initialData={initialServingData}
          />
        )}
        {step === 'review' && servingData && (
          <AddFoodReview
            basicData={basicData}
            servingData={servingData}
            loading={loading}
            onBack={() => setStep('serving')}
            onSubmit={handleFinalSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default AddFood;