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
    name: string;
    brand?: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
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
    <Card className="bg-glass border-glass backdrop-blur-glass shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold text-text">{meal.name}</span>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-bold text-info bg-info/20 px-2 py-1 rounded">
                C: {meal.totals.carbs}g
              </span>
              <span className="font-bold text-success bg-success/20 px-2 py-1 rounded">
                P: {meal.totals.protein}g
              </span>
              <span className="font-bold text-warning bg-warning/20 px-2 py-1 rounded">
                F: {meal.totals.fat}g
              </span>
            </div>
            <div className="text-xs text-text-muted">
              {mealCarbPercentage}% • {mealProteinPercentage}% • {mealFatPercentage}% of daily goals
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-primary">
              {meal.totals.calories} Cal
            </span>
            <div className="text-xs text-text-muted">
              {mealCalPercentage}% of goal
            </div>
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
                key={food.id} 
                food={food} 
                dailyGoals={dailyGoals} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};