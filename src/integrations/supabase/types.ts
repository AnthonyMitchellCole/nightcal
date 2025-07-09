export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      food_logs: {
        Row: {
          calcium: number | null
          calories: number
          carbs: number
          cholesterol: number | null
          created_at: string
          fat: number
          fiber: number | null
          food_id: string | null
          grams: number
          id: string
          iron: number | null
          log_date: string
          log_time: string
          log_type: string | null
          magnesium: number | null
          meal_id: string
          potassium: number | null
          protein: number
          quantity: number
          quick_add_name: string | null
          saturated_fat: number | null
          serving_size_id: string | null
          sodium: number | null
          sugar: number | null
          trans_fat: number | null
          updated_at: string
          user_id: string
          vitamin_a: number | null
          vitamin_c: number | null
        }
        Insert: {
          calcium?: number | null
          calories: number
          carbs: number
          cholesterol?: number | null
          created_at?: string
          fat: number
          fiber?: number | null
          food_id?: string | null
          grams: number
          id?: string
          iron?: number | null
          log_date: string
          log_time: string
          log_type?: string | null
          magnesium?: number | null
          meal_id: string
          potassium?: number | null
          protein: number
          quantity?: number
          quick_add_name?: string | null
          saturated_fat?: number | null
          serving_size_id?: string | null
          sodium?: number | null
          sugar?: number | null
          trans_fat?: number | null
          updated_at?: string
          user_id: string
          vitamin_a?: number | null
          vitamin_c?: number | null
        }
        Update: {
          calcium?: number | null
          calories?: number
          carbs?: number
          cholesterol?: number | null
          created_at?: string
          fat?: number
          fiber?: number | null
          food_id?: string | null
          grams?: number
          id?: string
          iron?: number | null
          log_date?: string
          log_time?: string
          log_type?: string | null
          magnesium?: number | null
          meal_id?: string
          potassium?: number | null
          protein?: number
          quantity?: number
          quick_add_name?: string | null
          saturated_fat?: number | null
          serving_size_id?: string | null
          sodium?: number | null
          sugar?: number | null
          trans_fat?: number | null
          updated_at?: string
          user_id?: string
          vitamin_a?: number | null
          vitamin_c?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "food_logs_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_logs_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_logs_serving_size_id_fkey"
            columns: ["serving_size_id"]
            isOneToOne: false
            referencedRelation: "serving_sizes"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          barcode: string | null
          brand: string | null
          calcium_per_100g: number | null
          calories_per_100g: number
          carbs_per_100g: number
          category: string | null
          cholesterol_per_100g: number | null
          created_at: string
          created_by: string | null
          fat_per_100g: number
          fiber_per_100g: number | null
          id: string
          image_url: string | null
          iron_per_100g: number | null
          is_custom: boolean | null
          magnesium_per_100g: number | null
          name: string
          potassium_per_100g: number | null
          protein_per_100g: number
          saturated_fat_per_100g: number | null
          sodium_per_100g: number | null
          sugar_per_100g: number | null
          trans_fat_per_100g: number | null
          updated_at: string
          vitamin_a_per_100g: number | null
          vitamin_c_per_100g: number | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          calcium_per_100g?: number | null
          calories_per_100g: number
          carbs_per_100g?: number
          category?: string | null
          cholesterol_per_100g?: number | null
          created_at?: string
          created_by?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number | null
          id?: string
          image_url?: string | null
          iron_per_100g?: number | null
          is_custom?: boolean | null
          magnesium_per_100g?: number | null
          name: string
          potassium_per_100g?: number | null
          protein_per_100g?: number
          saturated_fat_per_100g?: number | null
          sodium_per_100g?: number | null
          sugar_per_100g?: number | null
          trans_fat_per_100g?: number | null
          updated_at?: string
          vitamin_a_per_100g?: number | null
          vitamin_c_per_100g?: number | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          calcium_per_100g?: number | null
          calories_per_100g?: number
          carbs_per_100g?: number
          category?: string | null
          cholesterol_per_100g?: number | null
          created_at?: string
          created_by?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number | null
          id?: string
          image_url?: string | null
          iron_per_100g?: number | null
          is_custom?: boolean | null
          magnesium_per_100g?: number | null
          name?: string
          potassium_per_100g?: number | null
          protein_per_100g?: number
          saturated_fat_per_100g?: number | null
          sodium_per_100g?: number | null
          sugar_per_100g?: number | null
          trans_fat_per_100g?: number | null
          updated_at?: string
          vitamin_a_per_100g?: number | null
          vitamin_c_per_100g?: number | null
        }
        Relationships: []
      }
      meals: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          time_slot_end: string | null
          time_slot_start: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          time_slot_end?: string | null
          time_slot_start?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          time_slot_end?: string | null
          time_slot_start?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          calorie_goal: number | null
          carb_goal_grams: number | null
          carb_goal_percentage: number | null
          created_at: string
          display_name: string | null
          fat_goal_grams: number | null
          fat_goal_percentage: number | null
          goal_type: string | null
          id: string
          preferences: Json | null
          protein_goal_grams: number | null
          protein_goal_percentage: number | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          calorie_goal?: number | null
          carb_goal_grams?: number | null
          carb_goal_percentage?: number | null
          created_at?: string
          display_name?: string | null
          fat_goal_grams?: number | null
          fat_goal_percentage?: number | null
          goal_type?: string | null
          id?: string
          preferences?: Json | null
          protein_goal_grams?: number | null
          protein_goal_percentage?: number | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          calorie_goal?: number | null
          carb_goal_grams?: number | null
          carb_goal_percentage?: number | null
          created_at?: string
          display_name?: string | null
          fat_goal_grams?: number | null
          fat_goal_percentage?: number | null
          goal_type?: string | null
          id?: string
          preferences?: Json | null
          protein_goal_grams?: number | null
          protein_goal_percentage?: number | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      serving_sizes: {
        Row: {
          calcium_per_serving: number | null
          calories_per_serving: number | null
          carbs_per_serving: number | null
          cholesterol_per_serving: number | null
          created_at: string
          fat_per_serving: number | null
          fiber_per_serving: number | null
          food_id: string
          grams: number
          id: string
          iron_per_serving: number | null
          is_default: boolean | null
          magnesium_per_serving: number | null
          name: string
          potassium_per_serving: number | null
          protein_per_serving: number | null
          saturated_fat_per_serving: number | null
          sodium_per_serving: number | null
          sugar_per_serving: number | null
          trans_fat_per_serving: number | null
          vitamin_a_per_serving: number | null
          vitamin_c_per_serving: number | null
        }
        Insert: {
          calcium_per_serving?: number | null
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          cholesterol_per_serving?: number | null
          created_at?: string
          fat_per_serving?: number | null
          fiber_per_serving?: number | null
          food_id: string
          grams: number
          id?: string
          iron_per_serving?: number | null
          is_default?: boolean | null
          magnesium_per_serving?: number | null
          name: string
          potassium_per_serving?: number | null
          protein_per_serving?: number | null
          saturated_fat_per_serving?: number | null
          sodium_per_serving?: number | null
          sugar_per_serving?: number | null
          trans_fat_per_serving?: number | null
          vitamin_a_per_serving?: number | null
          vitamin_c_per_serving?: number | null
        }
        Update: {
          calcium_per_serving?: number | null
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          cholesterol_per_serving?: number | null
          created_at?: string
          fat_per_serving?: number | null
          fiber_per_serving?: number | null
          food_id?: string
          grams?: number
          id?: string
          iron_per_serving?: number | null
          is_default?: boolean | null
          magnesium_per_serving?: number | null
          name?: string
          potassium_per_serving?: number | null
          protein_per_serving?: number | null
          saturated_fat_per_serving?: number | null
          sodium_per_serving?: number | null
          sugar_per_serving?: number | null
          trans_fat_per_serving?: number | null
          vitamin_a_per_serving?: number | null
          vitamin_c_per_serving?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "serving_sizes_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_local_date_string: {
        Args: { input_timestamp?: string }
        Returns: string
      }
      validate_positive_numeric: {
        Args: { value: number; field_name: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
