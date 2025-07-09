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
import { BarcodeScannerModal } from "@/components/barcode/BarcodeScannerModal";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";

interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddFoodModal = ({ isOpen, onClose }: AddFoodModalProps) => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const { handleBarcodeResult, handleScanError } = useBarcodeScanner();

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
    setShowBarcodeScanner(true);
  };

  const handleBarcodeSuccess = (barcode: string) => {
    setShowBarcodeScanner(false);
    handleBarcodeResult(barcode);
  };

  const handleBarcodeError = (error: string) => {
    handleScanError(error);
  };

  const handleBarcodeScannerClose = () => {
    setShowBarcodeScanner(false);
  };

  const options = [
    {
      id: 'search',
      icon: Search,
      title: 'Search Food',
      color: 'text-info bg-info/10 border-info/20'
    },
    {
      id: 'scan',
      icon: Camera,
      title: 'Scan Barcode',
      color: 'text-success bg-success/10 border-success/20'
    },
    {
      id: 'quick',
      icon: Zap,
      title: 'Quick Add',
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
        <DialogContent className="bg-bg border-border w-[95vw] max-w-md mx-auto p-6 fixed left-1/2 top-[70%] transform -translate-x-1/2 -translate-y-1/2">
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
                  className={`flex-1 h-auto p-4 flex flex-col items-center gap-3 hover:bg-bg-light border-2 border-transparent transition-all duration-200 min-h-[120px] ${
                    isSelected ? option.color : 'hover:border-border'
                  }`}
                >
                  <div className={`p-3 rounded-full ${option.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-medium text-text text-sm leading-tight">{option.title}</h3>
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

      <BarcodeScannerModal
        isOpen={showBarcodeScanner}
        onClose={handleBarcodeScannerClose}
        onResult={handleBarcodeSuccess}
        onError={handleBarcodeError}
      />
    </>
  );
};