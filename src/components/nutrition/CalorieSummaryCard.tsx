import { Card, CardContent } from "@/components/ui/card";

interface CalorieSummaryCardProps {
  calories: {
    current: number;
    goal: number;
  };
}

export const CalorieSummaryCard = ({ calories }: CalorieSummaryCardProps) => {
  const percentage = Math.min((calories.current / calories.goal) * 100, 100);
  const circumference = 2 * Math.PI * 60;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="w-[calc(100vw-2rem)] md:w-full md:flex-1 md:max-w-sm bg-glass border-glass backdrop-blur-glass shadow-layered snap-center flex-shrink-0">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text">Calorie Summary</h3>
          <p className="text-sm text-text-muted">Daily energy intake</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 140 140">
              {/* Background ring */}
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="hsl(var(--border-muted))"
                strokeWidth="12"
              />
              {/* Progress ring */}
              <circle
                cx="70"
                cy="70"
                r="60"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-text">{calories.current}</span>
              <span className="text-xs text-text-muted">kcal</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-text">
              {calories.current} / {calories.goal} kcal
            </p>
            <p className="text-xs text-text-muted">
              ({Math.round(percentage)}% of goal)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};