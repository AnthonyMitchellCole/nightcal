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
  dailyGoals: {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  };
}

export const FoodItem = ({ food, dailyGoals }: FoodItemProps) => {
  const foodCalPercentage = Math.round((food.calories / dailyGoals.calories) * 100);
  const foodCarbPercentage = Math.round((food.carbs / dailyGoals.carbs) * 100);
  const foodProteinPercentage = Math.round((food.protein / dailyGoals.protein) * 100);
  const foodFatPercentage = Math.round((food.fat / dailyGoals.fat) * 100);

  return (
    <div className="flex justify-between items-start p-3 bg-bg-light rounded-lg border border-border hover:bg-bg-dark/50 transition-colors">
      <div className="flex-1">
        <h4 className="font-medium text-text mb-1">{food.name}</h4>
        {food.brand && (
          <p className="text-sm text-text-muted mb-2">{food.brand}</p>
        )}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-info bg-info/15 px-1.5 py-0.5 rounded">
            C: {food.carbs}g
          </span>
          <span className="text-xs font-semibold text-success bg-success/15 px-1.5 py-0.5 rounded">
            P: {food.protein}g
          </span>
          <span className="text-xs font-semibold text-warning bg-warning/15 px-1.5 py-0.5 rounded">
            F: {food.fat}g
          </span>
        </div>
        <div className="text-xs text-text-muted">
          {foodCarbPercentage}% • {foodProteinPercentage}% • {foodFatPercentage}% of daily goals
        </div>
      </div>
      <div className="text-right ml-3">
        <span className="font-semibold text-text text-lg">
          {food.calories} Cal
        </span>
        <div className="text-xs text-text-muted">
          {foodCalPercentage}% of goal
        </div>
      </div>
    </div>
  );
};