export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      betting_history: {
        Row: {
          bet_amount: number
          coin_result: string | null
          coin_side: string | null
          created_at: string
          game_type: string
          id: string
          multiplier: number
          result: string
          roll_result: number | null
          target_value: number | null
          user_id: string
          win_amount: number
          won: boolean
        }
        Insert: {
          bet_amount: number
          coin_result?: string | null
          coin_side?: string | null
          created_at?: string
          game_type: string
          id?: string
          multiplier: number
          result: string
          roll_result?: number | null
          target_value?: number | null
          user_id: string
          win_amount: number
          won: boolean
        }
        Update: {
          bet_amount?: number
          coin_result?: string | null
          coin_side?: string | null
          created_at?: string
          game_type?: string
          id?: string
          multiplier?: number
          result?: string
          roll_result?: number | null
          target_value?: number | null
          user_id?: string
          win_amount?: number
          won?: boolean
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          quantity: number
          restaurant_menu_item_id: string | null
          selected_options: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          quantity?: number
          restaurant_menu_item_id?: string | null
          selected_options?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          quantity?: number
          restaurant_menu_item_id?: string | null
          selected_options?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_restaurant_menu_item_id_fkey"
            columns: ["restaurant_menu_item_id"]
            isOneToOne: false
            referencedRelation: "restaurant_menu"
            referencedColumns: ["id"]
          },
        ]
      }
      contest_tickets: {
        Row: {
          contest_id: string
          created_at: string | null
          id: string
          purchase_date: string | null
          ticket_number: string
          user_id: string
        }
        Insert: {
          contest_id: string
          created_at?: string | null
          id?: string
          purchase_date?: string | null
          ticket_number: string
          user_id: string
        }
        Update: {
          contest_id?: string
          created_at?: string | null
          id?: string
          purchase_date?: string | null
          ticket_number?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contest_tickets_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      contests: {
        Row: {
          created_at: string | null
          end_time: string
          id: string
          is_active: boolean | null
          prize_amount: number
          prize_token: string
          start_time: string
          ticket_price: number
          title: string
        }
        Insert: {
          created_at?: string | null
          end_time: string
          id?: string
          is_active?: boolean | null
          prize_amount: number
          prize_token?: string
          start_time?: string
          ticket_price?: number
          title: string
        }
        Update: {
          created_at?: string | null
          end_time?: string
          id?: string
          is_active?: boolean | null
          prize_amount?: number
          prize_token?: string
          start_time?: string
          ticket_price?: number
          title?: string
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          created_at: string
          full_address: string
          id: string
          is_default: boolean | null
          phone: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_address: string
          id?: string
          is_default?: boolean | null
          phone: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_address?: string
          id?: string
          is_default?: boolean | null
          phone?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      customer_orders: {
        Row: {
          address_id: string | null
          created_at: string
          delivery_fee: number
          id: string
          items: Json
          payment_method_id: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address_id?: string | null
          created_at?: string
          delivery_fee?: number
          id?: string
          items: Json
          payment_method_id?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address_id?: string | null
          created_at?: string
          delivery_fee?: number
          id?: string
          items?: Json
          payment_method_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_orders_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "customer_payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_payment_methods: {
        Row: {
          card_brand: string | null
          card_last_four: string | null
          created_at: string
          id: string
          is_default: boolean | null
          payment_type: string
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          payment_type: string
          user_id: string
        }
        Update: {
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          payment_type?: string
          user_id?: string
        }
        Relationships: []
      }
      gym_subscriptions: {
        Row: {
          created_at: string | null
          end_date: string
          gym_id: string
          gym_name: string
          id: string
          plan_name: string
          price: number
          start_date: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          gym_id: string
          gym_name: string
          id?: string
          plan_name: string
          price: number
          start_date: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          gym_id?: string
          gym_name?: string
          id?: string
          plan_name?: string
          price?: number
          start_date?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      ip_referrals: {
        Row: {
          created_at: string
          id: string
          ip: string
          referral_code: string
          referrer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip: string
          referral_code: string
          referrer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ip?: string
          referral_code?: string
          referrer_id?: string
        }
        Relationships: []
      }
      mission_packages: {
        Row: {
          created_at: string
          description: string | null
          id: string
          missions_count: number
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          missions_count: number
          name: string
          price: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          missions_count?: number
          name?: string
          price?: number
        }
        Relationships: []
      }
      missions: {
        Row: {
          active: boolean
          created_at: string
          description: string
          id: string
          image_url: string | null
          link: string | null
          reward: number
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          link?: string | null
          reward: number
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          link?: string | null
          reward?: number
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          delivery_address_id: string | null
          id: string
          items: Json
          order_type: string
          payment_method_id: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_address_id?: string | null
          id?: string
          items: Json
          order_type: string
          payment_method_id?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_address_id?: string | null
          id?: string
          items?: Json
          order_type?: string
          payment_method_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "user_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_brand: string | null
          card_last_four: string | null
          created_at: string
          id: string
          is_default: boolean | null
          payment_type: string
          user_id: string
        }
        Insert: {
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          payment_type: string
          user_id: string
        }
        Update: {
          card_brand?: string | null
          card_last_four?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          payment_type?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string | null
          payment_method_id: string | null
          payment_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          order_id?: string | null
          payment_method_id?: string | null
          payment_type: string
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string | null
          payment_method_id?: string | null
          payment_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_care_products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_popular: boolean | null
          name: string
          price: number
          stock: number | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_popular?: boolean | null
          name: string
          price: number
          stock?: number | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_popular?: boolean | null
          name?: string
          price?: number
          stock?: number | null
        }
        Relationships: []
      }
      pharmacy_categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      pharmacy_products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_recommended: boolean | null
          name: string
          price: number
          requires_prescription: boolean | null
          stock: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_recommended?: boolean | null
          name: string
          price: number
          requires_prescription?: boolean | null
          stock?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_recommended?: boolean | null
          name?: string
          price?: number
          requires_prescription?: boolean | null
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pharmacy_products_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "pharmacy_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      planet_upgrades: {
        Row: {
          arabic_description: string
          arabic_name: string
          description: string
          id: string
          name: string
          planet_id: string
          price: number
          profit_increase: number
        }
        Insert: {
          arabic_description: string
          arabic_name: string
          description: string
          id?: string
          name: string
          planet_id: string
          price: number
          profit_increase: number
        }
        Update: {
          arabic_description?: string
          arabic_name?: string
          description?: string
          id?: string
          name?: string
          planet_id?: string
          price?: number
          profit_increase?: number
        }
        Relationships: [
          {
            foreignKeyName: "planet_upgrades_planet_id_fkey"
            columns: ["planet_id"]
            isOneToOne: false
            referencedRelation: "planets"
            referencedColumns: ["id"]
          },
        ]
      }
      planets: {
        Row: {
          animation: string
          arabic_description: string
          arabic_name: string
          color: string
          daily_profit: number
          description: string
          glow_color: string
          id: string
          image_url: string
          name: string
          price: number
        }
        Insert: {
          animation: string
          arabic_description: string
          arabic_name: string
          color: string
          daily_profit: number
          description: string
          glow_color: string
          id?: string
          image_url: string
          name: string
          price: number
        }
        Update: {
          animation?: string
          arabic_description?: string
          arabic_name?: string
          color?: string
          daily_profit?: number
          description?: string
          glow_color?: string
          id?: string
          image_url?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      referral_users: {
        Row: {
          active: boolean | null
          created_at: string | null
          id: number
          referred_id: string
          referrer_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          referred_id: string
          referrer_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: number
          referred_id?: string
          referrer_id?: string
        }
        Relationships: []
      }
      restaurant_cuisines: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      restaurant_menu: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          restaurant_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          restaurant_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_menu_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          created_at: string
          cuisines: string[] | null
          delivery_fee: number | null
          delivery_time: string | null
          description: string | null
          distance: string | null
          id: string
          image_url: string | null
          logo_url: string | null
          min_order: number | null
          name: string
          promo_text: string | null
          rating: number | null
        }
        Insert: {
          created_at?: string
          cuisines?: string[] | null
          delivery_fee?: number | null
          delivery_time?: string | null
          description?: string | null
          distance?: string | null
          id?: string
          image_url?: string | null
          logo_url?: string | null
          min_order?: number | null
          name: string
          promo_text?: string | null
          rating?: number | null
        }
        Update: {
          created_at?: string
          cuisines?: string[] | null
          delivery_fee?: number | null
          delivery_time?: string | null
          description?: string | null
          distance?: string | null
          id?: string
          image_url?: string | null
          logo_url?: string | null
          min_order?: number | null
          name?: string
          promo_text?: string | null
          rating?: number | null
        }
        Relationships: []
      }
      supermarket_categories: {
        Row: {
          description: string | null
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      supermarket_offers: {
        Row: {
          description: string | null
          discount: number | null
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          description?: string | null
          discount?: number | null
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          description?: string | null
          discount?: number | null
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: []
      }
      supermarket_products: {
        Row: {
          category_id: string | null
          description: string | null
          id: string
          image_url: string | null
          is_popular: boolean | null
          name: string
          price: number
          quantity: string | null
          stock: number | null
        }
        Insert: {
          category_id?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_popular?: boolean | null
          name: string
          price: number
          quantity?: string | null
          stock?: number | null
        }
        Update: {
          category_id?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_popular?: boolean | null
          name?: string
          price?: number
          quantity?: string | null
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "supermarket_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "supermarket_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          arabic_description: string
          arabic_title: string
          description: string
          id: string
          link: string | null
          reward: number
          sort_order: number | null
          time_required: number
          title: string
        }
        Insert: {
          arabic_description: string
          arabic_title: string
          description: string
          id?: string
          link?: string | null
          reward: number
          sort_order?: number | null
          time_required: number
          title: string
        }
        Update: {
          arabic_description?: string
          arabic_title?: string
          description?: string
          id?: string
          link?: string | null
          reward?: number
          sort_order?: number | null
          time_required?: number
          title?: string
        }
        Relationships: []
      }
      telegram_referrals: {
        Row: {
          created_at: string | null
          id: number
          referred_telegram_id: number
          referrer_telegram_id: number
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          referred_telegram_id: number
          referrer_telegram_id: number
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          referred_telegram_id?: number
          referrer_telegram_id?: number
          status?: string | null
        }
        Relationships: []
      }
      telegram_users: {
        Row: {
          created_at: string | null
          first_name: string | null
          has_welcomed: boolean | null
          id: number
          last_name: string | null
          referral_code: string | null
          telegram_id: number
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          has_welcomed?: boolean | null
          id?: number
          last_name?: string | null
          referral_code?: string | null
          telegram_id: number
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          has_welcomed?: boolean | null
          id?: number
          last_name?: string | null
          referral_code?: string | null
          telegram_id?: number
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      ton_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          planet_id: string | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          planet_id?: string | null
          status: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          planet_id?: string | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_addresses: {
        Row: {
          city: string | null
          created_at: string
          full_address: string
          id: string
          is_default: boolean | null
          label: string
          phone_number: string | null
          user_id: string
        }
        Insert: {
          city?: string | null
          created_at?: string
          full_address: string
          id?: string
          is_default?: boolean | null
          label: string
          phone_number?: string | null
          user_id: string
        }
        Update: {
          city?: string | null
          created_at?: string
          full_address?: string
          id?: string
          is_default?: boolean | null
          label?: string
          phone_number?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_mission_packages: {
        Row: {
          created_at: string
          id: string
          package_id: string | null
          remaining_missions: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          package_id?: string | null
          remaining_missions?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          package_id?: string | null
          remaining_missions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mission_packages_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "mission_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_missions: {
        Row: {
          claimed: boolean
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          mission_id: string
          user_id: string
        }
        Insert: {
          claimed?: boolean
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          mission_id: string
          user_id: string
        }
        Update: {
          claimed?: boolean
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          mission_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_payment_methods: {
        Row: {
          created_at: string
          id: string
          is_default: boolean | null
          last4: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          last4?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_default?: boolean | null
          last4?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_planets: {
        Row: {
          id: string
          planet_id: string
          purchased_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          planet_id: string
          purchased_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          planet_id?: string
          purchased_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_planets_planet_id_fkey"
            columns: ["planet_id"]
            isOneToOne: false
            referencedRelation: "planets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
          wallet_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          wallet_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
      user_referrals: {
        Row: {
          created_at: string | null
          id: number
          referral_code: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          referral_code: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          referral_code?: string
          user_id?: string
        }
        Relationships: []
      }
      user_statistics: {
        Row: {
          biggest_win: number
          created_at: string
          id: string
          total_bets: number
          total_won: number
          updated_at: string
          user_id: string
          won_bets: number
        }
        Insert: {
          biggest_win?: number
          created_at?: string
          id?: string
          total_bets?: number
          total_won?: number
          updated_at?: string
          user_id: string
          won_bets?: number
        }
        Update: {
          biggest_win?: number
          created_at?: string
          id?: string
          total_bets?: number
          total_won?: number
          updated_at?: string
          user_id?: string
          won_bets?: number
        }
        Relationships: []
      }
      user_tasks: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_upgrades: {
        Row: {
          id: string
          purchased_at: string | null
          upgrade_id: string
          user_id: string
        }
        Insert: {
          id?: string
          purchased_at?: string | null
          upgrade_id: string
          user_id: string
        }
        Update: {
          id?: string
          purchased_at?: string | null
          upgrade_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_upgrades_upgrade_id_fkey"
            columns: ["upgrade_id"]
            isOneToOne: false
            referencedRelation: "planet_upgrades"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          created_at: string | null
          id: string
          last_balance: number | null
          updated_at: string | null
          user_id: string
          wallet_address: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_balance?: number | null
          updated_at?: string | null
          user_id: string
          wallet_address: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_balance?: number | null
          updated_at?: string | null
          user_id?: string
          wallet_address?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          profile_image: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          username?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
