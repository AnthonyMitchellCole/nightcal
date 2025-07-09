export const calculatePer100g = (servingNutrition: {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar?: number;
  sodium?: number;
  fiber?: number;
}, servingGrams: number) => {
  const multiplier = 100 / servingGrams;
  
  return {
    calories_per_100g: Math.round(servingNutrition.calories * multiplier),
    carbs_per_100g: +(servingNutrition.carbs * multiplier).toFixed(1),
    protein_per_100g: +(servingNutrition.protein * multiplier).toFixed(1),
    fat_per_100g: +(servingNutrition.fat * multiplier).toFixed(1),
    sugar_per_100g: servingNutrition.sugar ? +(servingNutrition.sugar * multiplier).toFixed(1) : null,
    sodium_per_100g: servingNutrition.sodium ? +(servingNutrition.sodium * multiplier).toFixed(1) : null,
    fiber_per_100g: servingNutrition.fiber ? +(servingNutrition.fiber * multiplier).toFixed(1) : null,
  };
};

export const calculatePerServing = (per100gNutrition: {
  calories_per_100g: number;
  carbs_per_100g: number;
  protein_per_100g: number;
  fat_per_100g: number;
  sugar_per_100g?: number;
  sodium_per_100g?: number;
  fiber_per_100g?: number;
}, servingGrams: number) => {
  const multiplier = servingGrams / 100;
  
  return {
    calories: +(per100gNutrition.calories_per_100g * multiplier).toFixed(1),
    carbs: +(per100gNutrition.carbs_per_100g * multiplier).toFixed(1),
    protein: +(per100gNutrition.protein_per_100g * multiplier).toFixed(1),
    fat: +(per100gNutrition.fat_per_100g * multiplier).toFixed(1),
    sugar: per100gNutrition.sugar_per_100g ? +(per100gNutrition.sugar_per_100g * multiplier).toFixed(1) : null,
    sodium: per100gNutrition.sodium_per_100g ? +(per100gNutrition.sodium_per_100g * multiplier).toFixed(1) : null,
    fiber: per100gNutrition.fiber_per_100g ? +(per100gNutrition.fiber_per_100g * multiplier).toFixed(1) : null,
  };
};