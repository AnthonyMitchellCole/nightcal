import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FoodItem {
  id: number;
  name: string;
  calories: number;
  meal: string;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
}

interface FoodPreviewListProps {
  foods: FoodItem[];
}

export const FoodPreviewList = ({ foods }: FoodPreviewListProps) => {
  const getMealBadgeColor = (meal: string) => {
    switch (meal.toLowerCase()) {
      case 'breakfast':
        return 'bg-info/20 text-info border-info/30';
      case 'lunch':
        return 'bg-success/20 text-success border-success/30';
      case 'dinner':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'snacks':
        return 'bg-secondary/20 text-secondary border-secondary/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <div className="space-y-3">
      {foods.map((food) => (
        <Card key={food.id} className="bg-glass border-glass backdrop-blur-glass shadow-soft hover:shadow-layered transition-all duration-300 cursor-pointer group">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-text group-hover:text-primary transition-colors">
                    {food.name}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getMealBadgeColor(food.meal)}`}
                  >
                    {food.meal}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-muted">
                  <span className="font-medium text-primary">{food.calories} kcal</span>
                  <span>C: {food.macros.carbs}g</span>
                  <span>P: {food.macros.protein}g</span>
                  <span>F: {food.macros.fat}g</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-bg-light border border-border flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {foods.length === 0 && (
        <Card className="bg-glass border-glass backdrop-blur-glass shadow-soft">
          <CardContent className="p-8 text-center">
            <div className="text-text-muted">
              <p className="text-lg mb-2">No foods logged yet today</p>
              <p className="text-sm">Tap the + button to start tracking your nutrition</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};