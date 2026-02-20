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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      career_paths: {
        Row: {
          avg_salary_max: number | null
          avg_salary_min: number | null
          category: string
          created_at: string
          description: string | null
          growth_outlook: string | null
          id: string
          related_courses: string[] | null
          required_degree: string | null
          required_stream: string | null
          skills_required: string[] | null
          title: string
        }
        Insert: {
          avg_salary_max?: number | null
          avg_salary_min?: number | null
          category: string
          created_at?: string
          description?: string | null
          growth_outlook?: string | null
          id?: string
          related_courses?: string[] | null
          required_degree?: string | null
          required_stream?: string | null
          skills_required?: string[] | null
          title: string
        }
        Update: {
          avg_salary_max?: number | null
          avg_salary_min?: number | null
          category?: string
          created_at?: string
          description?: string | null
          growth_outlook?: string | null
          id?: string
          related_courses?: string[] | null
          required_degree?: string | null
          required_stream?: string | null
          skills_required?: string[] | null
          title?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      colleges: {
        Row: {
          address: string | null
          area: string | null
          city: string
          created_at: string
          description: string | null
          email: string | null
          established_year: number | null
          id: string
          image_url: string | null
          name: string
          phone: string | null
          state: string | null
          type: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          area?: string | null
          city: string
          created_at?: string
          description?: string | null
          email?: string | null
          established_year?: number | null
          id?: string
          image_url?: string | null
          name: string
          phone?: string | null
          state?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          area?: string | null
          city?: string
          created_at?: string
          description?: string | null
          email?: string | null
          established_year?: number | null
          id?: string
          image_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          city: string
          company_size: string | null
          created_at: string
          description: string | null
          email: string | null
          founded_year: number | null
          id: string
          industry: string
          logo_url: string | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city: string
          company_size?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          founded_year?: number | null
          id?: string
          industry: string
          logo_url?: string | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          company_size?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          founded_year?: number | null
          id?: string
          industry?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          college_id: string | null
          created_at: string
          cutoff_general: number | null
          cutoff_obc: number | null
          cutoff_sc_st: number | null
          degree_level: string
          description: string | null
          duration_years: number | null
          fees_per_year: number | null
          future_scope: string | null
          id: string
          name: string
          seats: number | null
          stream: string | null
        }
        Insert: {
          college_id?: string | null
          created_at?: string
          cutoff_general?: number | null
          cutoff_obc?: number | null
          cutoff_sc_st?: number | null
          degree_level: string
          description?: string | null
          duration_years?: number | null
          fees_per_year?: number | null
          future_scope?: string | null
          id?: string
          name: string
          seats?: number | null
          stream?: string | null
        }
        Update: {
          college_id?: string | null
          created_at?: string
          cutoff_general?: number | null
          cutoff_obc?: number | null
          cutoff_sc_st?: number | null
          degree_level?: string
          description?: string | null
          duration_years?: number | null
          fees_per_year?: number | null
          future_scope?: string | null
          id?: string
          name?: string
          seats?: number | null
          stream?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      job_roles: {
        Row: {
          career_path_id: string | null
          company_id: string | null
          created_at: string
          description: string | null
          experience_max: number | null
          experience_min: number | null
          id: string
          is_internship: boolean | null
          required_degree: string | null
          required_stream: string | null
          salary_max: number | null
          salary_min: number | null
          skills_required: string[] | null
          title: string
        }
        Insert: {
          career_path_id?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          experience_max?: number | null
          experience_min?: number | null
          id?: string
          is_internship?: boolean | null
          required_degree?: string | null
          required_stream?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills_required?: string[] | null
          title: string
        }
        Update: {
          career_path_id?: string | null
          company_id?: string | null
          created_at?: string
          description?: string | null
          experience_max?: number | null
          experience_min?: number | null
          id?: string
          is_internship?: boolean | null
          required_degree?: string | null
          required_stream?: string | null
          salary_max?: number | null
          salary_min?: number | null
          skills_required?: string[] | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_roles_career_path_id_fkey"
            columns: ["career_path_id"]
            isOneToOne: false
            referencedRelation: "career_paths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          student_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          student_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          student_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      student_assessments: {
        Row: {
          created_at: string
          id: string
          interests: string[] | null
          marks_percentage: number | null
          preferred_city: string | null
          skills: string[] | null
          stream: string | null
          student_level: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interests?: string[] | null
          marks_percentage?: number | null
          preferred_city?: string | null
          skills?: string[] | null
          stream?: string | null
          student_level: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interests?: string[] | null
          marks_percentage?: number | null
          preferred_city?: string | null
          skills?: string[] | null
          stream?: string | null
          student_level?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student"
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
    Enums: {
      app_role: ["admin", "student"],
    },
  },
} as const
