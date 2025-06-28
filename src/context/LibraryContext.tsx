import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'librarian' | 'student';
  rollNo?: string;
  department?: string;
  contact?: string;
  joinDate: string;
}

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  year: number;
  stock: number;
  totalCopies: number;
  addedDate: string;
  description?: string;
  imageUrl?: string;
}

interface Issue {
  id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount?: number;
  finePaid: boolean;
  status: 'issued' | 'returned' | 'overdue';
}

interface Fine {
  id: string;
  studentId: string;
  issueId: string;
  amount: number;
  reason: string;
  date: string;
  paid: boolean;
  paidDate?: string;
}

interface LibraryStats {
  totalBooks: number;
  issuedBooks: number;
  overdueBooks: number;
  registeredStudents: number;
  todayReturns: number;
  totalFines: number;
  paidFines: number;
}

interface LibraryState {
  users: User[];
  books: Book[];
  issues: Issue[];
  fines: Fine[];
  stats: LibraryStats;
  darkMode: boolean;
  loading: boolean;
  error: string | null;
}

type LibraryAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_BOOKS'; payload: Book[] }
  | { type: 'SET_ISSUES'; payload: Issue[] }
  | { type: 'SET_FINES'; payload: Fine[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: string }
  | { type: 'ADD_ISSUE'; payload: Issue }
  | { type: 'UPDATE_ISSUE'; payload: Issue }
  | { type: 'ADD_FINE'; payload: Fine }
  | { type: 'UPDATE_FINE'; payload: Fine }
  | { type: 'TOGGLE_DARK_MODE' };

const initialState: LibraryState = {
  users: [],
  books: [],
  issues: [],
  fines: [],
  stats: {
    totalBooks: 0,
    issuedBooks: 0,
    overdueBooks: 0,
    registeredStudents: 0,
    todayReturns: 0,
    totalFines: 0,
    paidFines: 0,
  },
  darkMode: false,
  loading: true,
  error: null,
};

function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USERS':
      return { ...state, users: action.payload };
    case 'SET_BOOKS':
      return { ...state, books: action.payload };
    case 'SET_ISSUES':
      return { ...state, issues: action.payload };
    case 'SET_FINES':
      return { ...state, fines: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    case 'ADD_BOOK':
      return { ...state, books: [...state.books, action.payload] };
    case 'UPDATE_BOOK':
      return {
        ...state,
        books: state.books.map(book => 
          book.id === action.payload.id ? action.payload : book
        ),
      };
    case 'DELETE_BOOK':
      return {
        ...state,
        books: state.books.filter(book => book.id !== action.payload),
      };
    case 'ADD_ISSUE':
      return { ...state, issues: [...state.issues, action.payload] };
    case 'UPDATE_ISSUE':
      return {
        ...state,
        issues: state.issues.map(issue => 
          issue.id === action.payload.id ? action.payload : issue
        ),
      };
    case 'ADD_FINE':
      return { ...state, fines: [...state.fines, action.payload] };
    case 'UPDATE_FINE':
      return {
        ...state,
        fines: state.fines.map(fine => 
          fine.id === action.payload.id ? action.payload : fine
        ),
      };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

const LibraryContext = createContext<{
  state: LibraryState;
  dispatch: React.Dispatch<LibraryAction>;
  refreshData: () => Promise<void>;
} | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(libraryReducer, initialState);
  const { user } = useAuth();

  // Apply dark mode to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Fetch data from Supabase
  const refreshData = async () => {
    if (!user) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Fetch all data in parallel
      const [usersResponse, booksResponse, issuesResponse, finesResponse] = await Promise.all([
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('books').select('*').order('created_at', { ascending: false }),
        supabase.from('issues').select('*').order('created_at', { ascending: false }),
        supabase.from('fines').select('*').order('created_at', { ascending: false })
      ]);

      // Handle users
      if (usersResponse.error) {
        console.error('Error fetching users:', usersResponse.error);
      } else if (usersResponse.data) {
        const users: User[] = usersResponse.data.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          rollNo: u.roll_no,
          department: u.department,
          contact: u.contact,
          joinDate: u.created_at,
        }));
        dispatch({ type: 'SET_USERS', payload: users });
      }

      // Handle books
      if (booksResponse.error) {
        console.error('Error fetching books:', booksResponse.error);
      } else if (booksResponse.data) {
        const books: Book[] = booksResponse.data.map(b => ({
          id: b.id,
          isbn: b.isbn,
          title: b.title,
          author: b.author,
          category: b.category,
          publisher: b.publisher,
          year: b.year,
          stock: b.stock,
          totalCopies: b.total_copies,
          addedDate: b.created_at,
          description: b.description,
          imageUrl: b.image_url,
        }));
        dispatch({ type: 'SET_BOOKS', payload: books });
      }

      // Handle issues
      if (issuesResponse.error) {
        console.error('Error fetching issues:', issuesResponse.error);
      } else if (issuesResponse.data) {
        const issues: Issue[] = issuesResponse.data.map(i => ({
          id: i.id,
          bookId: i.book_id,
          studentId: i.student_id,
          issueDate: i.issue_date,
          dueDate: i.due_date,
          returnDate: i.return_date,
          fineAmount: i.fine_amount,
          finePaid: i.fine_paid,
          status: i.status,
        }));
        dispatch({ type: 'SET_ISSUES', payload: issues });
      }

      // Handle fines
      if (finesResponse.error) {
        console.error('Error fetching fines:', finesResponse.error);
      } else if (finesResponse.data) {
        const fines: Fine[] = finesResponse.data.map(f => ({
          id: f.id,
          studentId: f.student_id,
          issueId: f.issue_id,
          amount: f.amount,
          reason: f.reason,
          date: f.date,
          paid: f.paid,
          paidDate: f.paid_date,
        }));
        dispatch({ type: 'SET_FINES', payload: fines });
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load library data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      // Reset state when user logs out
      dispatch({ type: 'SET_USERS', payload: [] });
      dispatch({ type: 'SET_BOOKS', payload: [] });
      dispatch({ type: 'SET_ISSUES', payload: [] });
      dispatch({ type: 'SET_FINES', payload: [] });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  return (
    <LibraryContext.Provider value={{ state, dispatch, refreshData }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}