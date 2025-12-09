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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string
          id: string
          metadata: Json | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      auth_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount: number
          created_at: string
          designer_id: string
          id: string
          product_id: string | null
          revenue_share_percent: number
        }
        Insert: {
          amount?: number
          created_at?: string
          designer_id: string
          id?: string
          product_id?: string | null
          revenue_share_percent?: number
        }
        Update: {
          amount?: number
          created_at?: string
          designer_id?: string
          id?: string
          product_id?: string | null
          revenue_share_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "earnings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_at: string
          designer_id: string
          id: string
          job_id: string
          status: Database["public"]["Enums"]["job_application_status"]
        }
        Insert: {
          applied_at?: string
          designer_id: string
          id?: string
          job_id: string
          status?: Database["public"]["Enums"]["job_application_status"]
        }
        Update: {
          applied_at?: string
          designer_id?: string
          id?: string
          job_id?: string
          status?: Database["public"]["Enums"]["job_application_status"]
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          category: Database["public"]["Enums"]["designer_category"] | null
          created_at: string
          description: string | null
          id: string
          posted_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["designer_category"] | null
          created_at?: string
          description?: string | null
          id?: string
          posted_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["designer_category"] | null
          created_at?: string
          description?: string | null
          id?: string
          posted_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_products: {
        Row: {
          created_at: string
          description: string | null
          designer_id: string
          id: string
          images: Json | null
          inventory_count: number | null
          portfolio_publication_id: string | null
          price: number
          rank_visibility_score: number | null
          status: Database["public"]["Enums"]["product_status"]
          title: string
          updated_at: string
          variants: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          designer_id: string
          id?: string
          images?: Json | null
          inventory_count?: number | null
          portfolio_publication_id?: string | null
          price?: number
          rank_visibility_score?: number | null
          status?: Database["public"]["Enums"]["product_status"]
          title: string
          updated_at?: string
          variants?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          designer_id?: string
          id?: string
          images?: Json | null
          inventory_count?: number | null
          portfolio_publication_id?: string | null
          price?: number
          rank_visibility_score?: number | null
          status?: Database["public"]["Enums"]["product_status"]
          title?: string
          updated_at?: string
          variants?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_products_portfolio_publication_id_fkey"
            columns: ["portfolio_publication_id"]
            isOneToOne: false
            referencedRelation: "portfolio_publications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          status: Database["public"]["Enums"]["notification_status"]
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: Database["public"]["Enums"]["notification_status"]
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: Database["public"]["Enums"]["notification_status"]
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount: number
          designer_id: string
          id: string
          processed_at: string | null
          status: Database["public"]["Enums"]["payout_status"]
        }
        Insert: {
          amount?: number
          designer_id: string
          id?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
        }
        Update: {
          amount?: number
          designer_id?: string
          id?: string
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
        }
        Relationships: []
      }
      portfolio_publications: {
        Row: {
          id: string
          portfolio_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: Database["public"]["Enums"]["publication_status"]
          submitted_at: string
        }
        Insert: {
          id?: string
          portfolio_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["publication_status"]
          submitted_at?: string
        }
        Update: {
          id?: string
          portfolio_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: Database["public"]["Enums"]["publication_status"]
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_publications_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string
          description: string | null
          designer_id: string
          id: string
          items: Json | null
          pdf_exported: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          designer_id: string
          id?: string
          items?: Json | null
          pdf_exported?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          designer_id?: string
          id?: string
          items?: Json | null
          pdf_exported?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_sales: {
        Row: {
          designer_share: number
          id: string
          product_id: string
          quantity_sold: number
          sale_date: string
          total_revenue: number
        }
        Insert: {
          designer_share?: number
          id?: string
          product_id: string
          quantity_sold?: number
          sale_date?: string
          total_revenue?: number
        }
        Update: {
          designer_share?: number
          id?: string
          product_id?: string
          quantity_sold?: number
          sale_date?: string
          total_revenue?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          category: Database["public"]["Enums"]["designer_category"] | null
          created_at: string
          email: string | null
          id: string
          name: string | null
          rank_id: string | null
          status: Database["public"]["Enums"]["user_status"] | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string
          user_id: string
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          category?: Database["public"]["Enums"]["designer_category"] | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          rank_id?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          user_id: string
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          category?: Database["public"]["Enums"]["designer_category"] | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          rank_id?: string | null
          status?: Database["public"]["Enums"]["user_status"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          user_id?: string
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_rank_id_fkey"
            columns: ["rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
        ]
      }
      ranks: {
        Row: {
          created_at: string
          id: string
          name: string
          priority_queue: boolean
          rank_order: number
          requirements: Json | null
          revenue_share_percent: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          priority_queue?: boolean
          rank_order?: number
          requirements?: Json | null
          revenue_share_percent?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          priority_queue?: boolean
          rank_order?: number
          requirements?: Json | null
          revenue_share_percent?: number
          updated_at?: string
        }
        Relationships: []
      }
      stylebox_submissions: {
        Row: {
          description: string | null
          designer_id: string
          id: string
          reviewed_at: string | null
          score: number | null
          status: Database["public"]["Enums"]["submission_status"]
          stylebox_id: string
          submission_files: Json | null
          submitted_at: string
        }
        Insert: {
          description?: string | null
          designer_id: string
          id?: string
          reviewed_at?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["submission_status"]
          stylebox_id: string
          submission_files?: Json | null
          submitted_at?: string
        }
        Update: {
          description?: string | null
          designer_id?: string
          id?: string
          reviewed_at?: string | null
          score?: number | null
          status?: Database["public"]["Enums"]["submission_status"]
          stylebox_id?: string
          submission_files?: Json | null
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stylebox_submissions_stylebox_id_fkey"
            columns: ["stylebox_id"]
            isOneToOne: false
            referencedRelation: "styleboxes"
            referencedColumns: ["id"]
          },
        ]
      }
      styleboxes: {
        Row: {
          brief: Json | null
          category: Database["public"]["Enums"]["designer_category"]
          created_at: string
          created_by: string | null
          deliverables: Json | null
          description: string | null
          difficulty: Database["public"]["Enums"]["stylebox_difficulty"]
          id: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          xp_reward: number | null
        }
        Insert: {
          brief?: Json | null
          category?: Database["public"]["Enums"]["designer_category"]
          created_at?: string
          created_by?: string | null
          deliverables?: Json | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["stylebox_difficulty"]
          id?: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          xp_reward?: number | null
        }
        Update: {
          brief?: Json | null
          category?: Database["public"]["Enums"]["designer_category"]
          created_at?: string
          created_by?: string | null
          deliverables?: Json | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["stylebox_difficulty"]
          id?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["team_role"]
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          category: Database["public"]["Enums"]["designer_category"] | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["designer_category"] | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["designer_category"] | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_name: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_name: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_name?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      app_role: "admin" | "superadmin"
      content_status: "draft" | "active" | "archived"
      designer_category: "fashion" | "textile" | "jewelry"
      job_application_status: "applied" | "shortlisted" | "rejected" | "hired"
      notification_status: "unread" | "read"
      notification_type: "submission" | "earnings" | "portfolio" | "marketplace"
      payout_status: "pending" | "processed" | "paid"
      product_status: "draft" | "live" | "archived"
      publication_status: "pending" | "approved" | "rejected" | "published"
      stylebox_difficulty: "free" | "easy" | "medium" | "hard" | "insane"
      submission_status: "submitted" | "approved" | "rejected"
      subscription_tier: "basic" | "pro" | "elite"
      team_role: "member" | "lead"
      user_status: "active" | "suspended" | "inactive"
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
      app_role: ["admin", "superadmin"],
      content_status: ["draft", "active", "archived"],
      designer_category: ["fashion", "textile", "jewelry"],
      job_application_status: ["applied", "shortlisted", "rejected", "hired"],
      notification_status: ["unread", "read"],
      notification_type: ["submission", "earnings", "portfolio", "marketplace"],
      payout_status: ["pending", "processed", "paid"],
      product_status: ["draft", "live", "archived"],
      publication_status: ["pending", "approved", "rejected", "published"],
      stylebox_difficulty: ["free", "easy", "medium", "hard", "insane"],
      submission_status: ["submitted", "approved", "rejected"],
      subscription_tier: ["basic", "pro", "elite"],
      team_role: ["member", "lead"],
      user_status: ["active", "suspended", "inactive"],
    },
  },
} as const
