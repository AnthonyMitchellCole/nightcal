import { useState, useRef, useEffect } from 'react';
import { useZxing } from 'react-zxing';
import { Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onResult: (result: string) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onResult, onError, onClose }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(true);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      if (isScanning) {
        setIsScanning(false);
        onResult(result.getText());
      }
    },
    onError(error) {
      console.error('Barcode scanning error:', error);
      const errorName = (error as any)?.name;
      if (errorName === 'NotAllowedError') {
        setHasPermission(false);
        onError('Camera permission denied. Please allow camera access to scan barcodes.');
      } else if (errorName === 'NotFoundError') {
        onError('No camera found on this device.');
      } else {
        onError('Error accessing camera. Please try again.');
      }
    }
  });

  useEffect(() => {
    // Check for camera permissions
    navigator.mediaDevices?.getUserMedia({ video: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false));
  }, []);

  if (hasPermission === false) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-bg text-text p-6">
        <Camera className="w-16 h-16 text-text-muted mb-4" />
        <h3 className="text-lg font-semibold mb-2">Camera Access Required</h3>
        <p className="text-text-muted text-center mb-6">
          Please allow camera access to scan barcodes. You may need to refresh the page and try again.
        </p>
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-full bg-bg">
      {/* Camera View */}
      <video
        ref={ref}
        className="w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40">
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
          <h2 className="text-white font-semibold">Scan Barcode</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scan Frame */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Scan Frame Border */}
            <div className="w-64 h-40 border-2 border-primary rounded-lg relative bg-transparent">
              {/* Corner Highlights */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 border-white rounded-tl"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 border-white rounded-tr"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 border-white rounded-bl"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 border-white rounded-br"></div>
              
              {/* Scanning Line Animation */}
              {isScanning && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary animate-pulse">
                  <div className="w-full h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-slide-in-right"></div>
                </div>
              )}
            </div>
            
            {/* Instruction Text */}
            <p className="text-white text-center mt-4 text-sm">
              Position the barcode within the frame
            </p>
          </div>
        </div>

        {/* Bottom Instructions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-2">
              Hold steady and ensure good lighting
            </p>
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};