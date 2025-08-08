import { useState } from 'react';
import { Plus, Trash2, X, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingEmblem } from '@/components/ui/loading-emblem';
import { useServingSizes } from '@/hooks/useServingSizes';
import { useFavoriteServingSizes } from '@/hooks/useFavoriteServingSizes';
import { toast } from '@/hooks/use-toast';

interface ServingSizesManagerProps {
  foodId: string;
  canEdit: boolean;
}

export const ServingSizesManager = ({ foodId, canEdit }: ServingSizesManagerProps) => {
  const [showAddServing, setShowAddServing] = useState(false);
  const [newServing, setNewServing] = useState({
    name: '',
    grams: '',
    is_default: false
  });

  const { servingSizes, loading: servingsLoading, createServingSize, updateServingSize, deleteServingSize } = useServingSizes(foodId);
  const { getFavoriteServingSize, setFavoriteServing, deleteFavoriteServing, loading: favoritesLoading } = useFavoriteServingSizes();

  const handleAddServing = async () => {
    if (!newServing.name || !newServing.grams) {
      toast({
        title: "Validation Error",
        description: "Please enter both name and grams",
        variant: "destructive"
      });
      return;
    }

    try {
      await createServingSize({
        name: newServing.name,
        grams: parseFloat(newServing.grams),
        is_default: newServing.is_default
      });
      
      setNewServing({ name: '', grams: '', is_default: false });
      setShowAddServing(false);
      
      toast({
        title: "Success",
        description: "Serving size added successfully",
      });
    } catch (error) {
      console.error('Error adding serving size:', error);
      toast({
        title: "Error",
        description: "Failed to add serving size",
        variant: "destructive"
      });
    }
  };

  const handleDeleteServing = async (servingId: string) => {
    try {
      await deleteServingSize(servingId);
      toast({
        title: "Success",
        description: "Serving size deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting serving size:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete serving size",
        variant: "destructive"
      });
    }
  };

  const handleToggleFavoriteServing = async (servingId: string) => {
    try {
      const currentFavorite = getFavoriteServingSize(foodId);
      
      if (currentFavorite === servingId) {
        // If this serving is already favorite, remove it
        await deleteFavoriteServing(foodId);
        toast({
          title: "Success",
          description: "Favorite serving size removed",
        });
      } else {
        // Set this serving as favorite
        await setFavoriteServing(foodId, servingId);
        toast({
          title: "Success",
          description: "Favorite serving size set",
        });
      }
    } catch (error) {
      console.error('Error toggling favorite serving size:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite serving size",
        variant: "destructive"
      });
    }
  };

  const isFavoriteServing = (servingId: string): boolean => {
    return getFavoriteServingSize(foodId) === servingId;
  };


  if (!canEdit) return null;

  return (
    <Card className="bg-glass border-glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Serving Sizes</CardTitle>
          <Button 
            type="button"
            variant="outline" 
            size="sm"
            onClick={() => setShowAddServing(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Serving
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {servingsLoading || favoritesLoading ? (
          <div className="flex items-center justify-center py-4">
            <LoadingEmblem size="sm" />
          </div>
        ) : (
          <>
            {servingSizes.map((serving) => (
              <div key={serving.id} className="flex items-center justify-between p-3 bg-bg-light rounded-lg">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{serving.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFavoriteServing(serving.id)}
                      className="p-1"
                    >
                      <Star className={`w-3 h-3 ${isFavoriteServing(serving.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                    </Button>
                    {serving.is_default && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-text-muted">{serving.grams}g</span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteServing(serving.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {showAddServing && (
              <div className="p-4 bg-bg-light rounded-lg space-y-3 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Add New Serving Size</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowAddServing(false);
                      setNewServing({ name: '', grams: '', is_default: false });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="serving-name">Serving Name</Label>
                    <Input
                      id="serving-name"
                      placeholder="e.g., 1 medium, 1 cup"
                      value={newServing.name}
                      onChange={(e) => setNewServing(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="serving-grams">Grams</Label>
                    <Input
                      id="serving-grams"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 118"
                      value={newServing.grams}
                      onChange={(e) => setNewServing(prev => ({ ...prev, grams: e.target.value }))}
                    />
                  </div>
                </div>
                
                
                <Button
                  type="button"
                  onClick={handleAddServing}
                  className="w-full"
                >
                  Add Serving Size
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};