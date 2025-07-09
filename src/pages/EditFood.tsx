import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Trash2, Plus, Edit2, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingEmblem } from '@/components/ui/loading-emblem';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useServingSizes } from '@/hooks/useServingSizes';
import { toast } from '@/hooks/use-toast';

const EditFood = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const [showAddServing, setShowAddServing] = useState(false);
  const [editingServingId, setEditingServingId] = useState<string | null>(null);
  
  const { servingSizes, loading: servingsLoading, createServingSize, updateServingSize, deleteServingSize } = useServingSizes(id);
  
  const [newServing, setNewServing] = useState({
    name: '',
    grams: '',
    is_default: false
  });
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    barcode: '',
    category: '',
    calories_per_100g: '',
    carbs_per_100g: '',
    protein_per_100g: '',
    fat_per_100g: '',
    sugar_per_100g: '',
    sodium_per_100g: '',
    fiber_per_100g: '',
  });

  useEffect(() => {
    if (id) {
      fetchFood();
    }
  }, [id]);

  const fetchFood = async () => {
    try {
      const { data: food, error } = await supabase
        .from('foods')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (food) {
        setFormData({
          name: food.name || '',
          brand: food.brand || '',
          barcode: food.barcode || '',
          category: food.category || '',
          calories_per_100g: food.calories_per_100g?.toString() || '',
          carbs_per_100g: food.carbs_per_100g?.toString() || '',
          protein_per_100g: food.protein_per_100g?.toString() || '',
          fat_per_100g: food.fat_per_100g?.toString() || '',
          sugar_per_100g: food.sugar_per_100g?.toString() || '',
          sodium_per_100g: food.sodium_per_100g?.toString() || '',
          fiber_per_100g: food.fiber_per_100g?.toString() || '',
        });

        // Check if user can edit this food (custom food created by them)
        setCanEdit(food.is_custom && food.created_by === user?.id);
      }
    } catch (error) {
      console.error('Error fetching food:', error);
      toast({
        title: "Error",
        description: "Failed to load food details",
        variant: "destructive"
      });
      navigate('/all-foods');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('foods')
        .update({
          name: formData.name,
          brand: formData.brand || null,
          barcode: formData.barcode || null,
          category: formData.category || null,
          calories_per_100g: parseInt(formData.calories_per_100g) || 0,
          carbs_per_100g: parseFloat(formData.carbs_per_100g) || 0,
          protein_per_100g: parseFloat(formData.protein_per_100g) || 0,
          fat_per_100g: parseFloat(formData.fat_per_100g) || 0,
          sugar_per_100g: formData.sugar_per_100g ? parseFloat(formData.sugar_per_100g) : null,
          sodium_per_100g: formData.sodium_per_100g ? parseFloat(formData.sodium_per_100g) : null,
          fiber_per_100g: formData.fiber_per_100g ? parseFloat(formData.fiber_per_100g) : null,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Food updated successfully",
      });

      navigate('/all-foods');
    } catch (error) {
      console.error('Error updating food:', error);
      toast({
        title: "Error",
        description: "Failed to update food",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!canEdit) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from('foods')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Food deleted successfully",
      });

      navigate('/all-foods');
    } catch (error) {
      console.error('Error deleting food:', error);
      toast({
        title: "Error",
        description: "Failed to delete food",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

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

  const handleSetDefault = async (servingId: string) => {
    try {
      await updateServingSize(servingId, { is_default: true });
      toast({
        title: "Success",
        description: "Default serving size updated",
      });
    } catch (error) {
      console.error('Error updating default serving:', error);
      toast({
        title: "Error",
        description: "Failed to update default serving size",
        variant: "destructive"
      });
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <LoadingEmblem size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Header */}
      <div className="sticky top-0 bg-glass border-b border-glass backdrop-blur-glass p-4">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/all-foods')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">
            {canEdit ? 'Edit Food' : 'Food Details'}
          </h1>
        </div>
      </div>

      <div className="p-4">
        {!canEdit && (
          <Alert className="mb-6">
            <AlertDescription>
              This is a public food item and cannot be edited. Only custom foods you've created can be modified.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="bg-glass border-glass">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Food Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  disabled={!canEdit}
                />
              </div>

              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange('brand', e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              <div>
                <Label htmlFor="barcode">Barcode</Label>
                <Input
                  id="barcode"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  disabled={!canEdit}
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={!canEdit}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-glass border-glass">
            <CardHeader>
              <CardTitle>Nutritional Information (per 100g)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories *</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories_per_100g}
                    onChange={(e) => handleInputChange('calories_per_100g', e.target.value)}
                    required
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <Label htmlFor="carbs">Carbohydrates (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.1"
                    value={formData.carbs_per_100g}
                    onChange={(e) => handleInputChange('carbs_per_100g', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.1"
                    value={formData.protein_per_100g}
                    onChange={(e) => handleInputChange('protein_per_100g', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.1"
                    value={formData.fat_per_100g}
                    onChange={(e) => handleInputChange('fat_per_100g', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <Label htmlFor="sugar">Sugar (g)</Label>
                  <Input
                    id="sugar"
                    type="number"
                    step="0.1"
                    value={formData.sugar_per_100g}
                    onChange={(e) => handleInputChange('sugar_per_100g', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <Label htmlFor="sodium">Sodium (mg)</Label>
                  <Input
                    id="sodium"
                    type="number"
                    step="0.1"
                    value={formData.sodium_per_100g}
                    onChange={(e) => handleInputChange('sodium_per_100g', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>

                <div>
                  <Label htmlFor="fiber">Fiber (g)</Label>
                  <Input
                    id="fiber"
                    type="number"
                    step="0.1"
                    value={formData.fiber_per_100g}
                    onChange={(e) => handleInputChange('fiber_per_100g', e.target.value)}
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {canEdit && (
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
                {servingsLoading ? (
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
                            {serving.is_default && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-text-muted">{serving.grams}g</span>
                        </div>
                        <div className="flex space-x-2">
                          {!serving.is_default && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefault(serving.id)}
                            >
                              Set Default
                            </Button>
                          )}
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
                      <div className="p-4 bg-bg-light rounded-lg space-y-3">
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
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is-default"
                            checked={newServing.is_default}
                            onChange={(e) => setNewServing(prev => ({ ...prev, is_default: e.target.checked }))}
                          />
                          <Label htmlFor="is-default">Set as default serving size</Label>
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
          )}

          {canEdit && (
            <div className="flex space-x-3">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <LoadingEmblem size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>

              <Button 
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <LoadingEmblem size="sm" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          )}

          {!canEdit && (
            <Button 
              type="button"
              onClick={() => navigate(`/log-food/${id}`)}
              className="w-full"
            >
              Add to Food Log
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditFood;