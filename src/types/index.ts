export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'librarian' | 'student';
  rollNo?: string;
  department?: string;
  contact?: string;
  joinDate: string;
}

export interface Book {
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

export interface Issue {
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

export interface Fine {
  id: string;
  studentId: string;
  issueId: string;
  amount: number;
  reason: string;
  date: string;
  paid: boolean;
  paidDate?: string;
}

export interface LibraryStats {
  totalBooks: number;
  issuedBooks: number;
  overdueBooks: number;
  registeredStudents: number;
  todayReturns: number;
  totalFines: number;
  paidFines: number;
}