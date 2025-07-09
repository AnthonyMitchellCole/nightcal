import { useState } from 'react';
import { LoadingEmblem } from '@/components/ui/loading-emblem';
import { FullLogHeader } from '@/components/log/FullLogHeader';
import { DateNavigation } from '@/components/log/DateNavigation';
import { DailyTotalsCard } from '@/components/log/DailyTotalsCard';
import { MealCard } from '@/components/log/MealCard';
import { useFullLog } from '@/hooks/useFullLog';

const FullLog = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Convert date to string format for the hook using local timezone
  const dateString = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format in local timezone
  const { loading, dailyGoals, dailyTotals, meals } = useFullLog(dateString);

  if (loading) {
    return (
      <div className="min-h-screen page-gradient text-text">
        <FullLogHeader />
        <div className="px-4 pt-4">
          <DateNavigation 
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
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
    <div className="min-h-screen page-gradient text-text">
      <FullLogHeader />
      
      {/* Date Navigation */}
      <div className="px-4 pt-4">
        <DateNavigation 
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
      
      <div className="px-4 pb-4 space-y-4">
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