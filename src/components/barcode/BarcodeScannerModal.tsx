import { Dialog, DialogContent } from '@/components/ui/dialog';
import { BarcodeScanner } from './BarcodeScanner';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (barcode: string) => void;
  onError: (error: string) => void;
}

export const BarcodeScannerModal = ({ 
  isOpen, 
  onClose, 
  onResult, 
  onError 
}: BarcodeScannerModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-full h-screen w-screen border-0 bg-transparent">
        <BarcodeScanner
          onResult={onResult}
          onError={onError}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};