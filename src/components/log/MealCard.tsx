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
    isQuickAdd?: boolean;
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
    <Card className="surface-elevated border border-border rounded-lg shadow-soft hover:shadow-layered transition-all duration-200">
      <CardHeader className="pb-3 pt-4">
        <CardTitle>
          {/* Top row: Meal Name and Calories */}
          <div className="flex justify-between items-start mb-2">
            <span className="text-lg font-semibold text-primary">{meal.name}</span>
            <span className="text-xl font-bold text-primary">
              {meal.totals.calories} Cal <span className="text-sm opacity-75">({mealCalPercentage}%)</span>
            </span>
          </div>
          
          {/* Bottom row: Macro badges */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-warning bg-warning/15 px-1.5 py-0.5 rounded">
              F: {meal.totals.fat}g <span className="opacity-75">({mealFatPercentage}%)</span>
            </span>
            <span className="font-semibold text-info bg-info/15 px-1.5 py-0.5 rounded">
              C: {meal.totals.carbs}g <span className="opacity-75">({mealCarbPercentage}%)</span>
            </span>
            <span className="font-semibold text-success bg-success/15 px-1.5 py-0.5 rounded">
              P: {meal.totals.protein}g <span className="opacity-75">({mealProteinPercentage}%)</span>
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
                isQuickAdd={food.isQuickAdd}
                dailyGoals={dailyGoals} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};