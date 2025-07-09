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
          calories: number
          carbs: number
          created_at: string
          fat: number
          fiber: number | null
          food_id: string | null
          grams: number
          id: string
          log_date: string
          log_time: string
          log_type: string | null
          meal_id: string
          protein: number
          quantity: number
          quick_add_name: string | null
          serving_size_id: string | null
          sodium: number | null
          sugar: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          calories: number
          carbs: number
          created_at?: string
          fat: number
          fiber?: number | null
          food_id?: string | null
          grams: number
          id?: string
          log_date?: string
          log_time?: string
          log_type?: string | null
          meal_id: string
          protein: number
          quantity?: number
          quick_add_name?: string | null
          serving_size_id?: string | null
          sodium?: number | null
          sugar?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          calories?: number
          carbs?: number
          created_at?: string
          fat?: number
          fiber?: number | null
          food_id?: string | null
          grams?: number
          id?: string
          log_date?: string
          log_time?: string
          log_type?: string | null
          meal_id?: string
          protein?: number
          quantity?: number
          quick_add_name?: string | null
          serving_size_id?: string | null
          sodium?: number | null
          sugar?: number | null
          updated_at?: string
          user_id?: string
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
          calories_per_100g: number
          carbs_per_100g: number
          category: string | null
          created_at: string
          created_by: string | null
          fat_per_100g: number
          fiber_per_100g: number | null
          id: string
          image_url: string | null
          is_custom: boolean | null
          name: string
          protein_per_100g: number
          sodium_per_100g: number | null
          sugar_per_100g: number | null
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          calories_per_100g: number
          carbs_per_100g?: number
          category?: string | null
          created_at?: string
          created_by?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number | null
          id?: string
          image_url?: string | null
          is_custom?: boolean | null
          name: string
          protein_per_100g?: number
          sodium_per_100g?: number | null
          sugar_per_100g?: number | null
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          calories_per_100g?: number
          carbs_per_100g?: number
          category?: string | null
          created_at?: string
          created_by?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number | null
          id?: string
          image_url?: string | null
          is_custom?: boolean | null
          name?: string
          protein_per_100g?: number
          sodium_per_100g?: number | null
          sugar_per_100g?: number | null
          updated_at?: string
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
          calories_per_serving: number | null
          carbs_per_serving: number | null
          created_at: string
          fat_per_serving: number | null
          fiber_per_serving: number | null
          food_id: string
          grams: number
          id: string
          is_default: boolean | null
          name: string
          protein_per_serving: number | null
          sodium_per_serving: number | null
          sugar_per_serving: number | null
        }
        Insert: {
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          created_at?: string
          fat_per_serving?: number | null
          fiber_per_serving?: number | null
          food_id: string
          grams: number
          id?: string
          is_default?: boolean | null
          name: string
          protein_per_serving?: number | null
          sodium_per_serving?: number | null
          sugar_per_serving?: number | null
        }
        Update: {
          calories_per_serving?: number | null
          carbs_per_serving?: number | null
          created_at?: string
          fat_per_serving?: number | null
          fiber_per_serving?: number | null
          food_id?: string
          grams?: number
          id?: string
          is_default?: boolean | null
          name?: string
          protein_per_serving?: number | null
          sodium_per_serving?: number | null
          sugar_per_serving?: number | null
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
      [_ in never]: never
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
