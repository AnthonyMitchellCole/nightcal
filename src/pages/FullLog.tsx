import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const FullLog = () => {
  const navigate = useNavigate();

  // Mock data for today's meals
  const todaysMeals = [
    {
      name: 'Breakfast',
      foods: [
        { name: 'Greek Yogurt', calories: 150, carbs: 12, protein: 20, fat: 0 },
        { name: 'Banana', calories: 105, carbs: 27, protein: 1, fat: 0 }
      ]
    },
    {
      name: 'Lunch',
      foods: [
        { name: 'Chicken Breast', calories: 231, carbs: 0, protein: 44, fat: 5 },
        { name: 'Brown Rice', calories: 220, carbs: 45, protein: 5, fat: 2 }
      ]
    },
    {
      name: 'Dinner',
      foods: []
    },
    {
      name: 'Snacks',
      foods: []
    }
  ];

  // Calculate totals
  const dailyTotals = todaysMeals.reduce((totals, meal) => {
    meal.foods.forEach(food => {
      totals.calories += food.calories;
      totals.carbs += food.carbs;
      totals.protein += food.protein;
      totals.fat += food.fat;
    });
    return totals;
  }, { calories: 0, carbs: 0, protein: 0, fat: 0 });

  // Mock daily goals
  const dailyGoals = {
    calories: 2100,
    carbs: 250,
    protein: 150,
    fat: 80
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky top-0 bg-glass border-b border-glass backdrop-blur-glass p-4 flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Today's Log</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Daily Totals */}
        <Card className="bg-glass border-glass">
          <CardHeader>
            <CardTitle>Daily Totals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {dailyTotals.calories}
                </div>
                <div className="text-sm text-text-muted">
                  / {dailyGoals.calories} kcal
                </div>
              </div>
              <div>
                <div className="text-xl font-semibold text-text">
                  {Math.round((dailyTotals.calories / dailyGoals.calories) * 100)}%
                </div>
                <div className="text-sm text-text-muted">of goal</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Carbs</span>
                  <span>{dailyTotals.carbs}g / {dailyGoals.carbs}g</span>
                </div>
                <Progress 
                  value={(dailyTotals.carbs / dailyGoals.carbs) * 100} 
                  className="h-2" 
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Protein</span>
                  <span>{dailyTotals.protein}g / {dailyGoals.protein}g</span>
                </div>
                <Progress 
                  value={(dailyTotals.protein / dailyGoals.protein) * 100} 
                  className="h-2" 
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Fat</span>
                  <span>{dailyTotals.fat}g / {dailyGoals.fat}g</span>
                </div>
                <Progress 
                  value={(dailyTotals.fat / dailyGoals.fat) * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meals */}
        {todaysMeals.map((meal, index) => {
          const mealTotals = meal.foods.reduce((totals, food) => {
            totals.calories += food.calories;
            totals.carbs += food.carbs;
            totals.protein += food.protein;
            totals.fat += food.fat;
            return totals;
          }, { calories: 0, carbs: 0, protein: 0, fat: 0 });

          return (
            <Card key={index} className="bg-glass border-glass">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{meal.name}</span>
                  <span className="text-sm font-normal text-text-muted">
                    {mealTotals.calories} kcal
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meal.foods.length === 0 ? (
                  <p className="text-text-muted text-center py-4">
                    No foods logged yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {meal.foods.map((food, foodIndex) => (
                      <div key={foodIndex} className="flex justify-between items-center p-3 bg-bg-light rounded-lg">
                        <div>
                          <h4 className="font-medium text-text">{food.name}</h4>
                          <p className="text-sm text-text-muted">
                            C: {food.carbs}g • P: {food.protein}g • F: {food.fat}g
                          </p>
                        </div>
                        <span className="font-medium text-text">
                          {food.calories} kcal
                        </span>
                      </div>
                    ))}
                    
                    {meal.foods.length > 0 && (
                      <div className="border-t border-border pt-3 mt-3">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Meal Total</span>
                          <span>
                            {mealTotals.calories} kcal • 
                            C: {mealTotals.carbs}g • 
                            P: {mealTotals.protein}g • 
                            F: {mealTotals.fat}g
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FullLog;