export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      animals: {
        Row: {
          activity_level: number | null
          age_months: number | null
          breed: string | null
          cage: string | null
          created_at: string | null
          description: Json | null
          gender: string | null
          good_with_animals: boolean | null
          good_with_children: boolean | null
          grooming_level: number | null
          handling_tolerance: number | null
          id: string
          images: string[] | null
          independence_level: number | null
          is_hypoallergenic: boolean | null
          is_neutered: boolean | null
          name: string
          needs_outdoor: boolean | null
          personality: string | null
          shedding_level: number | null
          size: string | null
          space_needed: string | null
          species: string
          status: string | null
        }
        Insert: {
          activity_level?: number | null
          age_months?: number | null
          breed?: string | null
          cage?: string | null
          created_at?: string | null
          description?: Json | null
          gender?: string | null
          good_with_animals?: boolean | null
          good_with_children?: boolean | null
          grooming_level?: number | null
          handling_tolerance?: number | null
          id?: string
          images?: string[] | null
          independence_level?: number | null
          is_hypoallergenic?: boolean | null
          is_neutered?: boolean | null
          name: string
          needs_outdoor?: boolean | null
          personality?: string | null
          shedding_level?: number | null
          size?: string | null
          space_needed?: string | null
          species: string
          status?: string | null
        }
        Update: {
          activity_level?: number | null
          age_months?: number | null
          breed?: string | null
          cage?: string | null
          created_at?: string | null
          description?: Json | null
          gender?: string | null
          good_with_animals?: boolean | null
          good_with_children?: boolean | null
          grooming_level?: number | null
          handling_tolerance?: number | null
          id?: string
          images?: string[] | null
          independence_level?: number | null
          is_hypoallergenic?: boolean | null
          is_neutered?: boolean | null
          name?: string
          needs_outdoor?: boolean | null
          personality?: string | null
          shedding_level?: number | null
          size?: string | null
          space_needed?: string | null
          species?: string
          status?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          animal_id: string | null
          created_at: string | null
          created_by: string | null
          guest_id: string
          id: string
          meeting_type: string | null
          notes: string | null
          status: string | null
          timeslot_id: string
        }
        Insert: {
          animal_id?: string | null
          created_at?: string | null
          created_by?: string | null
          guest_id: string
          id?: string
          meeting_type?: string | null
          notes?: string | null
          status?: string | null
          timeslot_id: string
        }
        Update: {
          animal_id?: string | null
          created_at?: string | null
          created_by?: string | null
          guest_id?: string
          id?: string
          meeting_type?: string | null
          notes?: string | null
          status?: string | null
          timeslot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_timeslot_id_fkey"
            columns: ["timeslot_id"]
            isOneToOne: false
            referencedRelation: "timeslots"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone: string | null
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          phone?: string | null
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guests_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      timeslots: {
        Row: {
          capacity: number | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          starts_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          starts_at: string
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          starts_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      animals_overview: {
        Row: {
          activity_level: number | null
          age_months: number | null
          breed: string | null
          cage: string | null
          created_at: string | null
          description: Json | null
          gender: string | null
          good_with_animals: boolean | null
          good_with_children: boolean | null
          grooming_level: number | null
          handling_tolerance: number | null
          id: string | null
          images: string[] | null
          independence_level: number | null
          is_hypoallergenic: boolean | null
          is_neutered: boolean | null
          name: string | null
          needs_outdoor: boolean | null
          next_booking_at: string | null
          personality: string | null
          shedding_level: number | null
          size: string | null
          space_needed: string | null
          species: string | null
          status: string | null
          total_bookings: number | null
        }
        Relationships: []
      }
      bookings_with_details: {
        Row: {
          animal_cage: string | null
          animal_id: string | null
          animal_name: string | null
          animal_species: string | null
          capacity: number | null
          created_at: string | null
          duration_minutes: number | null
          guest_id: string | null
          id: string | null
          meeting_type: string | null
          notes: string | null
          slot_bookings: number | null
          starts_at: string | null
          status: string | null
          timeslot_id: string | null
          user_email: string | null
          user_name: string | null
          user_phone: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals_overview"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_timeslot_id_fkey"
            columns: ["timeslot_id"]
            isOneToOne: false
            referencedRelation: "timeslots"
            referencedColumns: ["id"]
          },
        ]
      }
      todays_bookings: {
        Row: {
          animal_id: string | null
          animal_name: string | null
          animal_species: string | null
          capacity: number | null
          created_at: string | null
          duration_minutes: number | null
          id: string | null
          meeting_type: string | null
          notes: string | null
          slot_bookings: number | null
          starts_at: string | null
          status: string | null
          user_email: string | null
          user_name: string | null
          user_phone: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals_overview"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_slots_for_month: {
        Args: { target_month: string }
        Returns: undefined
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
