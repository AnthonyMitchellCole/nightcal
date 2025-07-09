import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Food = Tables<'foods'>;

export const useBarcodeScanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const searchFoodByBarcode = async (barcode: string): Promise<Food | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .eq('barcode', barcode)
        .maybeSingle();

      if (error) {
        console.error('Error searching for food by barcode:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in searchFoodByBarcode:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleBarcodeResult = async (barcode: string) => {
    try {
      toast({
        title: "Barcode Scanned",
        description: `Searching for product with barcode: ${barcode}`,
      });

      const food = await searchFoodByBarcode(barcode);

      if (food) {
        // Food found - navigate to LogFood page
        toast({
          title: "Product Found!",
          description: `Found ${food.name}. Opening logging page...`,
        });
        navigate(`/log-food/${food.id}?source=barcode`);
      } else {
        // Food not found - navigate to AddFood page with barcode pre-filled
        toast({
          title: "Product Not Found",
          description: "Product not in database. Opening add food form...",
          variant: "destructive",
        });
        navigate(`/add-food?barcode=${encodeURIComponent(barcode)}`);
      }
    } catch (error) {
      console.error('Error handling barcode result:', error);
      toast({
        title: "Error",
        description: "Failed to process barcode. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleScanError = (error: string) => {
    toast({
      title: "Scanning Error",
      description: error,
      variant: "destructive",
    });
  };

  return {
    loading,
    searchFoodByBarcode,
    handleBarcodeResult,
    handleScanError,
  };
};