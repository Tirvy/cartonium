export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
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
          titleTranslations: Json | null
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
          titleTranslations?: Json | null
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
          titleTranslations?: Json | null
          year?: number | null
        }
        Relationships: []
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
