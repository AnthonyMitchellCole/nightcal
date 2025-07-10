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

  // Parse serving size name to extract number and unit, then multiply by quantity
  const getServingInfo = () => {
    if (isQuickAdd || !servingSizeName) return null;
    
    // Extract number/fraction and unit from serving size name (e.g., "1 cup", "1/2 cup", "6 meatballs")
    const match = servingSizeName.match(/^([\d./]+)\s*(.+)$/);
    if (match) {
      const [, servingNumber, unit] = match;
      // Convert fraction to decimal if needed
      let multiplier = 1;
      if (servingNumber.includes('/')) {
        const [numerator, denominator] = servingNumber.split('/');
        multiplier = parseFloat(numerator) / parseFloat(denominator);
      } else {
        multiplier = parseFloat(servingNumber);
      }
      
      const totalAmount = quantity * multiplier;
      // Format the number nicely (remove unnecessary decimals)
      const formattedAmount = totalAmount % 1 === 0 ? totalAmount.toString() : totalAmount.toFixed(1);
      return `${formattedAmount} ${unit}`;
    }
    
    // Fallback - just show quantity and serving name
    return `${quantity} × ${servingSizeName}`;
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
        <div className="text-xs text-text-muted">
          F: {food.fat}g • C: {food.carbs}g • P: {food.protein}g
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