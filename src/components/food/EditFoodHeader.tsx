import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EditFoodHeaderProps {
  canEdit: boolean;
}

export const EditFoodHeader = ({ canEdit }: EditFoodHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="sticky-header bg-gradient-glass border-b border-glass backdrop-blur-glass shadow-deep p-4">
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
  );
};