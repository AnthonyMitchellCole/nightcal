import { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const SearchFood = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock recently used foods for now
  const recentFoods = [
    { id: 1, name: "Greek Yogurt", brand: "Fage", calories: 150 },
    { id: 2, name: "Banana", brand: "Fresh", calories: 105 },
    { id: 3, name: "Chicken Breast", brand: "Generic", calories: 231 },
    { id: 4, name: "Brown Rice", brand: "Uncle Ben's", calories: 220 },
    { id: 5, name: "Almonds", brand: "Blue Diamond", calories: 160 },
  ];

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky top-0 bg-glass border-b border-glass backdrop-blur-glass p-4 flex items-center space-x-3">
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
            onClick={() => navigate('/add-food')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add "{searchQuery}" as new food
          </Button>
        )}

        {/* Recently Used Foods */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-text">Recently Used</h2>
          {recentFoods.map((food) => (
            <Card 
              key={food.id} 
              className="bg-glass border-glass cursor-pointer hover:bg-bg-light transition-colors"
              onClick={() => navigate(`/log-food/${food.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-text">{food.name}</h3>
                    <p className="text-sm text-text-muted">{food.brand}</p>
                  </div>
                  <span className="text-sm font-medium text-text">
                    {food.calories} kcal
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchFood;