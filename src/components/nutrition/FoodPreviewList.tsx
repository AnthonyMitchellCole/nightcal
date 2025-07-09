import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { QuickAddModal } from './QuickAddModal';

interface FoodItem {
  id: string;
  logId: string;
  name: string;
  calories: number;
  meal: string;
  mealId: string;
  quantity: number;
  servingSizeId?: string;
  isQuickAdd?: boolean;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
}

interface FoodPreviewListProps {
  foods: FoodItem[];
  dailyGoals?: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
}

export const FoodPreviewList = ({ foods, dailyGoals }: FoodPreviewListProps) => {
  const navigate = useNavigate();
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickAddData, setQuickAddData] = useState<any>(null);
  
  // Default goals if not provided
  const goals = dailyGoals || {
    calories: 2100,
    carbs: 250,
    protein: 150,
    fat: 80
  };

  const getMealBadgeColor = (meal: string) => {
    // Neutral styling for all meal badges
    return 'bg-border/30 text-text-muted border-border/50';
  };

  return (
    <div className="space-y-3">
      {foods.map((food) => {
        const calPercentage = Math.round((food.calories / goals.calories) * 100);
        const carbPercentage = Math.round((food.macros.carbs / goals.carbs) * 100);
        const proteinPercentage = Math.round((food.macros.protein / goals.protein) * 100);
        const fatPercentage = Math.round((food.macros.fat / goals.fat) * 100);

        const handleFoodClick = () => {
          if (food.isQuickAdd) {
            // Open Quick Add modal with pre-populated data
            setQuickAddData({
              foodName: food.name,
              mealId: food.mealId,
              calories: food.calories.toString(),
              carbs: food.macros.carbs.toString(),
              protein: food.macros.protein.toString(),
              fat: food.macros.fat.toString()
            });
            setShowQuickAddModal(true);
            return;
          }
          
          const params = new URLSearchParams({
            quantity: food.quantity.toString(),
            mealId: food.mealId,
            ...(food.servingSizeId && { servingSizeId: food.servingSizeId })
          });
          
          navigate(`/log-food/${food.id}?${params.toString()}`);
        };

        return (
          <Card 
            key={food.logId} 
            className="bg-glass border-glass backdrop-blur-glass shadow-soft hover:shadow-layered transition-all duration-300 group cursor-pointer"
            onClick={handleFoodClick}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-text group-hover:text-primary transition-colors">
                      {food.name}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getMealBadgeColor(food.meal)}`}
                    >
                      {food.meal}
                    </Badge>
                    {food.isQuickAdd && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-border/30 text-text-muted border-border/50"
                      >
                        Quick Add
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-info bg-info/15 px-1.5 py-0.5 rounded">
                      C: {food.macros.carbs}g <span className="opacity-75">({carbPercentage}%)</span>
                    </span>
                    <span className="text-xs font-semibold text-success bg-success/15 px-1.5 py-0.5 rounded">
                      P: {food.macros.protein}g <span className="opacity-75">({proteinPercentage}%)</span>
                    </span>
                    <span className="text-xs font-semibold text-warning bg-warning/15 px-1.5 py-0.5 rounded">
                      F: {food.macros.fat}g <span className="opacity-75">({fatPercentage}%)</span>
                    </span>
                  </div>
                </div>
                
                <div className="text-right ml-3">
                  <span className="font-semibold text-primary text-lg">{food.calories} Cal <span className="text-xs opacity-75">({calPercentage}%)</span></span>
                  <div className="w-6 h-6 rounded-full bg-bg-light border border-border flex items-center justify-center group-hover:bg-primary/10 transition-colors mt-2">
                    <div className="w-2 h-2 rounded-full bg-primary opacity-60 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      <QuickAddModal 
        isOpen={showQuickAddModal} 
        onClose={() => {
          setShowQuickAddModal(false);
          setQuickAddData(null);
        }}
        prePopulatedData={quickAddData}
      />
      
      {foods.length === 0 && (
        <Card className="bg-glass border-glass backdrop-blur-glass shadow-soft">
          <CardContent className="p-8 text-center">
            <div className="text-text-muted">
              <p className="text-lg mb-2">No foods logged yet today</p>
              <p className="text-sm">Tap the + button to start tracking your nutrition</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};