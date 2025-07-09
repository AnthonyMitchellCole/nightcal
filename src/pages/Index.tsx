import { useState } from "react";
import { MacroProgressCard } from "@/components/nutrition/MacroProgressCard";
import { CalorieSummaryCard } from "@/components/nutrition/CalorieSummaryCard";
import { CustomNutrientCard } from "@/components/nutrition/CustomNutrientCard";
import { FoodPreviewList } from "@/components/nutrition/FoodPreviewList";
import { AddFoodModal } from "@/components/nutrition/AddFoodModal";
import { BottomNavigation } from "@/components/nutrition/BottomNavigation";
import { useDailySummary, useFoodLogs } from "@/hooks/useFoodLogs";
import { useProfile } from "@/hooks/useProfile";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const { summary, loading: summaryLoading } = useDailySummary();
  const { foodLogs, loading: logsLoading } = useFoodLogs();
  const { profile, loading: profileLoading } = useProfile();

  const loading = summaryLoading || logsLoading || profileLoading;

  // Default goals if profile not loaded
  const goals = {
    calories: profile?.calorie_goal || 2100,
    carbs: profile?.carb_goal_grams || 250,
    protein: profile?.protein_goal_grams || 150,
    fat: profile?.fat_goal_grams || 80
  };

  const macros = {
    carbs: { current: Math.round(summary.carbs), goal: goals.carbs },
    protein: { current: Math.round(summary.protein), goal: goals.protein },
    fat: { current: Math.round(summary.fat), goal: goals.fat }
  };

  const calories = { 
    current: Math.round(summary.calories), 
    goal: goals.calories 
  };

  const customNutrient = { 
    name: "Fiber", 
    current: Math.round(summary.fiber), 
    goal: 35, 
    unit: "g" 
  };

  // Transform food logs for FoodPreviewList
  const todaysFoods = foodLogs.map(log => ({
    id: log.id,
    name: log.foods.name,
    calories: log.calories,
    meal: log.meals.name,
    macros: {
      carbs: Math.round(log.carbs),
      protein: Math.round(log.protein),
      fat: Math.round(log.fat)
    }
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your nutrition data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Main Content */}
      <div className="pb-20">
        {/* Top Carousel */}
        <div className="w-full my-6">
          <div className="flex overflow-x-auto scrollbar-hide snap-x-mandatory px-4 gap-4 md:justify-center md:px-4">
            <MacroProgressCard macros={macros} />
            <CalorieSummaryCard calories={calories} />
            <CustomNutrientCard nutrient={customNutrient} />
          </div>
        </div>

        {/* Food Preview List */}
        <div className="px-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-text">Today's Foods</h2>
            <p className="text-sm text-text-muted">
              {todaysFoods.length === 0 
                ? "No foods logged yet today" 
                : `${todaysFoods.length} item${todaysFoods.length !== 1 ? 's' : ''} logged`
              }
            </p>
          </div>
          <FoodPreviewList foods={todaysFoods} />
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