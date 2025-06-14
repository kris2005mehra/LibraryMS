import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Book, Issue, Fine, LibraryStats } from '../types';

interface LibraryState {
  user: User | null;
  users: User[];
  books: Book[];
  issues: Issue[];
  fines: Fine[];
  stats: LibraryStats;
  darkMode: boolean;
}

type LibraryAction = 
  | { type: 'SET_USER'; payload: User | null }
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
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_DATA'; payload: Partial<LibraryState> };

const initialState: LibraryState = {
  user: null,
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
};

function libraryReducer(state: LibraryState, action: LibraryAction): LibraryState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
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
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const LibraryContext = createContext<{
  state: LibraryState;
  dispatch: React.Dispatch<LibraryAction>;
} | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(libraryReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('libraryData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    } else {
      // Initialize with sample data
      const sampleData = {
        users: [
          {
            id: '1',
            name: 'Admin User',
            email: 'admin@nit.ac.in',
            role: 'admin' as const,
            joinDate: '2024-01-01',
          },
          {
            id: '2',
            name: 'Librarian',
            email: 'librarian@nit.ac.in',
            password: 'lib123',
            role: 'librarian' as const,
            joinDate: '2024-01-01',
          },
          {
            id: '3',
            name: 'Kris Mehra',
            email: 'kris@student.nit.ac.in',
            role: 'student' as const,
            rollNo: 'CSE2021001',
            department: 'Computer Science',
            contact: '+91-9876543210',
            joinDate: '2024-01-15',
          },
        ],
        books: [
          {
            id: '1',
            isbn: '978-3-16-148410-0',
            title: 'Introduction to Algorithms',
            author: 'Thomas H. Cormen',
            category: 'Computer Science',
            publisher: 'MIT Press',
            year: 2022,
            stock: 5,
            totalCopies: 10,
            addedDate: '2024-01-10',
            description: 'Comprehensive guide to algorithms and data structures',
          },
          {
            id: '2',
            isbn: '978-0-13-449648-7',
            title: 'Clean Code',
            author: 'Robert C. Martin',
            category: 'Software Engineering',
            publisher: 'Prentice Hall',
            year: 2021,
            stock: 3,
            totalCopies: 5,
            addedDate: '2024-01-12',
            description: 'A handbook of agile software craftsmanship',
          },
        ],
      };
      dispatch({ type: 'LOAD_DATA', payload: sampleData });
    }
  }, []);

  useEffect(() => {
    const dataToSave = {
      users: state.users,
      books: state.books,
      issues: state.issues,
      fines: state.fines,
      darkMode: state.darkMode,
    };
    localStorage.setItem('libraryData', JSON.stringify(dataToSave));
  }, [state.users, state.books, state.issues, state.fines, state.darkMode]);

  return (
    <LibraryContext.Provider value={{ state, dispatch }}>
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