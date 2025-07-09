export const calculatePer100g = (servingNutrition: {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  sugar?: number;
  sodium?: number;
  fiber?: number;
  saturated_fat?: number;
  trans_fat?: number;
  cholesterol?: number;
  vitamin_a?: number;
  vitamin_c?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  magnesium?: number;
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
    saturated_fat_per_100g: servingNutrition.saturated_fat ? +(servingNutrition.saturated_fat * multiplier).toFixed(1) : null,
    trans_fat_per_100g: servingNutrition.trans_fat ? +(servingNutrition.trans_fat * multiplier).toFixed(1) : null,
    cholesterol_per_100g: servingNutrition.cholesterol ? +(servingNutrition.cholesterol * multiplier).toFixed(1) : null,
    vitamin_a_per_100g: servingNutrition.vitamin_a ? +(servingNutrition.vitamin_a * multiplier).toFixed(1) : null,
    vitamin_c_per_100g: servingNutrition.vitamin_c ? +(servingNutrition.vitamin_c * multiplier).toFixed(1) : null,
    calcium_per_100g: servingNutrition.calcium ? +(servingNutrition.calcium * multiplier).toFixed(1) : null,
    iron_per_100g: servingNutrition.iron ? +(servingNutrition.iron * multiplier).toFixed(1) : null,
    potassium_per_100g: servingNutrition.potassium ? +(servingNutrition.potassium * multiplier).toFixed(1) : null,
    magnesium_per_100g: servingNutrition.magnesium ? +(servingNutrition.magnesium * multiplier).toFixed(1) : null,
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
  saturated_fat_per_100g?: number;
  trans_fat_per_100g?: number;
  cholesterol_per_100g?: number;
  vitamin_a_per_100g?: number;
  vitamin_c_per_100g?: number;
  calcium_per_100g?: number;
  iron_per_100g?: number;
  potassium_per_100g?: number;
  magnesium_per_100g?: number;
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
    saturated_fat: per100gNutrition.saturated_fat_per_100g ? +(per100gNutrition.saturated_fat_per_100g * multiplier).toFixed(1) : null,
    trans_fat: per100gNutrition.trans_fat_per_100g ? +(per100gNutrition.trans_fat_per_100g * multiplier).toFixed(1) : null,
    cholesterol: per100gNutrition.cholesterol_per_100g ? +(per100gNutrition.cholesterol_per_100g * multiplier).toFixed(1) : null,
    vitamin_a: per100gNutrition.vitamin_a_per_100g ? +(per100gNutrition.vitamin_a_per_100g * multiplier).toFixed(1) : null,
    vitamin_c: per100gNutrition.vitamin_c_per_100g ? +(per100gNutrition.vitamin_c_per_100g * multiplier).toFixed(1) : null,
    calcium: per100gNutrition.calcium_per_100g ? +(per100gNutrition.calcium_per_100g * multiplier).toFixed(1) : null,
    iron: per100gNutrition.iron_per_100g ? +(per100gNutrition.iron_per_100g * multiplier).toFixed(1) : null,
    potassium: per100gNutrition.potassium_per_100g ? +(per100gNutrition.potassium_per_100g * multiplier).toFixed(1) : null,
    magnesium: per100gNutrition.magnesium_per_100g ? +(per100gNutrition.magnesium_per_100g * multiplier).toFixed(1) : null,
  };
};