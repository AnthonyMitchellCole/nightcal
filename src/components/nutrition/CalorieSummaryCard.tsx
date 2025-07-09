import { Card, CardContent } from "@/components/ui/card";

interface CalorieSummaryCardProps {
  calories: {
    current: number;
    goal: number;
  };
}

export const CalorieSummaryCard = ({ calories }: CalorieSummaryCardProps) => {
  const percentage = Math.min((calories.current / calories.goal) * 100, 100);
  const remaining = calories.goal - calories.current;
  const circumference = 2 * Math.PI * 60;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="w-[calc(100vw-3rem)] md:w-full md:flex-1 md:max-w-sm glass-elevated shadow-deep backdrop-blur-glass snap-center-force flex-shrink-0">
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
                r="55"
                fill="none"
                stroke="hsl(var(--border-muted))"
                strokeWidth="24"
              />
              {/* Progress ring with subtle gradient */}
              <defs>
                <linearGradient id="calorie-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <circle
                cx="70"
                cy="70"
                r="55"
                fill="none"
                stroke="url(#calorie-gradient)"
                strokeWidth="24"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${remaining < 0 ? 'text-destructive' : 'text-text'}`}>
                {remaining >= 0 ? remaining : Math.abs(remaining)}
              </span>
              <span className="text-base text-text-muted">
                {remaining >= 0 ? 'Left' : 'Over'}
              </span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-text">
              {calories.current} / {calories.goal} Cal
            </p>
            <p className="text-sm text-text-muted">
              ({Math.round(percentage)}% of goal)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};