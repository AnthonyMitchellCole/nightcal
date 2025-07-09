import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronDown } from "lucide-react";

interface CustomNutrientCardProps {
  nutrient: {
    name: string;
    current: number;
    goal: number;
    unit: string;
  };
}

export const CustomNutrientCard = ({ nutrient }: CustomNutrientCardProps) => {
  const percentage = Math.min((nutrient.current / nutrient.goal) * 100, 100);

  return (
    <Card className="w-[calc(100vw-3rem)] md:w-full md:flex-1 md:max-w-sm glass-elevated shadow-deep backdrop-blur-glass snap-center-force flex-shrink-0">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text">{nutrient.name}</h3>
            <p className="text-sm text-text-muted">Custom nutrient tracking</p>
          </div>
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-text">
              {nutrient.current}{nutrient.unit}
            </span>
            <span className="text-sm text-text-muted">
              / {nutrient.goal}{nutrient.unit}
            </span>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={percentage} 
              className="h-4 bg-border-muted shadow-inner"
            />
            <div className="flex justify-between text-xs text-text-muted">
              <span>0{nutrient.unit}</span>
              <span>{Math.round(percentage)}%</span>
              <span>{nutrient.goal}{nutrient.unit}</span>
            </div>
          </div>

          {percentage >= 100 && (
            <div className="text-xs text-success font-medium">
              🎉 Daily goal reached!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};