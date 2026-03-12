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
      blog_articles: {
        Row: {
          id: string
          slug: string
          meta_title: string
          meta_description: string
          tags: string[]
          markdown: string
          status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          slug: string
          meta_title: string
          meta_description: string
          tags?: string[]
          markdown: string
          status?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          slug?: string
          meta_title?: string
          meta_description?: string
          tags?: string[]
          markdown?: string
          status?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
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
