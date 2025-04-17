// src/types/supabase.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export type Database = {
  public: {
    Tables: {
      rss_posts: {
        Row: {
          id: string
          slug: string
          title: string
          content: string
          link: string | null
          published_at: string | null
          source: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          content: string
          link?: string | null
          published_at?: string | null
          source?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          content?: string
          link?: string | null
          published_at?: string | null
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}
