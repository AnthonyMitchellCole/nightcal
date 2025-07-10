import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface USDANutrient {
  nutrientId: number;
  nutrientName: string;
  value: number;
  unitName: string;
}

interface USDAFood {
  fdcId: number;
  description: string;
  brandOwner?: string;
  foodNutrients: USDANutrient[];
  dataType: string;
}

interface USDASearchResponse {
  foods: USDAFood[];
  totalHits: number;
}

// Nutrient ID mappings from USDA to our fields
const NUTRIENT_MAPPINGS: Record<number, string> = {
  1008: 'calories', // Energy (kcal)
  1003: 'protein', // Protein
  1005: 'carbs', // Carbohydrate, by difference  
  1004: 'fat', // Total lipid (fat)
  1079: 'fiber', // Fiber, total dietary
  1093: 'sodium', // Sodium, Na
  2000: 'sugar', // Sugars, total including NLEA
  1258: 'saturated_fat', // Fatty acids, total saturated
  1257: 'trans_fat', // Fatty acids, total trans
  1253: 'cholesterol', // Cholesterol
  1087: 'calcium', // Calcium, Ca
  1089: 'iron', // Iron, Fe
  1090: 'magnesium', // Magnesium, Mg
  1092: 'potassium', // Potassium, K
  1106: 'vitamin_a', // Vitamin A, RAE
  1162: 'vitamin_c', // Vitamin C, total ascorbic acid
};

function transformUSDAFood(usdaFood: USDAFood) {
  const nutrition: Record<string, number> = {};
  
  // Initialize all nutrition fields to 0
  Object.values(NUTRIENT_MAPPINGS).forEach(field => {
    nutrition[field] = 0;
  });
  
  // Map USDA nutrients to our fields
  usdaFood.foodNutrients.forEach(nutrient => {
    const fieldName = NUTRIENT_MAPPINGS[nutrient.nutrientId];
    if (fieldName && nutrient.value !== undefined) {
      let value = nutrient.value;
      
      // Convert mg to g for certain nutrients
      if (['sodium', 'calcium', 'iron', 'magnesium', 'potassium', 'vitamin_c'].includes(fieldName)) {
        value = value / 1000; // mg to g
      }
      
      // Convert mcg to g for vitamin A
      if (fieldName === 'vitamin_a') {
        value = value / 1000000; // mcg to g
      }
      
      nutrition[fieldName] = Math.round(value * 100) / 100; // Round to 2 decimal places
    }
  });
  
  return {
    fdcId: usdaFood.fdcId,
    name: usdaFood.description,
    brand: usdaFood.brandOwner || 'USDA',
    dataType: usdaFood.dataType,
    nutrition
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, pageSize = 20, pageNumber = 1 } = await req.json();
    
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('USDA_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'USDA API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const url = new URL('https://api.nal.usda.gov/fdc/v1/foods/search');
    url.searchParams.append('api_key', apiKey);
    url.searchParams.append('query', query);
    url.searchParams.append('pageSize', pageSize.toString());
    url.searchParams.append('pageNumber', pageNumber.toString());
    url.searchParams.append('dataType', 'Foundation,SR Legacy,Survey (FNDDS)');
    
    console.log(`Searching USDA API for: ${query}`);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      console.error(`USDA API error: ${response.status} ${response.statusText}`);
      return new Response(JSON.stringify({ error: 'USDA API request failed' }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data: USDASearchResponse = await response.json();
    
    // Transform USDA foods to our format
    const transformedFoods = data.foods.map(transformUSDAFood);
    
    console.log(`Found ${transformedFoods.length} foods from USDA API`);
    
    return new Response(JSON.stringify({
      foods: transformedFoods,
      totalHits: data.totalHits,
      query,
      pageNumber,
      pageSize
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in usda-food-search function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});