import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronDown } from "lucide-react";

interface CustomNutrientCardProps {
  nutrients: Array<{
    name: string;
    current: number;
    goal: number;
    unit: string;
  }>;
  isPlaceholder?: boolean;
}

export const CustomNutrientCard = ({ nutrients, isPlaceholder = false }: CustomNutrientCardProps) => {
  return (
    <Card className="w-[calc(100vw-3rem)] md:w-full md:flex-1 md:max-w-sm glass-elevated shadow-deep backdrop-blur-glass snap-center-force flex-shrink-0">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text">
              {isPlaceholder ? "Custom Nutrients" : "Custom Tracking"}
            </h3>
            <p className="text-sm text-text-muted">
              {isPlaceholder ? "Set up in Settings" : `${nutrients.length} nutrient${nutrients.length !== 1 ? 's' : ''} tracked`}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-text-muted" />
        </div>
        
        <div className="space-y-4">
          {isPlaceholder ? (
            <div className="text-center py-8">
              <p className="text-text-muted mb-2">No custom nutrients configured</p>
              <p className="text-xs text-text-muted">Go to Settings to set up custom nutrient tracking</p>
            </div>
          ) : (
            <div className="space-y-6">
              {nutrients.map((nutrient, index) => {
                const percentage = Math.min((nutrient.current / nutrient.goal) * 100, 100);
                return (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text">{nutrient.name}</span>
                      <span className="text-xs text-text-muted">
                        {nutrient.current}{nutrient.unit} / {nutrient.goal}{nutrient.unit}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <Progress 
                        value={percentage} 
                        className="h-3 bg-border-muted shadow-inner"
                      />
                      <div className="flex justify-between text-xs text-text-muted">
                        <span>0{nutrient.unit}</span>
                        <span>{Math.round(percentage)}%</span>
                        <span>{nutrient.goal}{nutrient.unit}</span>
                      </div>
                    </div>

                    {percentage >= 100 && (
                      <div className="text-xs text-success font-medium">
                        🎉 Goal reached!
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};