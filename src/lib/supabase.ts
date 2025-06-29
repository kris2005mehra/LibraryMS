import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          role: 'admin' | 'librarian' | 'student'
          roll_no: string | null
          department: string | null
          contact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          role: 'admin' | 'librarian' | 'student'
          roll_no?: string | null
          department?: string | null
          contact?: string | null
        }
        Update: {
          name?: string
          role?: 'admin' | 'librarian' | 'student'
          roll_no?: string | null
          department?: string | null
          contact?: string | null
        }
      }
      books: {
        Row: {
          id: string
          isbn: string
          title: string
          author: string
          category: string
          publisher: string
          year: number
          stock: number
          total_copies: number
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          isbn: string
          title: string
          author: string
          category: string
          publisher: string
          year: number
          stock: number
          total_copies: number
          description?: string | null
          image_url?: string | null
        }
        Update: {
          isbn?: string
          title?: string
          author?: string
          category?: string
          publisher?: string
          year?: number
          stock?: number
          total_copies?: number
          description?: string | null
          image_url?: string | null
        }
      }
      issues: {
        Row: {
          id: string
          book_id: string
          student_id: string
          issue_date: string
          due_date: string
          return_date: string | null
          fine_amount: number | null
          fine_paid: boolean
          status: 'issued' | 'returned' | 'overdue'
          created_at: string
          updated_at: string
        }
        Insert: {
          book_id: string
          student_id: string
          issue_date: string
          due_date: string
          return_date?: string | null
          fine_amount?: number | null
          fine_paid?: boolean
          status?: 'issued' | 'returned' | 'overdue'
        }
        Update: {
          return_date?: string | null
          fine_amount?: number | null
          fine_paid?: boolean
          status?: 'issued' | 'returned' | 'overdue'
        }
      }
      fines: {
        Row: {
          id: string
          student_id: string
          issue_id: string
          amount: number
          reason: string
          paid: boolean
          paid_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          student_id: string
          issue_id: string
          amount: number
          reason: string
          paid?: boolean
          paid_date?: string | null
        }
        Update: {
          paid?: boolean
          paid_date?: string | null
        }
      }
    }
  }
}