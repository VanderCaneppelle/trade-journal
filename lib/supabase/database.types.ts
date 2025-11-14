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
      trades: {
        Row: {
          id: string
          user_id: string
          timestamp: string
          symbol: string
          side: 'LONG' | 'SHORT'
          quantity: number
          entry_price: number
          exit_price: number
          pnl: number
          setup: string | null
          tags: string[] | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          timestamp: string
          symbol: string
          side: 'LONG' | 'SHORT'
          quantity: number
          entry_price: number
          exit_price: number
          pnl: number
          setup?: string | null
          tags?: string[] | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          timestamp?: string
          symbol?: string
          side?: 'LONG' | 'SHORT'
          quantity?: number
          entry_price?: number
          exit_price?: number
          pnl?: number
          setup?: string | null
          tags?: string[] | null
          notes?: string | null
          created_at?: string
        }
      }
      setups: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          created_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
        }
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
  }
}

