import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { useFavoriteFoods } from '@/hooks/useFavoriteFoods';
import { LoadingEmblem } from '@/components/ui/loading-emblem';

export const FavoriteFoodsList = () => {
  const navigate = useNavigate();
  const { favoriteFoods, loading, error } = useFavoriteFoods();

  // Function to parse serving size name and extract the numeric part
  const parseServingName = (servingName: string) => {
    if (!servingName) return { number: 1, unit: 'serving' };
    
    // Handle fractions like "1/2 cup"
    const fractionMatch = servingName.match(/^(\d+)\/(\d+)\s*(.*)$/);
    if (fractionMatch) {
      const numerator = parseFloat(fractionMatch[1]);
      const denominator = parseFloat(fractionMatch[2]);
      const unit = fractionMatch[3].trim() || 'serving';
      return { number: numerator / denominator, unit };
    }
    
    // Handle regular numbers like "1 cup", "6 meatballs", "100g"
    const numberMatch = servingName.match(/^(\d*\.?\d+)\s*(.*)$/);
    if (numberMatch) {
      const number = parseFloat(numberMatch[1]);
      const unit = numberMatch[2].trim() || 'serving';
      return { number, unit };
    }
    
    // Fallback: if no number found, assume 1
    return { number: 1, unit: servingName };
  };

  const formatServingDisplay = (quantity: number, servingName?: string) => {
    if (!servingName) {
      return `${quantity} serving${quantity !== 1 ? 's' : ''}`;
    }

    const { number, unit } = parseServingName(servingName);
    const totalAmount = quantity * number;
    
    // Format the total amount nicely
    const formattedAmount = totalAmount % 1 === 0 ? totalAmount.toString() : totalAmount.toFixed(1);
    
    return `${formattedAmount} ${unit}`;
  };

  const calculateNutritionForServing = (food: any) => {
    const servingGrams = food.last_logged_serving_grams || 100;
    const multiplier = (food.last_logged_quantity * servingGrams) / 100;
    
    return {
      calories: Math.round(food.calories_per_100g * multiplier),
      carbs: Math.round(food.carbs_per_100g * multiplier),
      protein: Math.round(food.protein_per_100g * multiplier),
      fat: Math.round(food.fat_per_100g * multiplier)
    };
  };

  const handleFoodClick = (food: any) => {
    const params = new URLSearchParams({
      quantity: food.last_logged_quantity.toString(),
      ...(food.last_logged_serving_size_id && { servingSizeId: food.last_logged_serving_size_id })
    });
    
    navigate(`/log-food/${food.id}?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center space-x-2">
          <LoadingEmblem size="sm" />
          <span className="text-text-muted">Loading favorite foods...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-glass border-glass backdrop-blur-glass shadow-soft">
        <CardContent className="p-6 text-center">
          <p className="text-text-muted">Failed to load favorite foods</p>
        </CardContent>
      </Card>
    );
  }

  if (favoriteFoods.length === 0) {
    return (
      <Card className="bg-glass border-glass backdrop-blur-glass shadow-soft">
        <CardContent className="p-6 text-center">
          <div className="text-text-muted">
            <p className="text-lg mb-2">No favorite foods yet</p>
            <p className="text-sm">Start logging foods to see your favorites here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {favoriteFoods.map((food) => {
        const nutrition = calculateNutritionForServing(food);
        const servingDisplay = formatServingDisplay(food.last_logged_quantity, food.last_logged_serving_name);
        
        return (
          <Card 
            key={food.id} 
            className="bg-glass border-glass cursor-pointer hover:bg-bg-light transition-colors backdrop-blur-glass shadow-soft hover:shadow-deep"
            onClick={() => handleFoodClick(food)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-medium text-text">{food.name}</h3>
                  <p className="text-sm text-text-muted">{food.brand || 'No brand'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium text-text-muted bg-border-muted/30 px-1.5 py-0.5 rounded">
                      F: {nutrition.fat}g
                    </span>
                    <span className="text-xs font-medium text-text-muted bg-border-muted/30 px-1.5 py-0.5 rounded">
                      C: {nutrition.carbs}g
                    </span>
                    <span className="text-xs font-medium text-text-muted bg-border-muted/30 px-1.5 py-0.5 rounded">
                      P: {nutrition.protein}g
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-text">
                    {nutrition.calories} Cal
                  </span>
                  <p className="text-xs text-text-muted">{servingDisplay}</p>
                  <p className="text-xs text-text-muted/70">{food.log_count} time{food.log_count !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};