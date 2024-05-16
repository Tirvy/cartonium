
// let movie: Tables<'clubs_collections'>;

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
          id: number
        }
        Insert: {
          club_id: string
          created_at?: string
          game_box_id: number
          id?: number
        }
        Update: {
          club_id?: string
          created_at?: string
          game_box_id?: number
          id?: number
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
          text_html: string
        }
        Insert: {
          club_id?: string
          created_at?: string
          text_html: string
        }
        Update: {
          club_id?: string
          created_at?: string
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
      gameboxes: {
        Row: {
          aliasTesera: string | null
          id: number
          idBgg: number | null
          idTesera: number | null
          linkBgg: string | null
          linkTesera: string | null
          photoUrl: string | null
          playersGood: number[] | null
          playersMax: number | null
          playersMin: number | null
          playtimeAvg: number | null
          playtimeMax: number | null
          playtimeMin: number | null
          ratingBgg: number | null
          ratingTesera: number | null
          title: string
          titles: string[] | null
          year: number | null
        }
        Insert: {
          aliasTesera?: string | null
          id?: number
          idBgg?: number | null
          idTesera?: number | null
          linkBgg?: string | null
          linkTesera?: string | null
          photoUrl?: string | null
          playersGood?: number[] | null
          playersMax?: number | null
          playersMin?: number | null
          playtimeAvg?: number | null
          playtimeMax?: number | null
          playtimeMin?: number | null
          ratingBgg?: number | null
          ratingTesera?: number | null
          title: string
          titles?: string[] | null
          year?: number | null
        }
        Update: {
          aliasTesera?: string | null
          id?: number
          idBgg?: number | null
          idTesera?: number | null
          linkBgg?: string | null
          linkTesera?: string | null
          photoUrl?: string | null
          playersGood?: number[] | null
          playersMax?: number | null
          playersMin?: number | null
          playtimeAvg?: number | null
          playtimeMax?: number | null
          playtimeMin?: number | null
          ratingBgg?: number | null
          ratingTesera?: number | null
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
          guests_max: number
          id: number
          owner: string
          start_date: string | null
          gameboxes_ids: number[]
        }
        Insert: {
          club_id: string
          comment_club?: string
          comment_owner?: string
          created_at?: string
          guests_max: number
          id?: number
          owner?: string
          start_date?: string | null
          gameboxes_ids: number[]
        }
        Update: {
          club_id?: string
          comment_club?: string
          comment_owner?: string
          created_at?: string
          guests_max?: number
          id?: number
          owner?: string
          start_date?: string | null
          gameboxes_ids: number[]
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
            foreignKeyName: "public_gatherings_owner_fkey"
            columns: ["owner"]
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
          aliasTesera: string 
          club_id: string[] 
          id: number
          idBgg: number 
          idTesera: number 
          linkBgg: string 
          linkTesera: string 
          photoUrl: string 
          playersGood: number[] 
          playersMax: number 
          playersMin: number 
          playtimeAvg: number 
          playtimeMax: number 
          playtimeMin: number 
          ratingBgg: number 
          ratingTesera: number
          title: string
          titles: string[] 
          year: number 
        }
        Relationships: []
      }
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
