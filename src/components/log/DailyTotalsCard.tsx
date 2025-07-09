import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DailyGoals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface DailyTotals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface DailyTotalsCardProps {
  dailyTotals: DailyTotals;
  dailyGoals: DailyGoals;
}

export const DailyTotalsCard = ({ dailyTotals, dailyGoals }: DailyTotalsCardProps) => {
  return (
    <Card className="glass-elevated shadow-deep backdrop-blur-glass">
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
              <span>Fat</span>
              <span>{dailyTotals.fat}g / {dailyGoals.fat}g ({Math.round((dailyTotals.fat / dailyGoals.fat) * 100)}%)</span>
            </div>
            <Progress 
              value={(dailyTotals.fat / dailyGoals.fat) * 100} 
              className="h-3 bg-border-muted [&>div]:bg-warning" 
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Carbs</span>
              <span>{dailyTotals.carbs}g / {dailyGoals.carbs}g ({Math.round((dailyTotals.carbs / dailyGoals.carbs) * 100)}%)</span>
            </div>
            <Progress 
              value={(dailyTotals.carbs / dailyGoals.carbs) * 100} 
              className="h-3 bg-border-muted [&>div]:bg-info" 
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Protein</span>
              <span>{dailyTotals.protein}g / {dailyGoals.protein}g ({Math.round((dailyTotals.protein / dailyGoals.protein) * 100)}%)</span>
            </div>
            <Progress 
              value={(dailyTotals.protein / dailyGoals.protein) * 100} 
              className="h-3 bg-border-muted [&>div]:bg-success" 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};