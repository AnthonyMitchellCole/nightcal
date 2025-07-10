import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingEmblem } from '@/components/ui/loading-emblem';
import { useUSDASearch, USDAFood } from '@/hooks/useUSDASearch';
import { USDAFoodCard } from '@/components/food/USDAFoodCard';

const USDASearchFood = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { foods, loading, error, totalHits } = useUSDASearch(searchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus the search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSelectFood = (food: USDAFood) => {
    // Create URL params to pre-populate the Add Food form
    const params = new URLSearchParams({
      name: food.name,
      brand: food.brand,
      // Pre-fill the serving data
      servingName: '100g',
      servingGrams: '100',
      calories: food.nutrition.calories.toString(),
      protein: food.nutrition.protein.toString(),
      carbs: food.nutrition.carbs.toString(),
      fat: food.nutrition.fat.toString(),
      ...(food.nutrition.fiber && { fiber: food.nutrition.fiber.toString() }),
      ...(food.nutrition.sodium && { sodium: food.nutrition.sodium.toString() }),
      ...(food.nutrition.sugar && { sugar: food.nutrition.sugar.toString() }),
      ...(food.nutrition.saturated_fat && { saturated_fat: food.nutrition.saturated_fat.toString() }),
      ...(food.nutrition.trans_fat && { trans_fat: food.nutrition.trans_fat.toString() }),
      ...(food.nutrition.cholesterol && { cholesterol: food.nutrition.cholesterol.toString() }),
      ...(food.nutrition.calcium && { calcium: food.nutrition.calcium.toString() }),
      ...(food.nutrition.iron && { iron: food.nutrition.iron.toString() }),
      ...(food.nutrition.magnesium && { magnesium: food.nutrition.magnesium.toString() }),
      ...(food.nutrition.potassium && { potassium: food.nutrition.potassium.toString() }),
      ...(food.nutrition.vitamin_a && { vitamin_a: food.nutrition.vitamin_a.toString() }),
      ...(food.nutrition.vitamin_c && { vitamin_c: food.nutrition.vitamin_c.toString() }),
      source: 'usda'
    });
    
    navigate(`/add-food?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky-header bg-gradient-glass border-b border-glass backdrop-blur-glass shadow-deep p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">USDA Food Search</h1>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search USDA food database..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="p-4">
        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-text-muted">
            {loading ? 'Searching...' : 
             searchQuery ? `${totalHits} foods found in USDA database` : 
             'Enter a search term to find foods in the USDA database'}
          </p>
          {loading && <LoadingEmblem size="sm" className="text-text-muted" />}
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
            >
              Clear search
            </Button>
          </div>
        )}

        {/* Foods list */}
        {!error && (
          <div className="space-y-3">
            {foods.map((food) => (
              <USDAFoodCard 
                key={food.fdcId} 
                food={food} 
                onSelect={handleSelectFood}
              />
            ))}
          </div>
        )}

        {/* No results state */}
        {!loading && !error && searchQuery && foods.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-muted mb-4">No foods found for "{searchQuery}"</p>
            <p className="text-sm text-text-muted">Try using different keywords or check your spelling</p>
          </div>
        )}

        {/* Info about USDA database */}
        {!searchQuery && !loading && (
          <div className="text-center py-8">
            <Database className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">USDA FoodData Central</h3>
            <p className="text-text-muted max-w-md mx-auto">
              Search the comprehensive USDA nutrition database with over 300,000 foods. 
              Select any food to automatically populate the Add Food form with accurate nutrition data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default USDASearchFood;