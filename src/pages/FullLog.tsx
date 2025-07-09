import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingEmblem } from '@/components/ui/loading-emblem';
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
            <LoadingEmblem />
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
                  / {dailyGoals.calories} Cal
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
        {meals.map((meal) => {
          const mealCalPercentage = Math.round((meal.totals.calories / dailyGoals.calories) * 100);
          const mealCarbPercentage = Math.round((meal.totals.carbs / dailyGoals.carbs) * 100);
          const mealProteinPercentage = Math.round((meal.totals.protein / dailyGoals.protein) * 100);
          const mealFatPercentage = Math.round((meal.totals.fat / dailyGoals.fat) * 100);

          return (
            <Card key={meal.id} className="bg-glass border-glass backdrop-blur-glass shadow-soft">
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
                    {meal.foods.map((food) => {
                      const foodCalPercentage = Math.round((food.calories / dailyGoals.calories) * 100);
                      const foodCarbPercentage = Math.round((food.carbs / dailyGoals.carbs) * 100);
                      const foodProteinPercentage = Math.round((food.protein / dailyGoals.protein) * 100);
                      const foodFatPercentage = Math.round((food.fat / dailyGoals.fat) * 100);

                      return (
                        <div key={food.id} className="flex justify-between items-start p-3 bg-bg-light rounded-lg border border-border hover:bg-bg-dark/50 transition-colors">
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
                    })}
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