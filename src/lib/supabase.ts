import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          college: string
          bio: string | null
          profile_image: string | null
          skills: string[]
          hourly_rate: number
          is_available: boolean
          rating: number
          total_sessions: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          college: string
          bio?: string | null
          profile_image?: string | null
          skills: string[]
          hourly_rate: number
          is_available?: boolean
          rating?: number
          total_sessions?: number
        }
        Update: {
          name?: string
          college?: string
          bio?: string | null
          profile_image?: string | null
          skills?: string[]
          hourly_rate?: number
          is_available?: boolean
          rating?: number
          total_sessions?: number
        }
      }
      sessions: {
        Row: {
          id: string
          mentor_id: string
          student_id: string
          amount: number
          status: 'pending' | 'active' | 'completed' | 'cancelled'
          stripe_payment_intent_id: string | null
          started_at: string | null
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          mentor_id: string
          student_id: string
          amount: number
          status?: 'pending' | 'active' | 'completed' | 'cancelled'
          stripe_payment_intent_id?: string | null
        }
        Update: {
          status?: 'pending' | 'active' | 'completed' | 'cancelled'
          stripe_payment_intent_id?: string | null
          started_at?: string | null
          ended_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          session_id: string
          sender_id: string
          content: string
          created_at: string
        }
        Insert: {
          session_id: string
          sender_id: string
          content: string
        }
        Update: {
          content?: string
        }
      }
      ratings: {
        Row: {
          id: string
          session_id: string
          mentor_id: string
          student_id: string
          rating: number
          feedback: string | null
          created_at: string
        }
        Insert: {
          session_id: string
          mentor_id: string
          student_id: string
          rating: number
          feedback?: string | null
        }
        Update: {
          rating?: number
          feedback?: string | null
        }
      }
    }
  }
}