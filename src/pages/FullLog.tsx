import { LoadingEmblem } from '@/components/ui/loading-emblem';
import { FullLogHeader } from '@/components/log/FullLogHeader';
import { DailyTotalsCard } from '@/components/log/DailyTotalsCard';
import { MealCard } from '@/components/log/MealCard';
import { useFullLog } from '@/hooks/useFullLog';

const FullLog = () => {
  const { loading, dailyGoals, dailyTotals, meals } = useFullLog();

  if (loading) {
    return (
      <div className="min-h-screen page-gradient text-text">
        <FullLogHeader />
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
    <div className="min-h-screen page-gradient text-text">
      <FullLogHeader />
      
      <div className="p-4 space-y-4">
        <DailyTotalsCard 
          dailyTotals={dailyTotals} 
          dailyGoals={dailyGoals} 
        />

        {meals.map((meal) => (
          <MealCard 
            key={meal.id} 
            meal={meal} 
            dailyGoals={dailyGoals} 
          />
        ))}
      </div>
    </div>
  );
};

export default FullLog;