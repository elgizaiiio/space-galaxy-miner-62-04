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
      cards: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          hourly_yield: number | null
          id: string
          name: string
          price: number | null
          rarity: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          hourly_yield?: number | null
          id?: string
          name: string
          price?: number | null
          rarity?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          hourly_yield?: number | null
          id?: string
          name?: string
          price?: number | null
          rarity?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_event_participants: {
        Row: {
          event_id: string
          id: string
          participated_at: string | null
          user_id: string
        }
        Insert: {
          event_id: string
          id?: string
          participated_at?: string | null
          user_id: string
        }
        Update: {
          event_id?: string
          id?: string
          participated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "daily_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_event_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_events: {
        Row: {
          created_at: string | null
          event_date: string
          id: string
          min_invites_required: number | null
          prize_gift_id: string | null
          status: string | null
          total_participants: number | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_date?: string
          id?: string
          min_invites_required?: number | null
          prize_gift_id?: string | null
          status?: string | null
          total_participants?: number | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_date?: string
          id?: string
          min_invites_required?: number | null
          prize_gift_id?: string | null
          status?: string | null
          total_participants?: number | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_events_prize_gift_id_fkey"
            columns: ["prize_gift_id"]
            isOneToOne: false
            referencedRelation: "gift_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_events_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gift_items: {
        Row: {
          created_at: string | null
          emoji: string
          id: string
          is_available: boolean | null
          name: string
          rarity: string | null
          star_price: number
          telegram_gift_id: string | null
          ton_price: number | null
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id?: string
          is_available?: boolean | null
          name: string
          rarity?: string | null
          star_price: number
          telegram_gift_id?: string | null
          ton_price?: number | null
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          is_available?: boolean | null
          name?: string
          rarity?: string | null
          star_price?: number
          telegram_gift_id?: string | null
          ton_price?: number | null
        }
        Relationships: []
      }
      gift_transactions: {
        Row: {
          amount: number | null
          created_at: string | null
          gift_id: string
          id: string
          message: string | null
          receiver_id: string | null
          sender_id: string
          status: string | null
          telegram_payment_id: string | null
          ton_amount: number | null
          transaction_type: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          gift_id: string
          id?: string
          message?: string | null
          receiver_id?: string | null
          sender_id: string
          status?: string | null
          telegram_payment_id?: string | null
          ton_amount?: number | null
          transaction_type: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          gift_id?: string
          id?: string
          message?: string | null
          receiver_id?: string | null
          sender_id?: string
          status?: string | null
          telegram_payment_id?: string | null
          ton_amount?: number | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_transactions_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gift_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_transactions_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_transactions_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_gifts: {
        Row: {
          created_at: string | null
          display_order: number | null
          gift_id: string
          id: string
          is_displayed: boolean | null
          transaction_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          gift_id: string
          id?: string
          is_displayed?: boolean | null
          transaction_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          gift_id?: string
          id?: string
          is_displayed?: boolean | null
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_gifts_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gift_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_gifts_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "gift_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_gifts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          action_url: string | null
          category: string | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          description_key: string | null
          id: string
          is_active: boolean | null
          link: string | null
          reward: string | null
          reward_amount: number | null
          task_type: string | null
          title: string | null
          title_key: string | null
          updated_at: string | null
        }
        Insert: {
          action_url?: string | null
          category?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          description_key?: string | null
          id?: string
          is_active?: boolean | null
          link?: string | null
          reward?: string | null
          reward_amount?: number | null
          task_type?: string | null
          title?: string | null
          title_key?: string | null
          updated_at?: string | null
        }
        Update: {
          action_url?: string | null
          category?: string | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          description_key?: string | null
          id?: string
          is_active?: boolean | null
          link?: string | null
          reward?: string | null
          reward_amount?: number | null
          task_type?: string | null
          title?: string | null
          title_key?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          from_address: string | null
          id: string
          status: string
          to_address: string | null
          transaction_hash: string | null
          transaction_type: string
          updated_at: string
          user_address: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          from_address?: string | null
          id?: string
          status?: string
          to_address?: string | null
          transaction_hash?: string | null
          transaction_type: string
          updated_at?: string
          user_address: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          from_address?: string | null
          id?: string
          status?: string
          to_address?: string | null
          transaction_hash?: string | null
          transaction_type?: string
          updated_at?: string
          user_address?: string
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          id: string
          last_updated: string
          shrouk_balance: number
          ton_balance: number
          user_address: string
        }
        Insert: {
          id?: string
          last_updated?: string
          shrouk_balance?: number
          ton_balance?: number
          user_address: string
        }
        Update: {
          id?: string
          last_updated?: string
          shrouk_balance?: number
          ton_balance?: number
          user_address?: string
        }
        Relationships: []
      }
      user_cards: {
        Row: {
          card_id: string
          id: string
          last_yield_claim: string | null
          level: number
          owned_at: string
          user_address: string
        }
        Insert: {
          card_id: string
          id?: string
          last_yield_claim?: string | null
          level?: number
          owned_at?: string
          user_address: string
        }
        Update: {
          card_id?: string
          id?: string
          last_yield_claim?: string | null
          level?: number
          owned_at?: string
          user_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cards_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_game_data: {
        Row: {
          created_at: string | null
          energy_level: number | null
          id: string
          last_mining_claim: string | null
          max_energy: number | null
          mining_rate: number | null
          referral_count: number | null
          tap_multiplier: number | null
          total_balance: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          last_mining_claim?: string | null
          max_energy?: number | null
          mining_rate?: number | null
          referral_count?: number | null
          tap_multiplier?: number | null
          total_balance?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          last_mining_claim?: string | null
          max_energy?: number | null
          mining_rate?: number | null
          referral_count?: number | null
          tap_multiplier?: number | null
          total_balance?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_game_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_invitations: {
        Row: {
          created_at: string | null
          id: string
          invite_code: string
          invited_user_id: string | null
          inviter_id: string
          reward_amount: number | null
          reward_claimed: boolean | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          invite_code: string
          invited_user_id?: string | null
          inviter_id: string
          reward_amount?: number | null
          reward_claimed?: boolean | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          invite_code?: string
          invited_user_id?: string | null
          inviter_id?: string
          reward_amount?: number | null
          reward_claimed?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_invitations_invited_user_id_fkey"
            columns: ["invited_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          invite_code: string | null
          invited_by: string | null
          last_name: string | null
          telegram_stars_balance: number | null
          telegram_user_id: number
          ton_balance: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          invite_code?: string | null
          invited_by?: string | null
          last_name?: string | null
          telegram_stars_balance?: number | null
          telegram_user_id: number
          ton_balance?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          invite_code?: string | null
          invited_by?: string | null
          last_name?: string | null
          telegram_stars_balance?: number | null
          telegram_user_id?: number
          ton_balance?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_tap_points: {
        Row: {
          created_at: string | null
          last_tap_at: string | null
          max_taps: number
          tap_points: number
          tap_upgrade_level: number
          tap_value: number
          updated_at: string | null
          user_address: string
        }
        Insert: {
          created_at?: string | null
          last_tap_at?: string | null
          max_taps?: number
          tap_points?: number
          tap_upgrade_level?: number
          tap_value?: number
          updated_at?: string | null
          user_address: string
        }
        Update: {
          created_at?: string | null
          last_tap_at?: string | null
          max_taps?: number
          tap_points?: number
          tap_upgrade_level?: number
          tap_value?: number
          updated_at?: string | null
          user_address?: string
        }
        Relationships: []
      }
      user_task_completions: {
        Row: {
          completed_at: string
          id: string
          reward_claimed: boolean
          task_id: string
          user_address: string
        }
        Insert: {
          completed_at?: string
          id?: string
          reward_claimed?: boolean
          task_id: string
          user_address: string
        }
        Update: {
          completed_at?: string
          id?: string
          reward_claimed?: boolean
          task_id?: string
          user_address?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_complete_data: {
        Args: { p_user_id: string }
        Returns: Json
      }
      get_user_hourly_earnings: {
        Args: { user_addr: string }
        Returns: number
      }
      process_card_yields: {
        Args: { user_addr: string }
        Returns: number
      }
      sync_telegram_user: {
        Args: {
          p_telegram_user_id: number
          p_first_name: string
          p_last_name?: string
          p_username?: string
          p_referral_code?: string
        }
        Returns: string
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
