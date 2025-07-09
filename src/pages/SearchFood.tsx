import { useState, useEffect } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingEmblem } from '@/components/ui/loading-emblem';
import { useFoods, useRecentFoods } from '@/hooks/useFoods';

const SearchFood = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { foods, loading: searchLoading } = useFoods(debouncedQuery);
  const { recentFoods, loading: recentLoading } = useRecentFoods();

  const showSearchResults = debouncedQuery.trim().length > 0;
  const displayFoods = showSearchResults ? foods : recentFoods;

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky-header bg-gradient-glass border-b border-glass backdrop-blur-glass shadow-deep p-4 flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">Search Food</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search for a food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />

        {/* Add New Food Button */}
        {searchQuery && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate(`/add-food?name=${encodeURIComponent(searchQuery)}`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add "{searchQuery}" as new food
          </Button>
        )}

        {/* Foods List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-text">
              {showSearchResults ? 'Search Results' : 'Recently Used'}
            </h2>
            {(searchLoading || recentLoading) && (
              <LoadingEmblem size="sm" className="text-text-muted" />
            )}
          </div>

          {displayFoods.length === 0 && !searchLoading && !recentLoading ? (
            <div className="text-center py-8">
              <p className="text-text-muted mb-4">
                {showSearchResults ? `No foods found for "${searchQuery}"` : 'No recently used foods'}
              </p>
              {showSearchResults && (
                <Button onClick={() => navigate(`/add-food?name=${encodeURIComponent(searchQuery)}`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add "{searchQuery}" as new food
                </Button>
              )}
            </div>
          ) : (
            displayFoods.map((food) => (
              <Card 
                key={food.id} 
                className="bg-glass border-glass cursor-pointer hover:bg-bg-light transition-colors"
                onClick={() => navigate(`/log-food/${food.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-text">{food.name}</h3>
                      <p className="text-sm text-text-muted">{food.brand || 'No brand'}</p>
                      <div className="flex space-x-4 mt-2 text-xs text-text-muted">
                        <span>F: {food.fat_per_100g}g</span>
                        <span>C: {food.carbs_per_100g}g</span>
                        <span>P: {food.protein_per_100g}g</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-text">
                        {food.calories_per_100g}
                      </span>
                      <p className="text-xs text-text-muted">Cal/100g</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFood;