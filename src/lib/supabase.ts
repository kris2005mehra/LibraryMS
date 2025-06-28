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
          roll_no?: string
          department?: string
          contact?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'librarian' | 'student'
          roll_no?: string
          department?: string
          contact?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'librarian' | 'student'
          roll_no?: string
          department?: string
          contact?: string
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
          description?: string
          image_url?: string
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
          stock: number
          total_copies: number
          description?: string
          image_url?: string
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
          description?: string
          image_url?: string
          updated_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          book_id: string
          student_id: string
          issue_date: string
          due_date: string
          return_date?: string
          fine_amount?: number
          fine_paid: boolean
          status: 'issued' | 'returned' | 'overdue'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          student_id: string
          issue_date: string
          due_date: string
          return_date?: string
          fine_amount?: number
          fine_paid?: boolean
          status?: 'issued' | 'returned' | 'overdue'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          student_id?: string
          issue_date?: string
          due_date?: string
          return_date?: string
          fine_amount?: number
          fine_paid?: boolean
          status?: 'issued' | 'returned' | 'overdue'
          updated_at?: string
        }
      }
      fines: {
        Row: {
          id: string
          student_id: string
          issue_id: string
          amount: number
          reason: string
          date: string
          paid: boolean
          paid_date?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          issue_id: string
          amount: number
          reason: string
          date: string
          paid?: boolean
          paid_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          issue_id?: string
          amount?: number
          reason?: string
          date?: string
          paid?: boolean
          paid_date?: string
          updated_at?: string
        }
      }
    }
  }
}