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
    brand: '',
    barcode: searchParams.get('barcode') || '',
    category: ''
  };

  const {
    step,
    setStep,
    basicData,
    servingData,
    loading,
    handleBasicChange,
    handleServingSubmit,
    handleFinalSubmit
  } = useAddFood(initialBasicData);

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