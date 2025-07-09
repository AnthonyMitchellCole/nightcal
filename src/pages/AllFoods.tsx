import { useState } from 'react';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const AllFoods = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock foods data
  const foods = [
    { id: 1, name: "Greek Yogurt", brand: "Fage", calories: 150, carbs: 12, protein: 20, fat: 0 },
    { id: 2, name: "Banana", brand: "Fresh", calories: 105, carbs: 27, protein: 1, fat: 0 },
    { id: 3, name: "Chicken Breast", brand: "Generic", calories: 231, carbs: 0, protein: 44, fat: 5 },
    { id: 4, name: "Brown Rice", brand: "Uncle Ben's", calories: 220, carbs: 45, protein: 5, fat: 2 },
    { id: 5, name: "Almonds", brand: "Blue Diamond", calories: 160, carbs: 6, protein: 6, fat: 14 },
    { id: 6, name: "Salmon", brand: "Atlantic", calories: 208, carbs: 0, protein: 30, fat: 9 },
    { id: 7, name: "Avocado", brand: "Hass", calories: 234, carbs: 12, protein: 3, fat: 21 },
    { id: 8, name: "Oats", brand: "Quaker", calories: 389, carbs: 66, protein: 17, fat: 7 }
  ];

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <p className="text-sm text-text-muted mb-4">
          {filteredFoods.length} food{filteredFoods.length !== 1 ? 's' : ''} found
        </p>

        {/* Foods list */}
        <div className="space-y-3">
          {filteredFoods.map((food) => (
            <Card 
              key={food.id} 
              className="bg-glass border-glass cursor-pointer hover:bg-bg-light transition-colors"
              onClick={() => navigate(`/log-food/${food.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-text">{food.name}</h3>
                    <p className="text-sm text-text-muted">{food.brand}</p>
                    <div className="flex space-x-4 mt-2 text-xs text-text-muted">
                      <span>C: {food.carbs}g</span>
                      <span>P: {food.protein}g</span>
                      <span>F: {food.fat}g</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-text">
                      {food.calories}
                    </span>
                    <p className="text-xs text-text-muted">kcal/100g</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFoods.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <p className="text-text-muted mb-4">No foods found for "{searchQuery}"</p>
            <Button onClick={() => navigate('/add-food')}>
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