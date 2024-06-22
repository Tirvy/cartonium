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
      clubs: {
        Row: {
          created_at: string
          id: string
          title: string
          url_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          url_name: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          url_name?: string
        }
        Relationships: []
      }
      clubs_collections: {
        Row: {
          club_id: string
          created_at: string
          game_box_id: number
        }
        Insert: {
          club_id: string
          created_at?: string
          game_box_id: number
        }
        Update: {
          club_id?: string
          created_at?: string
          game_box_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "clubs_collections_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_collections_game_box_id_fkey"
            columns: ["game_box_id"]
            isOneToOne: false
            referencedRelation: "gameboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clubs_collections_game_box_id_fkey"
            columns: ["game_box_id"]
            isOneToOne: false
            referencedRelation: "gameboxes_with_club_id"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs_info: {
        Row: {
          club_id: string
          created_at: string
          text_delta: Json
          text_html: string
        }
        Insert: {
          club_id?: string
          created_at?: string
          text_delta?: Json
          text_html: string
        }
        Update: {
          club_id?: string
          created_at?: string
          text_delta?: Json
          text_html?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_info_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: true
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs_settings: {
        Row: {
          avatar_url: string | null
          club_id: string
          created_at: string
          guest_can_gather_own: boolean
          guest_can_reserve: boolean
          themes: Json | null
        }
        Insert: {
          avatar_url?: string | null
          club_id: string
          created_at?: string
          guest_can_gather_own?: boolean
          guest_can_reserve?: boolean
          themes?: Json | null
        }
        Update: {
          avatar_url?: string | null
          club_id?: string
          created_at?: string
          guest_can_gather_own?: boolean
          guest_can_reserve?: boolean
          themes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "clubs_settings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: true
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      gameboxes: {
        Row: {
          alias_tesera: string | null
          id: number
          id_bgg: number | null
          id_tesera: number | null
          link_bgg: string | null
          link_tesera: string | null
          photo_url: string | null
          players_good: number[] | null
          players_max: number | null
          players_min: number | null
          playtime_avg: number | null
          playtime_max: number | null
          playtime_min: number | null
          rating_bgg: number | null
          rating_tesera: number | null
          title: string
          titles: string[] | null
          year: number | null
        }
        Insert: {
          alias_tesera?: string | null
          id?: number
          id_bgg?: number | null
          id_tesera?: number | null
          link_bgg?: string | null
          link_tesera?: string | null
          photo_url?: string | null
          players_good?: number[] | null
          players_max?: number | null
          players_min?: number | null
          playtime_avg?: number | null
          playtime_max?: number | null
          playtime_min?: number | null
          rating_bgg?: number | null
          rating_tesera?: number | null
          title: string
          titles?: string[] | null
          year?: number | null
        }
        Update: {
          alias_tesera?: string | null
          id?: number
          id_bgg?: number | null
          id_tesera?: number | null
          link_bgg?: string | null
          link_tesera?: string | null
          photo_url?: string | null
          players_good?: number[] | null
          players_max?: number | null
          players_min?: number | null
          playtime_avg?: number | null
          playtime_max?: number | null
          playtime_min?: number | null
          rating_bgg?: number | null
          rating_tesera?: number | null
          title?: string
          titles?: string[] | null
          year?: number | null
        }
        Relationships: []
      }
      gatherings: {
        Row: {
          club_id: string
          comment_club: string
          comment_owner: string
          created_at: string
          gamebox_id: number | null
          guests_max: number
          id: number
          own_name: string | null
          owner: string
          start_date: string | null
          table_id: number | null
        }
        Insert: {
          club_id: string
          comment_club?: string
          comment_owner?: string
          created_at?: string
          gamebox_id?: number | null
          guests_max: number
          id?: number
          own_name?: string | null
          owner?: string
          start_date?: string | null
          table_id?: number | null
        }
        Update: {
          club_id?: string
          comment_club?: string
          comment_owner?: string
          created_at?: string
          gamebox_id?: number | null
          guests_max?: number
          id?: number
          own_name?: string | null
          owner?: string
          start_date?: string | null
          table_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "gatherings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gatherings_gamebox_id_fkey"
            columns: ["gamebox_id"]
            isOneToOne: false
            referencedRelation: "gameboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gatherings_gamebox_id_fkey"
            columns: ["gamebox_id"]
            isOneToOne: false
            referencedRelation: "gameboxes_with_club_id"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gatherings_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_gatherings_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gatherings_gameboxes: {
        Row: {
          gamebox_id: number
          gathering_id: number
        }
        Insert: {
          gamebox_id: number
          gathering_id: number
        }
        Update: {
          gamebox_id?: number
          gathering_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "gatherings_gameboxes_gamebox_id_fkey"
            columns: ["gamebox_id"]
            isOneToOne: false
            referencedRelation: "gameboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gatherings_gameboxes_gamebox_id_fkey"
            columns: ["gamebox_id"]
            isOneToOne: false
            referencedRelation: "gameboxes_with_club_id"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gatherings_gameboxes_gathering_id_fkey"
            columns: ["gathering_id"]
            isOneToOne: false
            referencedRelation: "gatherings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gatherings_gameboxes_gathering_id_fkey"
            columns: ["gathering_id"]
            isOneToOne: false
            referencedRelation: "gatherings_with_guests"
            referencedColumns: ["id"]
          },
        ]
      }
      gatherings_guests: {
        Row: {
          created_at: string
          gathering_id: number | null
          guests_number: number
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          gathering_id?: number | null
          guests_number: number
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          gathering_id?: number | null
          guests_number?: number
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gathering_guests_gathering_id_fkey"
            columns: ["gathering_id"]
            isOneToOne: false
            referencedRelation: "gatherings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gathering_guests_gathering_id_fkey"
            columns: ["gathering_id"]
            isOneToOne: false
            referencedRelation: "gatherings_with_guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gathering_guests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles_club_rights: {
        Row: {
          club_id: string | null
          created_at: string
          id: number
          profile_id: string | null
          relation_type: string
        }
        Insert: {
          club_id?: string | null
          created_at?: string
          id?: number
          profile_id?: string | null
          relation_type: string
        }
        Update: {
          club_id?: string | null
          created_at?: string
          id?: number
          profile_id?: string | null
          relation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_club_rights_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_club_rights_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          club_id: string
          created_at: string
          description: string
          id: number
          people_max: number
          title: string
        }
        Insert: {
          club_id: string
          created_at?: string
          description?: string
          id?: number
          people_max?: number
          title?: string
        }
        Update: {
          club_id?: string
          created_at?: string
          description?: string
          id?: number
          people_max?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tables_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          checkSum: number | null
          checkType: string | null
          end: string | null
          firebaseId: string | null
          id: number
          start: string | null
          visiterId: string
        }
        Insert: {
          checkSum?: number | null
          checkType?: string | null
          end?: string | null
          firebaseId?: string | null
          id?: number
          start?: string | null
          visiterId: string
        }
        Update: {
          checkSum?: number | null
          checkType?: string | null
          end?: string | null
          firebaseId?: string | null
          id?: number
          start?: string | null
          visiterId?: string
        }
        Relationships: []
      }
    }
    Views: {
      gameboxes_with_club_id: {
        Row: {
          alias_tesera: string | null
          club_id: string[] | null
          id: number | null
          id_bgg: number | null
          id_tesera: number | null
          link_bgg: string | null
          link_tesera: string | null
          photo_url: string | null
          players_good: number[] | null
          players_max: number | null
          players_min: number | null
          playtime_avg: number | null
          playtime_max: number | null
          playtime_min: number | null
          rating_bgg: number | null
          rating_tesera: number | null
          title: string | null
          titles: string[] | null
          year: number | null
        }
        Relationships: []
      }
      gatherings_with_guests: {
        Row: {
          avatar_url: string | null
          club_id: string | null
          comment_club: string | null
          comment_owner: string | null
          created_at: string | null
          full_name: string | null
          gamebox_id: number | null
          guest_id: number | null
          guests_max: number | null
          guests_number: number | null
          id: number | null
          own_name: string | null
          owner: string | null
          start_date: string | null
          table_id: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gathering_guests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gatherings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gatherings_gamebox_id_fkey"
            columns: ["gamebox_id"]
            isOneToOne: false
            referencedRelation: "gameboxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gatherings_gamebox_id_fkey"
            columns: ["gamebox_id"]
            isOneToOne: false
            referencedRelation: "gameboxes_with_club_id"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gatherings_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_gatherings_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      refresh_materialized_view: {
        Args: {
          view_name: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
