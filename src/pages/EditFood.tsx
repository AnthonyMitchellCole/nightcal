import { useNavigate, useParams } from 'react-router-dom';
import { LoadingEmblem } from '@/components/ui/loading-emblem';
import { EditFoodHeader } from '@/components/food/EditFoodHeader';
import { EditFoodContent } from '@/components/food/EditFoodContent';
import { useEditFood } from '@/hooks/useEditFood';

const EditFood = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    loading,
    deleting,
    fetchLoading,
    canEdit,
    defaultServing,
    formData,
    handleInputChange,
    handleServingNutritionChange,
    handleSubmit,
    handleDelete
  } = useEditFood(id);

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <LoadingEmblem size="lg" />
      </div>
    );
  }

  if (!id) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <EditFoodHeader canEdit={canEdit} />
      
      <EditFoodContent
        foodId={id}
        canEdit={canEdit}
        formData={formData}
        defaultServing={defaultServing}
        loading={loading}
        deleting={deleting}
        onInputChange={handleInputChange}
        onServingNutritionChange={handleServingNutritionChange}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        onAddToLog={() => navigate(`/log-food/${id}`)}
      />
    </div>
  );
};

export default EditFood;