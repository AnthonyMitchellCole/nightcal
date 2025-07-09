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
    return Math.min((current / goal) * 100, 100);
  };

  const MacroRing = ({ label, current, goal, color }: { 
    label: string; 
    current: number; 
    goal: number; 
    color: string; 
  }) => {
    const percentage = getMacroPercentage(current, goal);
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-3">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="hsl(var(--border-muted))"
              strokeWidth="20"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={color}
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-text">{Math.round(percentage)}%</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-text">{label}</p>
          <p className="text-base text-text-muted">{current}g / {goal}g</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-[calc(100vw-3rem)] md:w-full md:flex-1 md:max-w-sm bg-glass border-glass backdrop-blur-glass shadow-layered snap-center-force flex-shrink-0">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text">Macro Progress</h3>
          <p className="text-sm text-text-muted">Daily nutrition breakdown</p>
        </div>
        <div className="flex justify-between items-center">
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
          <MacroRing
            label="Fat"
            current={macros.fat.current}
            goal={macros.fat.goal}
            color="hsl(var(--warning))"
          />
        </div>
      </CardContent>
    </Card>
  );
};