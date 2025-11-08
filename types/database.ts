export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ArticleStatus =
  | 'queued'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'needs_review'
  | 'ready_to_publish'
  | 'published'

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          url: string
          source: string
          publication_date: string
          ingestion_date: string
          raw_html: string | null
          cleaned_text: string | null
          metadata: Json | null
          status: ArticleStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          source: string
          publication_date: string
          ingestion_date?: string
          raw_html?: string | null
          cleaned_text?: string | null
          metadata?: Json | null
          status?: ArticleStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          url?: string
          source?: string
          publication_date?: string
          ingestion_date?: string
          raw_html?: string | null
          cleaned_text?: string | null
          metadata?: Json | null
          status?: ArticleStatus
          created_at?: string
          updated_at?: string
        }
      }
      annotators: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          role: 'admin' | 'annotator'
          is_active: boolean
          articles_completed: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          role?: 'admin' | 'annotator'
          is_active?: boolean
          articles_completed?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          role?: 'admin' | 'annotator'
          is_active?: boolean
          articles_completed?: number
          created_at?: string
          updated_at?: string
        }
      }
      annotations: {
        Row: {
          id: string
          article_id: string
          annotator_id: string
          sentence_id: string
          bias_present: boolean
          bias_type: string | null
          bias_explanation: string | null
          suggested_rewrite: string | null
          confidence_level: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          article_id: string
          annotator_id: string
          sentence_id: string
          bias_present: boolean
          bias_type?: string | null
          bias_explanation?: string | null
          suggested_rewrite?: string | null
          confidence_level: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          annotator_id?: string
          sentence_id?: string
          bias_present?: boolean
          bias_type?: string | null
          bias_explanation?: string | null
          suggested_rewrite?: string | null
          confidence_level?: number
          created_at?: string
          updated_at?: string
        }
      }
      sentences: {
        Row: {
          id: string
          article_id: string
          sentence_text: string
          sentence_order: number
          paragraph_number: number
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          sentence_text: string
          sentence_order: number
          paragraph_number: number
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          sentence_text?: string
          sentence_order?: number
          paragraph_number?: number
          created_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          article_id: string
          annotator_id: string
          assigned_at: string
          completed_at: string | null
          status: 'assigned' | 'in_progress' | 'completed'
        }
        Insert: {
          id?: string
          article_id: string
          annotator_id: string
          assigned_at?: string
          completed_at?: string | null
          status?: 'assigned' | 'in_progress' | 'completed'
        }
        Update: {
          id?: string
          article_id?: string
          annotator_id?: string
          assigned_at?: string
          completed_at?: string | null
          status?: 'assigned' | 'in_progress' | 'completed'
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
