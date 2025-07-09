import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Camera, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { QuickAddModal } from "./QuickAddModal";

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFoodModal = ({ isOpen, onClose }: AddFoodModalProps) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleSearchFood = () => {
    onClose();
    navigate('/search-food');
  };

  const handleQuickAdd = () => {
    onClose();
    setShowQuickAdd(true);
  };

  const handleBarcodeScan = () => {
    onClose();
    // TODO: Implement barcode scanning
    console.log('Barcode scanning not yet implemented');
  };

  const options = [
    {
      id: 'search',
      icon: Search,
      title: 'Search Food',
      description: 'Find foods in our database',
      color: 'text-info bg-info/10 border-info/20'
    },
    {
      id: 'scan',
      icon: Camera,
      title: 'Scan Barcode',
      description: 'Use camera to scan product',
      color: 'text-success bg-success/10 border-success/20'
    },
    {
      id: 'quick',
      icon: Zap,
      title: 'Quick Add',
      description: 'Manually enter macros',
      color: 'text-warning bg-warning/10 border-warning/20'
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    switch (optionId) {
      case 'search':
        handleSearchFood();
        break;
      case 'scan':
        handleBarcodeScan();
        break;
      case 'quick':
        handleQuickAdd();
        break;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-bg border-border w-[95vw] max-w-md mx-auto p-6">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-text text-center text-xl">Add Food</DialogTitle>
          </DialogHeader>
          
          <div className="flex gap-1 py-4 -mx-2">
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedOption === option.id;
              
              return (
                <Button
                  key={option.id}
                  variant="ghost"
                  onClick={() => handleOptionSelect(option.id)}
                  className={`flex-1 h-auto p-2 flex flex-col items-center gap-1.5 hover:bg-bg-light border-2 border-transparent transition-all duration-200 min-h-[100px] ${
                    isSelected ? option.color : 'hover:border-border'
                  }`}
                >
                  <div className={`p-1.5 rounded-full ${option.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-center px-0.5">
                    <h3 className="font-medium text-text text-[11px] leading-tight">{option.title}</h3>
                    <p className="text-[9px] text-text-muted mt-0.5 leading-tight">{option.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
          
          <div className="text-center pt-2">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-text-muted hover:text-text"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <QuickAddModal 
        isOpen={showQuickAdd} 
        onClose={() => setShowQuickAdd(false)} 
      />
    </>
  );
};