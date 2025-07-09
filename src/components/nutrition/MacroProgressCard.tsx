import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MacroData {
  current: number;
  goal: number;
}

interface MacroProgressCardProps {
  macros: {
    carbs: MacroData;
    protein: MacroData;
    fat: MacroData;
  };
}

export const MacroProgressCard = ({ macros }: MacroProgressCardProps) => {
  const getMacroPercentage = (current: number, goal: number) => {
    return (current / goal) * 100; // Allow over 100%
  };

  const MacroRing = ({ label, current, goal, color }: { 
    label: string; 
    current: number; 
    goal: number; 
    color: string; 
  }) => {
    const percentage = getMacroPercentage(current, goal);
    const remaining = goal - current;
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <p className="text-base font-semibold text-text mb-2">{label}</p>
        <div className="relative w-24 h-24 mb-3">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--border-muted))"
              strokeWidth="13.5"
            />
            {/* Progress ring with subtle gradient */}
            <defs>
              <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={color} />
                <stop offset="100%" stopColor={color} stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={`url(#gradient-${label})`}
              strokeWidth="13.5"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-lg font-bold ${remaining < 0 ? 'text-destructive' : 'text-text'}`}>
              {remaining >= 0 ? remaining : Math.abs(remaining)}
            </span>
            <span className="text-xs text-text-muted">
              {remaining >= 0 ? 'left' : 'over'}
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm text-text-muted">{current}g / {goal}g</p>
          <p className="text-xs text-text-muted">
            ({Math.round(percentage)}% of goal)
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-[calc(100vw-3rem)] md:w-full md:flex-1 md:max-w-sm glass-elevated shadow-deep backdrop-blur-glass snap-center-force flex-shrink-0">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text">Macro Progress</h3>
        </div>
        <div className="flex justify-between items-center">
          <MacroRing
            label="Fat"
            current={macros.fat.current}
            goal={macros.fat.goal}
            color="hsl(var(--warning))"
          />
          <MacroRing
            label="Carbs"
            current={macros.carbs.current}
            goal={macros.carbs.goal}
            color="hsl(var(--info))"
          />
          <MacroRing
            label="Protein"
            current={macros.protein.current}
            goal={macros.protein.goal}
            color="hsl(var(--success))"
          />
        </div>
      </CardContent>
    </Card>
  );
};