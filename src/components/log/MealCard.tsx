import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FoodItem } from './FoodItem';

interface Meal {
  id: string;
  name: string;
  totals: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
  foods: Array<{
    id: string;
    logId: string;
    name: string;
    brand?: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    quantity: number;
    servingSizeId?: string;
  }>;
}

interface DailyGoals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface MealCardProps {
  meal: Meal;
  dailyGoals: DailyGoals;
}

export const MealCard = ({ meal, dailyGoals }: MealCardProps) => {
  const mealCalPercentage = Math.round((meal.totals.calories / dailyGoals.calories) * 100);
  const mealCarbPercentage = Math.round((meal.totals.carbs / dailyGoals.carbs) * 100);
  const mealProteinPercentage = Math.round((meal.totals.protein / dailyGoals.protein) * 100);
  const mealFatPercentage = Math.round((meal.totals.fat / dailyGoals.fat) * 100);

  return (
    <Card className="glass-elevated shadow-deep backdrop-blur-glass">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          {/* Meal Name Section */}
          <div className="flex-shrink-0">
            <span className="text-lg font-semibold text-primary">{meal.name}</span>
          </div>
          
          {/* Macros Section */}
          <div className="flex flex-col items-center gap-1 flex-1 mx-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="font-bold text-info bg-info/20 px-2 py-1 rounded">
                C: {meal.totals.carbs}g <span className="text-xs opacity-75">({mealCarbPercentage}%)</span>
              </span>
              <span className="font-bold text-success bg-success/20 px-2 py-1 rounded">
                P: {meal.totals.protein}g <span className="text-xs opacity-75">({mealProteinPercentage}%)</span>
              </span>
              <span className="font-bold text-warning bg-warning/20 px-2 py-1 rounded">
                F: {meal.totals.fat}g <span className="text-xs opacity-75">({mealFatPercentage}%)</span>
              </span>
            </div>
          </div>
          
          {/* Calories Section */}
          <div className="text-right flex-shrink-0">
            <span className="text-xl font-bold text-primary">
              {meal.totals.calories} Cal <span className="text-sm opacity-75">({mealCalPercentage}%)</span>
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {meal.foods.length === 0 ? (
          <p className="text-text-muted text-center py-4">
            No foods logged yet
          </p>
        ) : (
          <div className="space-y-3">
            {meal.foods.map((food) => (
              <FoodItem 
                key={food.logId} 
                food={{
                  id: food.id,
                  name: food.name,
                  brand: food.brand,
                  calories: food.calories,
                  carbs: food.carbs,
                  protein: food.protein,
                  fat: food.fat
                }}
                foodLogId={food.logId}
                quantity={food.quantity}
                servingSizeId={food.servingSizeId}
                mealId={meal.id}
                isQuickAdd={food.name.includes('Quick Add') || !food.id}
                dailyGoals={dailyGoals} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};