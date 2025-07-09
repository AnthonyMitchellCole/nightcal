import { Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingEmblem } from '@/components/ui/loading-emblem';

interface FoodActionButtonsProps {
  canEdit: boolean;
  loading: boolean;
  deleting: boolean;
  onSave: (e: React.FormEvent) => void;
  onDelete: () => void;
  onAddToLog?: () => void;
}

export const FoodActionButtons = ({ 
  canEdit, 
  loading, 
  deleting, 
  onSave, 
  onDelete, 
  onAddToLog 
}: FoodActionButtonsProps) => {
  if (canEdit) {
    return (
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
          onClick={onDelete}
          disabled={deleting}
        >
          {deleting ? (
            <LoadingEmblem size="sm" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <Button 
      type="button"
      onClick={onAddToLog}
      className="w-full"
    >
      Add to Food Log
    </Button>
  );
};