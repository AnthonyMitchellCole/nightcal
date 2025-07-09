import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useDailySummary, useMealSummary } from '@/hooks/useFoodLogs';
import { useProfile } from '@/hooks/useProfile';

const FullLog = () => {
  const navigate = useNavigate();
  
  const { summary, loading: summaryLoading } = useDailySummary();
  const { meals, loading: mealsLoading } = useMealSummary();
  const { profile, loading: profileLoading } = useProfile();

  const loading = summaryLoading || mealsLoading || profileLoading;

  // Get goals from profile or use defaults
  const dailyGoals = {
    calories: profile?.calorie_goal || 2100,
    carbs: profile?.carb_goal_grams || 250,
    protein: profile?.protein_goal_grams || 150,
    fat: profile?.fat_goal_grams || 80
  };

  const dailyTotals = {
    calories: Math.round(summary.calories),
    carbs: Math.round(summary.carbs),
    protein: Math.round(summary.protein),
    fat: Math.round(summary.fat)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text">
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
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading your food log...</span>
          </div>
        </div>
      </div>
    );
  }

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
        {meals.map((meal) => (
          <Card key={meal.id} className="bg-glass border-glass">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{meal.name}</span>
                <span className="text-sm font-normal text-text-muted">
                  {meal.totals.calories} kcal
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
                  {meal.foods.map((food) => (
                    <div key={food.id} className="flex justify-between items-center p-3 bg-bg-light rounded-lg">
                      <div>
                        <h4 className="font-medium text-text">{food.name}</h4>
                        <p className="text-sm text-text-muted">
                          {food.brand && `${food.brand} • `}
                          {food.quantity}x ({food.grams}g)
                        </p>
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
                          {meal.totals.calories} kcal • 
                          C: {meal.totals.carbs}g • 
                          P: {meal.totals.protein}g • 
                          F: {meal.totals.fat}g
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FullLog;