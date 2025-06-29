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
  | { type: 'LOAD_DATA'; payload: Partial<LibraryState> }
  | { type: 'RESET_DATA' };

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

// Sample data with comprehensive reference books
const getSampleData = () => ({
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
    {
      id: '4',
      name: 'Priya Sharma',
      email: 'priya@student.nit.ac.in',
      role: 'student' as const,
      rollNo: 'ECE2021002',
      department: 'Electronics',
      contact: '+91-9876543211',
      joinDate: '2024-01-16',
    },
    {
      id: '5',
      name: 'Rahul Kumar',
      email: 'rahul@student.nit.ac.in',
      role: 'student' as const,
      rollNo: 'ME2021003',
      department: 'Mechanical Engineering',
      contact: '+91-9876543212',
      joinDate: '2024-01-17',
    },
    {
      id: '6',
      name: 'Ananya Singh',
      email: 'ananya@student.nit.ac.in',
      role: 'student' as const,
      rollNo: 'CSE2021004',
      department: 'Computer Science',
      contact: '+91-9876543213',
      joinDate: '2024-01-18',
    },
  ],
  books: [
    // Computer Science Reference Books
    {
      id: '1',
      isbn: '978-0-262-03384-8',
      title: 'Introduction to Algorithms',
      author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
      category: 'Computer Science',
      publisher: 'MIT Press',
      year: 2022,
      stock: 8,
      totalCopies: 12,
      addedDate: '2024-01-10',
      description: 'The most comprehensive guide to algorithms, covering a broad range of algorithms in depth, yet makes their design and analysis accessible to all levels of readers. Essential reference for computer science students.',
      imageUrl: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '2',
      isbn: '978-0-13-394803-8',
      title: 'Database System Concepts',
      author: 'Abraham Silberschatz, Henry F. Korth, S. Sudarshan',
      category: 'Computer Science',
      publisher: 'McGraw-Hill',
      year: 2022,
      stock: 6,
      totalCopies: 10,
      addedDate: '2024-01-12',
      description: 'Comprehensive introduction to database systems covering design, implementation, and management. The definitive textbook for database courses with practical examples.',
      imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '3',
      isbn: '978-0-321-57351-3',
      title: 'Operating System Concepts',
      author: 'Abraham Silberschatz, Peter Baer Galvin, Greg Gagne',
      category: 'Computer Science',
      publisher: 'Wiley',
      year: 2021,
      stock: 7,
      totalCopies: 11,
      addedDate: '2024-01-14',
      description: 'The definitive guide to operating systems, covering process management, memory management, file systems, and distributed systems. Known as the "Dinosaur Book".',
      imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '4',
      isbn: '978-0-13-449505-3',
      title: 'Computer Networks',
      author: 'Andrew S. Tanenbaum, David J. Wetherall',
      category: 'Computer Science',
      publisher: 'Pearson',
      year: 2022,
      stock: 5,
      totalCopies: 8,
      addedDate: '2024-01-16',
      description: 'Comprehensive coverage of computer networking concepts, protocols, and technologies. The standard textbook for networking courses worldwide.',
      imageUrl: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    
    // Software Engineering Reference Books
    {
      id: '5',
      isbn: '978-0-13-449648-7',
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      category: 'Software Engineering',
      publisher: 'Prentice Hall',
      year: 2021,
      stock: 9,
      totalCopies: 12,
      addedDate: '2024-01-18',
      description: 'Essential guide to writing clean, maintainable code. A must-read for every software developer focusing on best practices and professional development.',
      imageUrl: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '6',
      isbn: '978-0-201-61622-4',
      title: 'The Pragmatic Programmer',
      author: 'David Thomas, Andrew Hunt',
      category: 'Software Engineering',
      publisher: 'Addison-Wesley',
      year: 2020,
      stock: 6,
      totalCopies: 9,
      addedDate: '2024-01-20',
      description: 'Classic guide to becoming a better programmer through practical advice and timeless principles. Essential reading for software development professionals.',
      imageUrl: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    
    // Mathematics Reference Books
    {
      id: '7',
      isbn: '978-0-07-352344-6',
      title: 'Higher Engineering Mathematics',
      author: 'B.S. Grewal',
      category: 'Mathematics',
      publisher: 'Khanna Publishers',
      year: 2023,
      stock: 12,
      totalCopies: 18,
      addedDate: '2024-01-22',
      description: 'Comprehensive textbook covering all aspects of engineering mathematics including calculus, linear algebra, differential equations, and complex analysis. Standard reference for engineering students.',
      imageUrl: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '8',
      isbn: '978-0-07-108735-6',
      title: 'Advanced Engineering Mathematics',
      author: 'Erwin Kreyszig',
      category: 'Mathematics',
      publisher: 'Wiley',
      year: 2022,
      stock: 8,
      totalCopies: 12,
      addedDate: '2024-01-24',
      description: 'Comprehensive coverage of mathematical methods for engineers and scientists. Includes differential equations, linear algebra, vector calculus, and complex analysis.',
      imageUrl: 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    
    // Electronics Reference Books
    {
      id: '9',
      isbn: '978-0-13-235088-4',
      title: 'Digital Signal Processing: Principles, Algorithms, and Applications',
      author: 'John G. Proakis, Dimitris G. Manolakis',
      category: 'Electronics',
      publisher: 'Pearson',
      year: 2022,
      stock: 7,
      totalCopies: 10,
      addedDate: '2024-01-26',
      description: 'Comprehensive coverage of digital signal processing fundamentals, algorithms, and applications with practical examples and MATLAB implementations.',
      imageUrl: 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '10',
      isbn: '978-0-07-338066-7',
      title: 'Electronic Devices and Circuit Theory',
      author: 'Robert L. Boylestad, Louis Nashelsky',
      category: 'Electronics',
      publisher: 'Pearson',
      year: 2021,
      stock: 9,
      totalCopies: 13,
      addedDate: '2024-01-28',
      description: 'Comprehensive introduction to electronic devices and circuits. Covers diodes, transistors, amplifiers, and digital circuits with practical applications.',
      imageUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    
    // Mechanical Engineering Reference Books
    {
      id: '11',
      isbn: '978-0-07-070271-5',
      title: 'Thermodynamics: An Engineering Approach',
      author: 'Yunus A. Cengel, Michael A. Boles',
      category: 'Mechanical Engineering',
      publisher: 'McGraw-Hill',
      year: 2023,
      stock: 10,
      totalCopies: 15,
      addedDate: '2024-01-30',
      description: 'Comprehensive introduction to thermodynamics with an engineering perspective, featuring real-world applications and problem-solving techniques.',
      imageUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      id: '12',
      isbn: '978-0-07-339820-4',
      title: 'Fluid Mechanics',
      author: 'Frank M. White',
      category: 'Mechanical Engineering',
      publisher: 'McGraw-Hill',
      year: 2022,
      stock: 8,
      totalCopies: 11,
      addedDate: '2024-02-01',
      description: 'Comprehensive coverage of fluid mechanics principles with applications in engineering. Includes viscous flow, compressible flow, and turbomachinery.',
      imageUrl: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ],
});

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
    case 'RESET_DATA':
      return { ...initialState, ...getSampleData() };
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

  // Apply dark mode to document
  useEffect(() => {
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  useEffect(() => {
    // Check if we need to initialize with sample data
    const savedData = localStorage.getItem('libraryData');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Check if books exist in saved data
        if (parsedData.books && parsedData.books.length > 0) {
          dispatch({ type: 'LOAD_DATA', payload: parsedData });
        } else {
          // If no books in saved data, load sample data
          const sampleData = getSampleData();
          dispatch({ type: 'LOAD_DATA', payload: sampleData });
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Load sample data on error
        const sampleData = getSampleData();
        dispatch({ type: 'LOAD_DATA', payload: sampleData });
      }
    } else {
      // No saved data, load sample data
      const sampleData = getSampleData();
      dispatch({ type: 'LOAD_DATA', payload: sampleData });
    }
  }, []);

  useEffect(() => {
    // Only save to localStorage if we have data
    if (state.books.length > 0 || state.users.length > 0) {
      const dataToSave = {
        users: state.users,
        books: state.books,
        issues: state.issues,
        fines: state.fines,
        darkMode: state.darkMode,
      };
      localStorage.setItem('libraryData', JSON.stringify(dataToSave));
    }
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