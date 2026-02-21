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
      achievement_badges: {
        Row: {
          category: string | null
          created_at: string
          criteria: Json | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          criteria?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
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
      articles: {
        Row: {
          author_id: string | null
          category: string
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
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
      collection_submissions: {
        Row: {
          admin_feedback: string | null
          category: string
          concept_notes: string | null
          created_at: string
          description: string | null
          designer_id: string
          files: Json | null
          id: string
          inspiration: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          submitted_at: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          admin_feedback?: string | null
          category?: string
          concept_notes?: string | null
          created_at?: string
          description?: string | null
          designer_id: string
          files?: Json | null
          id?: string
          inspiration?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          admin_feedback?: string | null
          category?: string
          concept_notes?: string | null
          created_at?: string
          description?: string | null
          designer_id?: string
          files?: Json | null
          id?: string
          inspiration?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          submitted_at?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          category: string
          created_at: string
          email: string
          id: string
          ip_address: string | null
          message: string
          name: string
          replied_at: string | null
          replied_by: string | null
          status: string
          subject: string
          user_agent: string | null
        }
        Insert: {
          admin_notes?: string | null
          category?: string
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          message: string
          name: string
          replied_at?: string | null
          replied_by?: string | null
          status?: string
          subject: string
          user_agent?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: string
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          replied_at?: string | null
          replied_by?: string | null
          status?: string
          subject?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      designer_scores: {
        Row: {
          created_at: string
          designer_id: string
          id: string
          last_calculated_at: string | null
          portfolio_score: number
          publication_score: number
          selling_score: number
          stylebox_score: number
          updated_at: string
          weighted_total: number | null
        }
        Insert: {
          created_at?: string
          designer_id: string
          id?: string
          last_calculated_at?: string | null
          portfolio_score?: number
          publication_score?: number
          selling_score?: number
          stylebox_score?: number
          updated_at?: string
          weighted_total?: number | null
        }
        Update: {
          created_at?: string
          designer_id?: string
          id?: string
          last_calculated_at?: string | null
          portfolio_score?: number
          publication_score?: number
          selling_score?: number
          stylebox_score?: number
          updated_at?: string
          weighted_total?: number | null
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
      email_logs: {
        Row: {
          created_at: string
          email_type: string
          error_message: string | null
          from_address: string
          id: string
          metadata: Json | null
          resend_id: string | null
          status: string
          subdomain: string
          subject: string
          to_address: string
        }
        Insert: {
          created_at?: string
          email_type: string
          error_message?: string | null
          from_address: string
          id?: string
          metadata?: Json | null
          resend_id?: string | null
          status?: string
          subdomain: string
          subject: string
          to_address: string
        }
        Update: {
          created_at?: string
          email_type?: string
          error_message?: string | null
          from_address?: string
          id?: string
          metadata?: Json | null
          resend_id?: string | null
          status?: string
          subdomain?: string
          subject?: string
          to_address?: string
        }
        Relationships: []
      }
      foundation_purchases: {
        Row: {
          amount_usd: number
          created_at: string
          designer_id: string
          id: string
          purchased_at: string | null
          rank_id: string
          status: string
          stripe_payment_id: string | null
        }
        Insert: {
          amount_usd: number
          created_at?: string
          designer_id: string
          id?: string
          purchased_at?: string | null
          rank_id: string
          status?: string
          stripe_payment_id?: string | null
        }
        Update: {
          amount_usd?: number
          created_at?: string
          designer_id?: string
          id?: string
          purchased_at?: string | null
          rank_id?: string
          status?: string
          stripe_payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "foundation_purchases_rank_id_fkey"
            columns: ["rank_id"]
            isOneToOne: false
            referencedRelation: "ranks"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applied_at: string
          cover_letter: string | null
          designer_id: string
          id: string
          interview_date: string | null
          job_id: string
          notes: string | null
          portfolio_url: string | null
          resume_url: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["job_application_status"]
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          designer_id: string
          id?: string
          interview_date?: string | null
          job_id: string
          notes?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["job_application_status"]
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          designer_id?: string
          id?: string
          interview_date?: string | null
          job_id?: string
          notes?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
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
          application_count: number | null
          benefits: Json | null
          category: Database["public"]["Enums"]["designer_category"] | null
          company_logo: string | null
          company_name: string | null
          contact_email: string | null
          created_at: string
          deadline: string | null
          description: string | null
          external_link: string | null
          id: string
          is_featured: boolean | null
          job_type: Database["public"]["Enums"]["job_type"] | null
          location: string | null
          location_type: Database["public"]["Enums"]["location_type"] | null
          posted_by: string | null
          requirements: Json | null
          salary_max: number | null
          salary_min: number | null
          salary_type: Database["public"]["Enums"]["salary_type"] | null
          status: Database["public"]["Enums"]["job_status"] | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          application_count?: number | null
          benefits?: Json | null
          category?: Database["public"]["Enums"]["designer_category"] | null
          company_logo?: string | null
          company_name?: string | null
          contact_email?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          external_link?: string | null
          id?: string
          is_featured?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"] | null
          location?: string | null
          location_type?: Database["public"]["Enums"]["location_type"] | null
          posted_by?: string | null
          requirements?: Json | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: Database["public"]["Enums"]["salary_type"] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          application_count?: number | null
          benefits?: Json | null
          category?: Database["public"]["Enums"]["designer_category"] | null
          company_logo?: string | null
          company_name?: string | null
          contact_email?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          external_link?: string | null
          id?: string
          is_featured?: boolean | null
          job_type?: Database["public"]["Enums"]["job_type"] | null
          location?: string | null
          location_type?: Database["public"]["Enums"]["location_type"] | null
          posted_by?: string | null
          requirements?: Json | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: Database["public"]["Enums"]["salary_type"] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketplace_carts: {
        Row: {
          created_at: string
          customer_id: string | null
          discount_amount: number | null
          discount_code: string | null
          expires_at: string | null
          id: string
          items: Json | null
          session_id: string | null
          subtotal: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          discount_code?: string | null
          expires_at?: string | null
          id?: string
          items?: Json | null
          session_id?: string | null
          subtotal?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          discount_amount?: number | null
          discount_code?: string | null
          expires_at?: string | null
          id?: string
          items?: Json | null
          session_id?: string | null
          subtotal?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_carts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "marketplace_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_categories: {
        Row: {
          banner_image_url: string | null
          created_at: string
          description: string | null
          display_order: number | null
          featured_products_count: number | null
          focus_areas: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          updated_at: string
          vibe_tags: string[] | null
        }
        Insert: {
          banner_image_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured_products_count?: number | null
          focus_areas?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          updated_at?: string
          vibe_tags?: string[] | null
        }
        Update: {
          banner_image_url?: string | null
          created_at?: string
          description?: string | null
          display_order?: number | null
          featured_products_count?: number | null
          focus_areas?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          updated_at?: string
          vibe_tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "marketplace_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_collection_products: {
        Row: {
          collection_id: string
          created_at: string
          display_order: number | null
          id: string
          product_id: string
        }
        Insert: {
          collection_id: string
          created_at?: string
          display_order?: number | null
          id?: string
          product_id: string
        }
        Update: {
          collection_id?: string
          created_at?: string
          display_order?: number | null
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "marketplace_collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_collections: {
        Row: {
          created_at: string
          description: string | null
          designer_id: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          designer_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          designer_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_collections_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_customers: {
        Row: {
          billing_addresses: Json | null
          created_at: string
          default_billing_address_id: string | null
          default_shipping_address_id: string | null
          email: string
          id: string
          name: string | null
          phone: string | null
          preferences: Json | null
          shipping_addresses: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_addresses?: Json | null
          created_at?: string
          default_billing_address_id?: string | null
          default_shipping_address_id?: string | null
          email: string
          id?: string
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          shipping_addresses?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_addresses?: Json | null
          created_at?: string
          default_billing_address_id?: string | null
          default_shipping_address_id?: string | null
          email?: string
          id?: string
          name?: string | null
          phone?: string | null
          preferences?: Json | null
          shipping_addresses?: Json | null
          updated_at?: string
          user_id?: string
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
      marketplace_order_items: {
        Row: {
          commission_paid: boolean | null
          created_at: string
          designer_commission: number | null
          designer_id: string
          id: string
          order_id: string
          platform_fee: number | null
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
          variant_data: Json | null
        }
        Insert: {
          commission_paid?: boolean | null
          created_at?: string
          designer_commission?: number | null
          designer_id: string
          id?: string
          order_id: string
          platform_fee?: number | null
          product_id: string
          quantity?: number
          total_price: number
          unit_price: number
          variant_data?: Json | null
        }
        Update: {
          commission_paid?: boolean | null
          created_at?: string
          designer_commission?: number | null
          designer_id?: string
          id?: string
          order_id?: string
          platform_fee?: number | null
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          variant_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "marketplace_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_orders: {
        Row: {
          admin_notes: string | null
          billing_address: Json | null
          cancelled_at: string | null
          created_at: string
          currency: string | null
          customer_id: string | null
          delivered_at: string | null
          discount_amount: number | null
          guest_email: string | null
          id: string
          items: Json
          notes: string | null
          order_number: string
          payment_intent_id: string | null
          payment_method: string | null
          payment_status: string | null
          refunded_at: string | null
          shipped_at: string | null
          shipping_address: Json | null
          shipping_cost: number | null
          shipping_method: string | null
          status: string
          subtotal: number
          tax_amount: number | null
          total: number
          tracking_number: string | null
          tracking_url: string | null
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          billing_address?: Json | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          guest_email?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_number: string
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          refunded_at?: string | null
          shipped_at?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          billing_address?: Json | null
          cancelled_at?: string | null
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          discount_amount?: number | null
          guest_email?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          refunded_at?: string | null
          shipped_at?: string | null
          shipping_address?: Json | null
          shipping_cost?: number | null
          shipping_method?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          total?: number
          tracking_number?: string | null
          tracking_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "marketplace_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_products: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          average_rating: number | null
          care_instructions: string | null
          category_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          designer_id: string | null
          dimensions: Json | null
          edition_size: number | null
          id: string
          images: Json | null
          inventory_count: number | null
          is_adorzia_product: boolean | null
          is_bestseller: boolean | null
          is_limited_edition: boolean | null
          is_made_to_order: boolean | null
          materials: string[] | null
          meta_description: string | null
          meta_title: string | null
          portfolio_publication_id: string | null
          price: number
          rank_visibility_score: number | null
          review_count: number | null
          sale_ends_at: string | null
          sale_price: number | null
          sku: string | null
          slug: string | null
          sold_count: number | null
          status: Database["public"]["Enums"]["product_status"]
          tags: string[] | null
          title: string
          updated_at: string
          variants: Json | null
          view_count: number | null
          weight: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          average_rating?: number | null
          care_instructions?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          designer_id?: string | null
          dimensions?: Json | null
          edition_size?: number | null
          id?: string
          images?: Json | null
          inventory_count?: number | null
          is_adorzia_product?: boolean | null
          is_bestseller?: boolean | null
          is_limited_edition?: boolean | null
          is_made_to_order?: boolean | null
          materials?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          portfolio_publication_id?: string | null
          price?: number
          rank_visibility_score?: number | null
          review_count?: number | null
          sale_ends_at?: string | null
          sale_price?: number | null
          sku?: string | null
          slug?: string | null
          sold_count?: number | null
          status?: Database["public"]["Enums"]["product_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
          variants?: Json | null
          view_count?: number | null
          weight?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          average_rating?: number | null
          care_instructions?: string | null
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          designer_id?: string | null
          dimensions?: Json | null
          edition_size?: number | null
          id?: string
          images?: Json | null
          inventory_count?: number | null
          is_adorzia_product?: boolean | null
          is_bestseller?: boolean | null
          is_limited_edition?: boolean | null
          is_made_to_order?: boolean | null
          materials?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          portfolio_publication_id?: string | null
          price?: number
          rank_visibility_score?: number | null
          review_count?: number | null
          sale_ends_at?: string | null
          sale_price?: number | null
          sku?: string | null
          slug?: string | null
          sold_count?: number | null
          status?: Database["public"]["Enums"]["product_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
          variants?: Json | null
          view_count?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "marketplace_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_products_portfolio_publication_id_fkey"
            columns: ["portfolio_publication_id"]
            isOneToOne: false
            referencedRelation: "portfolio_publications"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_reviews: {
        Row: {
          admin_response: string | null
          content: string | null
          created_at: string
          customer_id: string | null
          helpful_count: number | null
          id: string
          images: Json | null
          is_approved: boolean | null
          is_featured: boolean | null
          is_verified: boolean | null
          order_id: string | null
          product_id: string
          rating: number
          title: string | null
          updated_at: string
        }
        Insert: {
          admin_response?: string | null
          content?: string | null
          created_at?: string
          customer_id?: string | null
          helpful_count?: number | null
          id?: string
          images?: Json | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          order_id?: string | null
          product_id: string
          rating: number
          title?: string | null
          updated_at?: string
        }
        Update: {
          admin_response?: string | null
          content?: string | null
          created_at?: string
          customer_id?: string | null
          helpful_count?: number | null
          id?: string
          images?: Json | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          order_id?: string | null
          product_id?: string
          rating?: number
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_reviews_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "marketplace_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "marketplace_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_wishlists: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          product_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          product_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_wishlists_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "marketplace_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "marketplace_products"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          source: string | null
          status: string
          subscribed_at: string
          welcome_email_sent: boolean | null
          welcome_email_sent_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          source?: string | null
          status?: string
          subscribed_at?: string
          welcome_email_sent?: boolean | null
          welcome_email_sent_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          source?: string | null
          status?: string
          subscribed_at?: string
          welcome_email_sent?: boolean | null
          welcome_email_sent_at?: string | null
        }
        Relationships: []
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
          collection_name: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          fabric_details: string | null
          id: string
          inspiration: string | null
          is_featured: boolean | null
          is_stylebox_certified: boolean | null
          marketplace_status: string | null
          metadata: Json | null
          portfolio_id: string
          source_id: string | null
          source_type: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          category?: string | null
          collection_name?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          fabric_details?: string | null
          id?: string
          inspiration?: string | null
          is_featured?: boolean | null
          is_stylebox_certified?: boolean | null
          marketplace_status?: string | null
          metadata?: Json | null
          portfolio_id: string
          source_id?: string | null
          source_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          category?: string | null
          collection_name?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          fabric_details?: string | null
          id?: string
          inspiration?: string | null
          is_featured?: boolean | null
          is_stylebox_certified?: boolean | null
          marketplace_status?: string | null
          metadata?: Json | null
          portfolio_id?: string
          source_id?: string | null
          source_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          year?: number | null
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
          bio: string | null
          banner_image: string | null
          brand_name: string | null
          category: string | null
          created_at: string
          education: string[] | null
          email: string | null
          awards: string[] | null
          facebook_url: string | null
          first_login: boolean | null
          id: string
          instagram_handle: string | null
          linkedin_url: string | null
          location: string | null
          logo_url: string | null
          name: string | null
          notification_preferences: Json | null
          rank_id: string | null
          shopify_store_url: string | null
          skills: string[] | null
          status: Database["public"]["Enums"]["user_status"] | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          tiktok_handle: string | null
          twitter_handle: string | null
          updated_at: string
          user_id: string
          website_url: string | null
          style_credits: number | null
          youtube_channel: string | null
          dribbble_url: string | null
          behance_url: string | null
          etsy_shop_url: string | null
          manufacturing_countries: string[] | null
          sustainability_practices: string[] | null
          artist_statement: string | null
          role: string | null
          is_approved: boolean | null
          is_featured: boolean | null
          approved_at: string | null
          approved_by: string | null
          featured_at: string | null
          featured_by: string | null
          last_login_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          banner_image?: string | null
          brand_name?: string | null
          category?: string | null
          created_at?: string
          education?: string[] | null
          email?: string | null
          awards?: string[] | null
          facebook_url?: string | null
          first_login?: boolean | null
          id?: string
          instagram_handle?: string | null
          linkedin_url?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string | null
          notification_preferences?: Json | null
          rank_id?: string | null
          shopify_store_url?: string | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
          xp?: number | null
          youtube_channel?: string | null
          dribbble_url?: string | null
          behance_url?: string | null
          etsy_shop_url?: string | null
          manufacturing_countries?: string[] | null
          sustainability_practices?: string[] | null
          artist_statement?: string | null
          role?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          featured_at?: string | null
          featured_by?: string | null
          last_login_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          banner_image?: string | null
          brand_name?: string | null
          category?: string | null
          created_at?: string
          education?: string[] | null
          email?: string | null
          awards?: string[] | null
          facebook_url?: string | null
          first_login?: boolean | null
          id?: string
          instagram_handle?: string | null
          linkedin_url?: string | null
          location?: string | null
          logo_url?: string | null
          name?: string | null
          notification_preferences?: Json | null
          rank_id?: string | null
          shopify_store_url?: string | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["user_status"] | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          tiktok_handle?: string | null
          twitter_handle?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
          xp?: number | null
          youtube_channel?: string | null
          dribbble_url?: string | null
          behance_url?: string | null
          etsy_shop_url?: string | null
          manufacturing_countries?: string[] | null
          sustainability_practices?: string[] | null
          artist_statement?: string | null
          role?: string | null
          is_approved?: boolean | null
          is_featured?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          featured_at?: string | null
          featured_by?: string | null
          last_login_at?: string | null
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
          bonus_percentage: number | null
          created_at: string
          description: string | null
          id: string
          is_foundation: boolean | null
          max_slots: number | null
          min_time_in_rank_days: number | null
          min_weighted_score: number | null
          name: string
          price_usd: number | null
          priority_queue: boolean
          rank_order: number
          requirements: Json | null
          revenue_share_percent: number
          updated_at: string
        }
        Insert: {
          bonus_percentage?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_foundation?: boolean | null
          max_slots?: number | null
          min_time_in_rank_days?: number | null
          min_weighted_score?: number | null
          name: string
          price_usd?: number | null
          priority_queue?: boolean
          rank_order?: number
          requirements?: Json | null
          revenue_share_percent?: number
          updated_at?: string
        }
        Update: {
          bonus_percentage?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_foundation?: boolean | null
          max_slots?: number | null
          min_time_in_rank_days?: number | null
          min_weighted_score?: number | null
          name?: string
          price_usd?: number | null
          priority_queue?: boolean
          rank_order?: number
          requirements?: Json | null
          revenue_share_percent?: number
          updated_at?: string
        }
        Relationships: []
      }
      saved_jobs: {
        Row: {
          designer_id: string
          id: string
          job_id: string
          saved_at: string
        }
        Insert: {
          designer_id: string
          id?: string
          job_id: string
          saved_at?: string
        }
        Update: {
          designer_id?: string
          id?: string
          job_id?: string
          saved_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      stylebox_evaluation_scores: {
        Row: {
          craftsmanship_score: number
          created_at: string
          creative_innovation_score: number
          difficulty_points: number
          evaluated_at: string | null
          evaluated_by: string | null
          final_weighted_score: number | null
          id: string
          quality_multiplier: number
          submission_id: string
          technical_execution_score: number
          timeliness_bonus: number
          trend_alignment_score: number
        }
        Insert: {
          craftsmanship_score?: number
          created_at?: string
          creative_innovation_score?: number
          difficulty_points?: number
          evaluated_at?: string | null
          evaluated_by?: string | null
          final_weighted_score?: number | null
          id?: string
          quality_multiplier?: number
          submission_id: string
          technical_execution_score?: number
          timeliness_bonus?: number
          trend_alignment_score?: number
        }
        Update: {
          craftsmanship_score?: number
          created_at?: string
          creative_innovation_score?: number
          difficulty_points?: number
          evaluated_at?: string | null
          evaluated_by?: string | null
          final_weighted_score?: number | null
          id?: string
          quality_multiplier?: number
          submission_id?: string
          technical_execution_score?: number
          timeliness_bonus?: number
          trend_alignment_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "stylebox_evaluation_scores_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "stylebox_submissions"
            referencedColumns: ["id"]
          },
        ]
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
          archetype: Json | null
          adorzia_deliverables: Json | null
          brief: Json | null
          category: Database["public"]["Enums"]["designer_category"]
          client_name: string | null
          collection_line: string | null
          collection_size: number | null
          color_system: Json | null
          constraints: Json | null
          created_at: string
          created_by: string | null
          deliverables: Json | null
          description: string | null
          design_guidelines: Json | null
          detailed_deliverables: Json | null
          difficulty: Database["public"]["Enums"]["stylebox_difficulty"]
          display_id: string | null
          evaluation_criteria: Json | null
          global_drivers: string | null
          id: string
          is_featured: boolean | null
          is_team_challenge: boolean | null
          is_walkthrough: boolean
          level_number: number | null
          local_relevance: string | null
          manifestation: Json | null
          market_context: string | null
          material_direction: Json | null
          minimum_team_rank_order: number | null
          moodboard_images: Json | null
          mutation: Json | null
          pdf_url: string | null
          reference_files: Json | null
          release_date: string | null
          required_rank_order: number | null
          required_subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          restrictions: Json | null
          scenario: Json | null
          season: string | null
          status: Database["public"]["Enums"]["content_status"]
          steps: Json | null
          studio_name: string | null
          submission_deadline: string | null
          target_role: string | null
          team_role_requirements: Json | null
          team_size: number | null
          technical_requirements: Json | null
          thumbnail_url: string | null
          time_limit_hours: number | null
          title: string
          trend_narrative: string | null
          updated_at: string
          version: number | null
          visibility_tags: Json | null
          visual_keywords: Json | null
          xp_reward: number | null
        }
        Insert: {
          archive_date?: string | null
          archetype?: Json | null
          adorzia_deliverables?: Json | null
          brief?: Json | null
          category?: Database["public"]["Enums"]["designer_category"]
          client_name?: string | null
          collection_line?: string | null
          collection_size?: number | null
          color_system?: Json | null
          constraints?: Json | null
          created_at?: string
          created_by?: string | null
          deliverables?: Json | null
          description?: string | null
          design_guidelines?: Json | null
          detailed_deliverables?: Json | null
          difficulty?: Database["public"]["Enums"]["stylebox_difficulty"]
          display_id?: string | null
          evaluation_criteria?: Json | null
          global_drivers?: string | null
          id?: string
          is_featured?: boolean | null
          is_team_challenge?: boolean | null
          is_walkthrough?: boolean
          level_number?: number | null
          local_relevance?: string | null
          manifestation?: Json | null
          market_context?: string | null
          material_direction?: Json | null
          minimum_team_rank_order?: number | null
          moodboard_images?: Json | null
          mutation?: Json | null
          pdf_url?: string | null
          reference_files?: Json | null
          release_date?: string | null
          required_rank_order?: number | null
          required_subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          restrictions?: Json | null
          scenario?: Json | null
          season?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          steps?: Json | null
          studio_name?: string | null
          submission_deadline?: string | null
          target_role?: string | null
          team_role_requirements?: Json | null
          team_size?: number | null
          technical_requirements?: Json | null
          thumbnail_url?: string | null
          time_limit_hours?: number | null
          title: string
          trend_narrative?: string | null
          updated_at?: string
          version?: number | null
          visibility_tags?: Json | null
          visual_keywords?: Json | null
          xp_reward?: number | null
        }
        Update: {
          archive_date?: string | null
          archetype?: Json | null
          adorzia_deliverables?: Json | null
          brief?: Json | null
          category?: Database["public"]["Enums"]["designer_category"]
          client_name?: string | null
          collection_line?: string | null
          collection_size?: number | null
          color_system?: Json | null
          constraints?: Json | null
          created_at?: string
          created_by?: string | null
          deliverables?: Json | null
          description?: string | null
          design_guidelines?: Json | null
          detailed_deliverables?: Json | null
          difficulty?: Database["public"]["Enums"]["stylebox_difficulty"]
          display_id?: string | null
          evaluation_criteria?: Json | null
          global_drivers?: string | null
          id?: string
          is_featured?: boolean | null
          is_team_challenge?: boolean | null
          is_walkthrough?: boolean
          level_number?: number | null
          local_relevance?: string | null
          manifestation?: Json | null
          market_context?: string | null
          material_direction?: Json | null
          minimum_team_rank_order?: number | null
          moodboard_images?: Json | null
          mutation?: Json | null
          pdf_url?: string | null
          reference_files?: Json | null
          release_date?: string | null
          required_rank_order?: number | null
          required_subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          restrictions?: Json | null
          scenario?: Json | null
          season?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          steps?: Json | null
          studio_name?: string | null
          submission_deadline?: string | null
          target_role?: string | null
          team_role_requirements?: Json | null
          team_size?: number | null
          technical_requirements?: Json | null
          thumbnail_url?: string | null
          time_limit_hours?: number | null
          title?: string
          trend_narrative?: string | null
          updated_at?: string
          version?: number | null
          visibility_tags?: Json | null
          visual_keywords?: Json | null
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
      team_stylebox_submissions: {
        Row: {
          admin_feedback: Json | null
          created_at: string
          deadline: string | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          role_assignments: Json | null
          role_submissions: Json | null
          started_at: string | null
          status: string
          stylebox_id: string
          submitted_at: string | null
          team_id: string
          total_score: number | null
          updated_at: string
        }
        Insert: {
          admin_feedback?: Json | null
          created_at?: string
          deadline?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_assignments?: Json | null
          role_submissions?: Json | null
          started_at?: string | null
          status?: string
          stylebox_id: string
          submitted_at?: string | null
          team_id: string
          total_score?: number | null
          updated_at?: string
        }
        Update: {
          admin_feedback?: Json | null
          created_at?: string
          deadline?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          role_assignments?: Json | null
          role_submissions?: Json | null
          started_at?: string | null
          status?: string
          stylebox_id?: string
          submitted_at?: string | null
          team_id?: string
          total_score?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_stylebox_submissions_stylebox_id_fkey"
            columns: ["stylebox_id"]
            isOneToOne: false
            referencedRelation: "styleboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_stylebox_submissions_team_id_fkey"
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
      user_achievement_badges: {
        Row: {
          awarded_at: string
          awarded_by: string | null
          badge_id: string
          id: string
          notes: string | null
          team_submission_id: string | null
          user_id: string
        }
        Insert: {
          awarded_at?: string
          awarded_by?: string | null
          badge_id: string
          id?: string
          notes?: string | null
          team_submission_id?: string | null
          user_id: string
        }
        Update: {
          awarded_at?: string
          awarded_by?: string | null
          badge_id?: string
          id?: string
          notes?: string | null
          team_submission_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievement_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "achievement_badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievement_badges_team_submission_id_fkey"
            columns: ["team_submission_id"]
            isOneToOne: false
            referencedRelation: "team_stylebox_submissions"
            referencedColumns: ["id"]
          },
        ]
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
      user_feedback: {
        Row: {
          category: string
          created_at: string
          email_sent: boolean | null
          id: string
          message: string
          user_id: string
          user_name: string
          user_role: string
        }
        Insert: {
          category: string
          created_at?: string
          email_sent?: boolean | null
          id?: string
          message: string
          user_id: string
          user_name: string
          user_role: string
        }
        Update: {
          category?: string
          created_at?: string
          email_sent?: boolean | null
          id?: string
          message?: string
          user_id?: string
          user_name?: string
          user_role?: string
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
      generate_order_number: { Args: never; Returns: string }
      get_admin_dashboard_stats: {
        Args: never
        Returns: Json
      }
      get_designer_stats: {
        Args: {
          designer_uuid: string
        }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "superadmin" | "designer"
      content_status: "draft" | "active" | "archived"
      designer_category: "fashion" | "textile" | "jewelry"
      job_application_status: "applied" | "shortlisted" | "rejected" | "hired"
      job_status: "draft" | "active" | "paused" | "closed" | "expired"
      job_type:
        | "full_time"
        | "part_time"
        | "contract"
        | "freelance"
        | "internship"
      location_type: "onsite" | "remote" | "hybrid"
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
      salary_type: "annual" | "monthly" | "hourly" | "project"
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
      app_role: ["admin", "superadmin", "designer"],
      content_status: ["draft", "active", "archived"],
      designer_category: ["fashion", "textile", "jewelry"],
      job_application_status: ["applied", "shortlisted", "rejected", "hired"],
      job_status: ["draft", "active", "paused", "closed", "expired"],
      job_type: [
        "full_time",
        "part_time",
        "contract",
        "freelance",
        "internship",
      ],
      location_type: ["onsite", "remote", "hybrid"],
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
      salary_type: ["annual", "monthly", "hourly", "project"],
      stylebox_difficulty: ["free", "easy", "medium", "hard", "insane"],
      submission_status: ["submitted", "approved", "rejected"],
      subscription_tier: ["basic", "pro", "elite"],
      team_role: ["member", "lead"],
      user_status: ["active", "suspended", "inactive"],
    },
  },
} as const
