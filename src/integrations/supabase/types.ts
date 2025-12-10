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
      marketplace_handoffs: {
        Row: {
          auto_approved: boolean | null
          created_at: string | null
          designer_approved: boolean | null
          designer_approved_at: string | null
          designer_revenue_share: number | null
          final_price: number | null
          handoff_package: Json
          id: string
          listing_description: string | null
          listing_images: Json | null
          listing_title: string | null
          listing_variants: Json | null
          marketplace_product_id: string | null
          publication_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          auto_approved?: boolean | null
          created_at?: string | null
          designer_approved?: boolean | null
          designer_approved_at?: string | null
          designer_revenue_share?: number | null
          final_price?: number | null
          handoff_package?: Json
          id?: string
          listing_description?: string | null
          listing_images?: Json | null
          listing_title?: string | null
          listing_variants?: Json | null
          marketplace_product_id?: string | null
          publication_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_approved?: boolean | null
          created_at?: string | null
          designer_approved?: boolean | null
          designer_approved_at?: string | null
          designer_revenue_share?: number | null
          final_price?: number | null
          handoff_package?: Json
          id?: string
          listing_description?: string | null
          listing_images?: Json | null
          listing_title?: string | null
          listing_variants?: Json | null
          marketplace_product_id?: string | null
          publication_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_handoffs_marketplace_product_id_fkey"
            columns: ["marketplace_product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_handoffs_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "portfolio_publications"
            referencedColumns: ["id"]
          },
        ]
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
      portfolio_analytics: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          portfolio_id: string
          visitor_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          portfolio_id: string
          visitor_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          portfolio_id?: string
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_analytics_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_assets: {
        Row: {
          alt_text: string | null
          asset_category: string | null
          caption: string | null
          created_at: string | null
          designer_id: string
          dimensions: Json | null
          display_order: number | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          metadata: Json | null
          mime_type: string | null
          portfolio_id: string
          project_id: string | null
        }
        Insert: {
          alt_text?: string | null
          asset_category?: string | null
          caption?: string | null
          created_at?: string | null
          designer_id: string
          dimensions?: Json | null
          display_order?: number | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          portfolio_id: string
          project_id?: string | null
        }
        Update: {
          alt_text?: string | null
          asset_category?: string | null
          caption?: string | null
          created_at?: string | null
          designer_id?: string
          dimensions?: Json | null
          display_order?: number | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          portfolio_id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_assets_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_assets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "portfolio_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_projects: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          metadata: Json | null
          portfolio_id: string
          source_id: string | null
          source_type: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          portfolio_id: string
          source_id?: string | null
          source_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          metadata?: Json | null
          portfolio_id?: string
          source_id?: string | null
          source_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_projects_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_publications: {
        Row: {
          assigned_team: string | null
          auto_approve_at: string | null
          costing_data: Json | null
          decision: string | null
          decision_notes: string | null
          design_metadata: Json | null
          designer_approved_at: string | null
          designer_notes: string | null
          designer_revenue_share: number | null
          id: string
          listing_preview_url: string | null
          locked_at: string | null
          marketplace_id: string | null
          marketplace_package: Json | null
          marketplace_status: string | null
          portfolio_id: string
          priority_score: number | null
          production_stage: string | null
          published_at: string | null
          quality_rating: number | null
          revenue_override: boolean | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          sampling_status: string | null
          source_id: string | null
          source_type: string | null
          status: Database["public"]["Enums"]["publication_status"]
          status_v2: Database["public"]["Enums"]["publication_status_v2"] | null
          submission_files: Json | null
          submitted_at: string
          techpack_url: string | null
        }
        Insert: {
          assigned_team?: string | null
          auto_approve_at?: string | null
          costing_data?: Json | null
          decision?: string | null
          decision_notes?: string | null
          design_metadata?: Json | null
          designer_approved_at?: string | null
          designer_notes?: string | null
          designer_revenue_share?: number | null
          id?: string
          listing_preview_url?: string | null
          locked_at?: string | null
          marketplace_id?: string | null
          marketplace_package?: Json | null
          marketplace_status?: string | null
          portfolio_id: string
          priority_score?: number | null
          production_stage?: string | null
          published_at?: string | null
          quality_rating?: number | null
          revenue_override?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          sampling_status?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: Database["public"]["Enums"]["publication_status"]
          status_v2?:
            | Database["public"]["Enums"]["publication_status_v2"]
            | null
          submission_files?: Json | null
          submitted_at?: string
          techpack_url?: string | null
        }
        Update: {
          assigned_team?: string | null
          auto_approve_at?: string | null
          costing_data?: Json | null
          decision?: string | null
          decision_notes?: string | null
          design_metadata?: Json | null
          designer_approved_at?: string | null
          designer_notes?: string | null
          designer_revenue_share?: number | null
          id?: string
          listing_preview_url?: string | null
          locked_at?: string | null
          marketplace_id?: string | null
          marketplace_package?: Json | null
          marketplace_status?: string | null
          portfolio_id?: string
          priority_score?: number | null
          production_stage?: string | null
          published_at?: string | null
          quality_rating?: number | null
          revenue_override?: boolean | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          sampling_status?: string | null
          source_id?: string | null
          source_type?: string | null
          status?: Database["public"]["Enums"]["publication_status"]
          status_v2?:
            | Database["public"]["Enums"]["publication_status_v2"]
            | null
          submission_files?: Json | null
          submitted_at?: string
          techpack_url?: string | null
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
      portfolio_reviews: {
        Row: {
          action: string
          created_at: string | null
          feedback: Json | null
          id: string
          notes: string | null
          portfolio_id: string
          quality_score: number | null
          reviewer_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          feedback?: Json | null
          id?: string
          notes?: string | null
          portfolio_id: string
          quality_score?: number | null
          reviewer_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          feedback?: Json | null
          id?: string
          notes?: string | null
          portfolio_id?: string
          quality_score?: number | null
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_reviews_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_sections: {
        Row: {
          content: Json | null
          created_at: string | null
          display_order: number | null
          id: string
          is_visible: boolean | null
          portfolio_id: string
          section_type: string | null
          settings: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_visible?: boolean | null
          portfolio_id: string
          section_type?: string | null
          settings?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_visible?: boolean | null
          portfolio_id?: string
          section_type?: string | null
          settings?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_sections_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_versions: {
        Row: {
          change_summary: string | null
          created_at: string | null
          created_by: string
          id: string
          portfolio_id: string
          snapshot: Json
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          portfolio_id: string
          snapshot: Json
          version_number: number
        }
        Update: {
          change_summary?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          portfolio_id?: string
          snapshot?: Json
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_versions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          category: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          designer_id: string
          id: string
          is_locked: boolean | null
          items: Json | null
          locked_at: string | null
          locked_by: string | null
          pdf_exported: boolean | null
          published_at: string | null
          quality_score: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          seo_description: string | null
          seo_title: string | null
          settings: Json | null
          slug: string | null
          status: Database["public"]["Enums"]["portfolio_status"] | null
          submitted_at: string | null
          tagline: string | null
          title: string
          updated_at: string
          version: number | null
          view_count: number | null
          visibility: Database["public"]["Enums"]["portfolio_visibility"] | null
        }
        Insert: {
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          designer_id: string
          id?: string
          is_locked?: boolean | null
          items?: Json | null
          locked_at?: string | null
          locked_by?: string | null
          pdf_exported?: boolean | null
          published_at?: string | null
          quality_score?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          seo_description?: string | null
          seo_title?: string | null
          settings?: Json | null
          slug?: string | null
          status?: Database["public"]["Enums"]["portfolio_status"] | null
          submitted_at?: string | null
          tagline?: string | null
          title: string
          updated_at?: string
          version?: number | null
          view_count?: number | null
          visibility?:
            | Database["public"]["Enums"]["portfolio_visibility"]
            | null
        }
        Update: {
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          designer_id?: string
          id?: string
          is_locked?: boolean | null
          items?: Json | null
          locked_at?: string | null
          locked_by?: string | null
          pdf_exported?: boolean | null
          published_at?: string | null
          quality_score?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          seo_description?: string | null
          seo_title?: string | null
          settings?: Json | null
          slug?: string | null
          status?: Database["public"]["Enums"]["portfolio_status"] | null
          submitted_at?: string | null
          tagline?: string | null
          title?: string
          updated_at?: string
          version?: number | null
          view_count?: number | null
          visibility?:
            | Database["public"]["Enums"]["portfolio_visibility"]
            | null
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
      production_logs: {
        Row: {
          action: string
          created_at: string | null
          from_stage: string | null
          id: string
          metadata: Json | null
          notes: string | null
          performed_by: string
          publication_id: string
          queue_id: string | null
          to_stage: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          from_stage?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          performed_by: string
          publication_id: string
          queue_id?: string | null
          to_stage?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          from_stage?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          performed_by?: string
          publication_id?: string
          queue_id?: string | null
          to_stage?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_logs_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "portfolio_publications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_logs_queue_id_fkey"
            columns: ["queue_id"]
            isOneToOne: false
            referencedRelation: "production_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      production_queue: {
        Row: {
          assigned_team: string | null
          assigned_to: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          notes: string | null
          priority: number | null
          publication_id: string
          stage: string
          started_at: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_team?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          priority?: number | null
          publication_id: string
          stage?: string
          started_at?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_team?: string | null
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          priority?: number | null
          publication_id?: string
          stage?: string
          started_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_queue_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "portfolio_publications"
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
      publication_reviews: {
        Row: {
          action: string
          created_at: string
          id: string
          notes: string | null
          publication_id: string
          quality_rating: number | null
          reviewer_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          notes?: string | null
          publication_id: string
          quality_rating?: number | null
          reviewer_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          notes?: string | null
          publication_id?: string
          quality_rating?: number | null
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "publication_reviews_publication_id_fkey"
            columns: ["publication_id"]
            isOneToOne: false
            referencedRelation: "portfolio_publications"
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
          archive_date: string | null
          brief: Json | null
          category: Database["public"]["Enums"]["designer_category"]
          created_at: string
          created_by: string | null
          deliverables: Json | null
          description: string | null
          difficulty: Database["public"]["Enums"]["stylebox_difficulty"]
          id: string
          is_featured: boolean | null
          is_walkthrough: boolean
          reference_files: Json | null
          release_date: string | null
          required_rank_order: number | null
          required_subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          status: Database["public"]["Enums"]["content_status"]
          steps: Json | null
          title: string
          updated_at: string
          version: number | null
          xp_reward: number | null
        }
        Insert: {
          archive_date?: string | null
          brief?: Json | null
          category?: Database["public"]["Enums"]["designer_category"]
          created_at?: string
          created_by?: string | null
          deliverables?: Json | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["stylebox_difficulty"]
          id?: string
          is_featured?: boolean | null
          is_walkthrough?: boolean
          reference_files?: Json | null
          release_date?: string | null
          required_rank_order?: number | null
          required_subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          status?: Database["public"]["Enums"]["content_status"]
          steps?: Json | null
          title: string
          updated_at?: string
          version?: number | null
          xp_reward?: number | null
        }
        Update: {
          archive_date?: string | null
          brief?: Json | null
          category?: Database["public"]["Enums"]["designer_category"]
          created_at?: string
          created_by?: string | null
          deliverables?: Json | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["stylebox_difficulty"]
          id?: string
          is_featured?: boolean | null
          is_walkthrough?: boolean
          reference_files?: Json | null
          release_date?: string | null
          required_rank_order?: number | null
          required_subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          status?: Database["public"]["Enums"]["content_status"]
          steps?: Json | null
          title?: string
          updated_at?: string
          version?: number | null
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
      walkthrough_progress: {
        Row: {
          added_to_portfolio: boolean
          completed_at: string | null
          completed_steps: Json | null
          completion_override: boolean | null
          current_step: number
          designer_id: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          started_at: string
          stylebox_id: string
          submission_files: Json | null
          submission_notes: string | null
          xp_awarded: number | null
          xp_override: boolean | null
        }
        Insert: {
          added_to_portfolio?: boolean
          completed_at?: string | null
          completed_steps?: Json | null
          completion_override?: boolean | null
          current_step?: number
          designer_id: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          started_at?: string
          stylebox_id: string
          submission_files?: Json | null
          submission_notes?: string | null
          xp_awarded?: number | null
          xp_override?: boolean | null
        }
        Update: {
          added_to_portfolio?: boolean
          completed_at?: string | null
          completed_steps?: Json | null
          completion_override?: boolean | null
          current_step?: number
          designer_id?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          started_at?: string
          stylebox_id?: string
          submission_files?: Json | null
          submission_notes?: string | null
          xp_awarded?: number | null
          xp_override?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "walkthrough_progress_stylebox_id_fkey"
            columns: ["stylebox_id"]
            isOneToOne: false
            referencedRelation: "styleboxes"
            referencedColumns: ["id"]
          },
        ]
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
      marketplace_status:
        | "pending_handoff"
        | "awaiting_sampling"
        | "sampling_approved"
        | "production_started"
        | "listing_scheduled"
        | "published"
        | "discontinued"
      notification_status: "unread" | "read"
      notification_type: "submission" | "earnings" | "portfolio" | "marketplace"
      payout_status: "pending" | "processed" | "paid"
      portfolio_status:
        | "draft"
        | "review"
        | "approved"
        | "published"
        | "rejected"
      portfolio_visibility: "private" | "public" | "marketplace_only"
      product_status: "draft" | "live" | "archived"
      publication_decision:
        | "pending"
        | "approved"
        | "rejected"
        | "revision_requested"
      publication_source:
        | "stylebox"
        | "walkthrough"
        | "independent"
        | "portfolio"
      publication_status: "pending" | "approved" | "rejected" | "published"
      publication_status_v2:
        | "draft"
        | "pending_review"
        | "revision_requested"
        | "approved"
        | "sampling"
        | "sample_ready"
        | "costing_ready"
        | "pre_production"
        | "marketplace_pending"
        | "listing_preview"
        | "published"
        | "rejected"
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
      marketplace_status: [
        "pending_handoff",
        "awaiting_sampling",
        "sampling_approved",
        "production_started",
        "listing_scheduled",
        "published",
        "discontinued",
      ],
      notification_status: ["unread", "read"],
      notification_type: ["submission", "earnings", "portfolio", "marketplace"],
      payout_status: ["pending", "processed", "paid"],
      portfolio_status: [
        "draft",
        "review",
        "approved",
        "published",
        "rejected",
      ],
      portfolio_visibility: ["private", "public", "marketplace_only"],
      product_status: ["draft", "live", "archived"],
      publication_decision: [
        "pending",
        "approved",
        "rejected",
        "revision_requested",
      ],
      publication_source: [
        "stylebox",
        "walkthrough",
        "independent",
        "portfolio",
      ],
      publication_status: ["pending", "approved", "rejected", "published"],
      publication_status_v2: [
        "draft",
        "pending_review",
        "revision_requested",
        "approved",
        "sampling",
        "sample_ready",
        "costing_ready",
        "pre_production",
        "marketplace_pending",
        "listing_preview",
        "published",
        "rejected",
      ],
      stylebox_difficulty: ["free", "easy", "medium", "hard", "insane"],
      submission_status: ["submitted", "approved", "rejected"],
      subscription_tier: ["basic", "pro", "elite"],
      team_role: ["member", "lead"],
      user_status: ["active", "suspended", "inactive"],
    },
  },
} as const
