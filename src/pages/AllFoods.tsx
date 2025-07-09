import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useFoods } from '@/hooks/useFoods';

const AllFoods = () => {
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

  const { foods, loading } = useFoods(debouncedQuery);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky top-0 bg-glass border-b border-glass backdrop-blur-glass p-4">
        <div className="flex items-center space-x-3 mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">All Foods</h1>
          <div className="flex-1" />
          <Button 
            size="sm"
            onClick={() => navigate('/add-food')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Food
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            type="text"
            placeholder="Search foods..."
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
            {loading ? 'Loading...' : `${foods.length} food${foods.length !== 1 ? 's' : ''} found`}
          </p>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-text-muted" />}
        </div>

        {/* Foods list */}
        <div className="space-y-3">
          {foods.map((food) => (
            <Card 
              key={food.id} 
              className="bg-glass border-glass cursor-pointer hover:bg-bg-light transition-colors"
              onClick={() => navigate(`/edit-food/${food.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-text">{food.name}</h3>
                    <p className="text-sm text-text-muted">{food.brand || 'No brand'}</p>
                    <div className="flex space-x-4 mt-2 text-xs text-text-muted">
                      <span>C: {food.carbs_per_100g}g</span>
                      <span>P: {food.protein_per_100g}g</span>
                      <span>F: {food.fat_per_100g}g</span>
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
          ))}
        </div>

        {foods.length === 0 && searchQuery && !loading && (
          <div className="text-center py-8">
            <p className="text-text-muted mb-4">No foods found for "{searchQuery}"</p>
            <Button onClick={() => navigate(`/add-food?name=${encodeURIComponent(searchQuery)}`)}>
              <Plus className="w-4 h-4 mr-2" />
              Add "{searchQuery}" as new food
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFoods;