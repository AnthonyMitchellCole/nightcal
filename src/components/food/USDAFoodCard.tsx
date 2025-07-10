import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { USDAFood } from '@/hooks/useUSDASearch';

interface USDAFoodCardProps {
  food: USDAFood;
  onSelect: (food: USDAFood) => void;
}

export const USDAFoodCard = ({ food, onSelect }: USDAFoodCardProps) => {
  return (
    <Card className="bg-glass border-glass hover:bg-bg-light transition-colors">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="font-medium text-text mb-1">{food.name}</h3>
            <p className="text-sm text-text-muted mb-2">{food.brand}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-text-muted bg-border-muted/30 px-1.5 py-0.5 rounded">
                F: {food.nutrition.fat}g
              </span>
              <span className="text-xs font-medium text-text-muted bg-border-muted/30 px-1.5 py-0.5 rounded">
                C: {food.nutrition.carbs}g
              </span>
              <span className="text-xs font-medium text-text-muted bg-border-muted/30 px-1.5 py-0.5 rounded">
                P: {food.nutrition.protein}g
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-semibold text-text block mb-2">
              {food.nutrition.calories} Cal
            </span>
            <Button 
              size="sm" 
              onClick={() => onSelect(food)}
              className="w-full"
            >
              Select
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};