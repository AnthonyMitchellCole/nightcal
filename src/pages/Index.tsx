import { useState, useEffect } from "react";
import { Plus, Home, FileText, Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MacroProgressCard } from "@/components/nutrition/MacroProgressCard";
import { CalorieSummaryCard } from "@/components/nutrition/CalorieSummaryCard";
import { CustomNutrientCard } from "@/components/nutrition/CustomNutrientCard";
import { FoodPreviewList } from "@/components/nutrition/FoodPreviewList";
import { AddFoodModal } from "@/components/nutrition/AddFoodModal";
import { BottomNavigation } from "@/components/nutrition/BottomNavigation";

const Index = () => {
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // Mock data for demo purposes
  const mockData = {
    macros: {
      carbs: { current: 180, goal: 250 },
      protein: { current: 120, goal: 150 },
      fat: { current: 60, goal: 80 }
    },
    calories: { current: 1482, goal: 2100 },
    customNutrient: { name: "Fiber", current: 25, goal: 35, unit: "g" },
    todaysFoods: [
      { id: 1, name: "Greek Yogurt", calories: 150, meal: "Breakfast", macros: { carbs: 12, protein: 20, fat: 0 } },
      { id: 2, name: "Banana", calories: 105, meal: "Breakfast", macros: { carbs: 27, protein: 1, fat: 0 } },
      { id: 3, name: "Chicken Breast", calories: 231, meal: "Lunch", macros: { carbs: 0, protein: 44, fat: 5 } },
      { id: 4, name: "Brown Rice", calories: 220, meal: "Lunch", macros: { carbs: 45, protein: 5, fat: 2 } }
    ]
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Main Content */}
      <div className="pb-20">
        {/* Top Carousel */}
        <div className="p-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            <MacroProgressCard macros={mockData.macros} />
            <CalorieSummaryCard calories={mockData.calories} />
            <CustomNutrientCard nutrient={mockData.customNutrient} />
          </div>
        </div>

        {/* Food Preview List */}
        <div className="px-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-text">Today's Foods</h2>
            <p className="text-sm text-text-muted">Quick overview of logged items</p>
          </div>
          <FoodPreviewList foods={mockData.todaysFoods} />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onAddFood={() => setIsAddFoodModalOpen(true)}
      />

      {/* Add Food Modal */}
      <AddFoodModal 
        isOpen={isAddFoodModalOpen}
        onClose={() => setIsAddFoodModalOpen(false)}
      />
    </div>
  );
};

export default Index;