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
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'librarian' | 'student'
          roll_no: string | null
          department: string | null
          contact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role?: 'admin' | 'librarian' | 'student'
          roll_no?: string | null
          department?: string | null
          contact?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'librarian' | 'student'
          roll_no?: string | null
          department?: string | null
          contact?: string | null
          created_at?: string
          updated_at?: string
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
          id?: string
          isbn: string
          title: string
          author: string
          category: string
          publisher: string
          year: number
          stock?: number
          total_copies?: number
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
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
          created_at?: string
          updated_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          book_id: string | null
          student_id: string | null
          issue_date: string
          due_date: string
          return_date: string | null
          fine_amount: number | null
          fine_paid: boolean | null
          status: 'issued' | 'returned' | 'overdue'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id?: string | null
          student_id?: string | null
          issue_date?: string
          due_date: string
          return_date?: string | null
          fine_amount?: number | null
          fine_paid?: boolean | null
          status?: 'issued' | 'returned' | 'overdue'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string | null
          student_id?: string | null
          issue_date?: string
          due_date?: string
          return_date?: string | null
          fine_amount?: number | null
          fine_paid?: boolean | null
          status?: 'issued' | 'returned' | 'overdue'
          created_at?: string
          updated_at?: string
        }
      }
      fines: {
        Row: {
          id: string
          student_id: string | null
          issue_id: string | null
          amount: number
          reason: string
          date: string
          paid: boolean | null
          paid_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id?: string | null
          issue_id?: string | null
          amount?: number
          reason: string
          date?: string
          paid?: boolean | null
          paid_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string | null
          issue_id?: string | null
          amount?: number
          reason?: string
          date?: string
          paid?: boolean | null
          paid_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}