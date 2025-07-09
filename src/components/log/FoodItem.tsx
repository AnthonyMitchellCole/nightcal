import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { QuickAddModal } from '../nutrition/QuickAddModal';

interface FoodItemProps {
  food: {
    id: string;
    name: string;
    brand?: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  foodLogId: string;
  quantity: number;
  servingSizeId?: string;
  servingSizeName?: string;
  mealId: string;
  isQuickAdd?: boolean;
  dailyGoals: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
}

export const FoodItem = ({ food, foodLogId, quantity, servingSizeId, servingSizeName, mealId, isQuickAdd, dailyGoals }: FoodItemProps) => {
  const navigate = useNavigate();
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddData, setQuickAddData] = useState<any>(null);
  
  const foodCalPercentage = Math.round((food.calories / dailyGoals.calories) * 100);
  const foodCarbPercentage = Math.round((food.carbs / dailyGoals.carbs) * 100);
  const foodProteinPercentage = Math.round((food.protein / dailyGoals.protein) * 100);
  const foodFatPercentage = Math.round((food.fat / dailyGoals.fat) * 100);

  // Extract unit from serving size name (format: "1 unit")
  const getServingInfo = () => {
    if (isQuickAdd || !servingSizeName) return null;
    
    // Extract unit from "1 unit" format
    const unit = servingSizeName.replace(/^1\s*/, ''); // Remove "1 " from the beginning
    return `${quantity} ${unit}`;
  };

  const servingInfo = getServingInfo();

  const handleClick = () => {
    if (isQuickAdd) {
      // Open Quick Add modal with pre-populated data
      setQuickAddData({
        foodName: food.name,
        mealId: mealId,
        calories: food.calories.toString(),
        carbs: food.carbs.toString(),
        protein: food.protein.toString(),
        fat: food.fat.toString()
      });
      setShowQuickAddModal(true);
      return;
    }

    const params = new URLSearchParams({
      quantity: quantity.toString(),
      mealId: mealId,
      ...(servingSizeId && { servingSizeId })
    });
    
    navigate(`/log-food/${food.id}?${params.toString()}`);
  };

  return (
    <>
      <div 
        className="glass-elevated shadow-deep backdrop-blur-glass p-3 rounded-lg hover:shadow-glow transition-all duration-300 cursor-pointer" 
        onClick={handleClick}
      >
        <div className="flex justify-between items-start w-full">
        <div className="flex-1">
        <h4 className="font-medium text-text mb-1">{food.name}</h4>
        {(food.brand || servingInfo) && (
          <p className="text-sm text-text-muted mb-2">
            {food.brand}
            {food.brand && servingInfo && ' • '}
            {servingInfo}
          </p>
        )}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-warning bg-warning/15 px-1.5 py-0.5 rounded">
            F: {food.fat}g <span className="opacity-75">({foodFatPercentage}%)</span>
          </span>
          <span className="text-xs font-semibold text-info bg-info/15 px-1.5 py-0.5 rounded">
            C: {food.carbs}g <span className="opacity-75">({foodCarbPercentage}%)</span>
          </span>
          <span className="text-xs font-semibold text-success bg-success/15 px-1.5 py-0.5 rounded">
            P: {food.protein}g <span className="opacity-75">({foodProteinPercentage}%)</span>
          </span>
        </div>
      </div>
      <div className="text-right ml-3">
        <span className="font-semibold text-text text-lg">
          {food.calories} Cal <span className="text-xs opacity-75">({foodCalPercentage}%)</span>
        </span>
        </div>
        </div>
      </div>

      <QuickAddModal 
        isOpen={showQuickAddModal} 
        onClose={() => {
          setShowQuickAddModal(false);
          setQuickAddData(null);
        }}
        prePopulatedData={quickAddData}
      />
    </>
  );
};