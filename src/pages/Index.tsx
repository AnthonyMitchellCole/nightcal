import { MacroProgressCard } from "@/components/nutrition/MacroProgressCard";
import { CalorieSummaryCard } from "@/components/nutrition/CalorieSummaryCard";
import { CustomNutrientCard } from "@/components/nutrition/CustomNutrientCard";
import { FavoriteFoodsList } from "@/components/nutrition/FavoriteFoodsList";
import { useDailySummary } from "@/hooks/useFoodLogs";
import { useProfile } from "@/hooks/useProfile";
import { useFavoriteFoods } from "@/hooks/useFavoriteFoods";
import { LoadingEmblem } from "@/components/ui/loading-emblem";
const SUPABASE_URL = "https://ebdtrwkrelzbtjdwuxbk.supabase.co";
const logoUrl = `${SUPABASE_URL}/storage/v1/object/public/branding/nightcal-logo.png`;

const Index = () => {
  const { summary, loading: summaryLoading } = useDailySummary();
  const { profile, loading: profileLoading } = useProfile();
  const { favoriteFoods, loading: favoritesLoading } = useFavoriteFoods();

  const loading = summaryLoading || profileLoading;

  // Default goals if profile not loaded
  const goals = {
    calories: profile?.calorie_goal || 2100,
    carbs: profile?.carb_goal_grams || 250,
    protein: profile?.protein_goal_grams || 150,
    fat: profile?.fat_goal_grams || 80
  };

  const macros = {
    fat: { current: Math.round(summary.fat), goal: goals.fat },
    carbs: { current: Math.round(summary.carbs), goal: goals.carbs },
    protein: { current: Math.round(summary.protein), goal: goals.protein }
  };

  const calories = { 
    current: Math.round(summary.calories), 
    goal: goals.calories 
  };

  // Get custom nutrients from profile preferences
  const customNutrients = (profile?.preferences as any)?.custom_nutrients || {};
  
  const configuredNutrients = [];
  
  if (customNutrients.nutrient_1) {
    configuredNutrients.push({
      name: customNutrients.nutrient_1.name.charAt(0).toUpperCase() + customNutrients.nutrient_1.name.slice(1).replace('_', ' '),
      current: Math.round((summary as any)[customNutrients.nutrient_1.name] || 0),
      goal: customNutrients.nutrient_1.goal,
      unit: customNutrients.nutrient_1.unit
    });
  }

  if (customNutrients.nutrient_2) {
    configuredNutrients.push({
      name: customNutrients.nutrient_2.name.charAt(0).toUpperCase() + customNutrients.nutrient_2.name.slice(1).replace('_', ' '),
      current: Math.round((summary as any)[customNutrients.nutrient_2.name] || 0),
      goal: customNutrients.nutrient_2.goal,
      unit: customNutrients.nutrient_2.unit
    });
  }


  if (loading) {
    return (
      <div className="min-h-screen page-gradient text-text flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <LoadingEmblem />
          <span>Loading your nutrition data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-gradient text-text">
      {/* Header with Logo */}
      <div className="flex justify-center pt-3 px-4">
        <img 
          src={logoUrl} 
          alt="NightCal" 
          className="h-12 w-auto object-contain"
        />
      </div>

      {/* Top Carousel */}
      <div className="w-full my-6">
        <div className="flex overflow-x-auto scrollbar-hide snap-x-mandatory px-4 gap-4 md:justify-center md:px-4">
          <MacroProgressCard macros={macros} />
          <CalorieSummaryCard calories={calories} />
          {configuredNutrients.length > 0 ? (
            <CustomNutrientCard nutrients={configuredNutrients} />
          ) : (
            <CustomNutrientCard 
              nutrients={[]} 
              isPlaceholder={true} 
            />
          )}
        </div>
      </div>

      {/* Favorite Foods List */}
      <div className="px-4 pb-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-text">Favorite Foods</h2>
          <p className="text-sm text-text-muted">
            {favoritesLoading 
              ? "Loading favorites..." 
              : favoriteFoods.length === 0
                ? "No favorite foods yet"
                : `${favoriteFoods.length} favorite food${favoriteFoods.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        <FavoriteFoodsList />
      </div>
    </div>
  );
};

export default Index;