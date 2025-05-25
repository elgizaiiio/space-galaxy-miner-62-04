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
          created_at: string | null
          id: number
          setting_key: string
          setting_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          setting_key: string
          setting_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mining_sessions: {
        Row: {
          claimed_amount: number | null
          created_at: string | null
          end_time: string | null
          id: string
          is_active: boolean | null
          last_claimed_at: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          claimed_amount?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          last_claimed_at?: string | null
          start_time?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          claimed_amount?: number | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          is_active?: boolean | null
          last_claimed_at?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mining_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referred_user_id: string
          referrer_id: string
          reward_amount: number | null
          reward_claimed: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referred_user_id: string
          referrer_id: string
          reward_amount?: number | null
          reward_claimed?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referred_user_id?: string
          referrer_id?: string
          reward_amount?: number | null
          reward_claimed?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_user_id_fkey"
            columns: ["referred_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          action_url: string | null
          created_at: string | null
          description_key: string
          id: string
          is_active: boolean | null
          reward_amount: number
          task_type: string
          title_key: string
          updated_at: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          description_key: string
          id?: string
          is_active?: boolean | null
          reward_amount: number
          task_type: string
          title_key: string
          updated_at?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          description_key?: string
          id?: string
          is_active?: boolean | null
          reward_amount?: number
          task_type?: string
          title_key?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_tasks: {
        Row: {
          completed_at: string | null
          id: string
          is_verified: boolean | null
          task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          id?: string
          is_verified?: boolean | null
          task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          id?: string
          is_verified?: boolean | null
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
          {
            foreignKeyName: "user_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          auto_mining_end_time: string | null
          bolt_balance: number | null
          created_at: string | null
          first_name: string | null
          has_joined_telegram_community: boolean | null
          id: string
          last_known_chat_id: number | null
          last_login: string | null
          last_name: string | null
          mining_rate_multiplier: number | null
          referral_code: string | null
          referred_by: string | null
          selected_background: string | null
          telegram_id: number
          updated_at: string | null
          user_language_code: string | null
          username: string | null
        }
        Insert: {
          auto_mining_end_time?: string | null
          bolt_balance?: number | null
          created_at?: string | null
          first_name?: string | null
          has_joined_telegram_community?: boolean | null
          id?: string
          last_known_chat_id?: number | null
          last_login?: string | null
          last_name?: string | null
          mining_rate_multiplier?: number | null
          referral_code?: string | null
          referred_by?: string | null
          selected_background?: string | null
          telegram_id: number
          updated_at?: string | null
          user_language_code?: string | null
          username?: string | null
        }
        Update: {
          auto_mining_end_time?: string | null
          bolt_balance?: number | null
          created_at?: string | null
          first_name?: string | null
          has_joined_telegram_community?: boolean | null
          id?: string
          last_known_chat_id?: number | null
          last_login?: string | null
          last_name?: string | null
          mining_rate_multiplier?: number | null
          referral_code?: string | null
          referred_by?: string | null
          selected_background?: string | null
          telegram_id?: number
          updated_at?: string | null
          user_language_code?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_mining_rewards: {
        Args: { session_uuid: string }
        Returns: number
      }
      start_mining_session: {
        Args: { user_uuid: string }
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
