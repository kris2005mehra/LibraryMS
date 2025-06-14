import { useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';

export function useStats() {
  const { state } = useLibrary();
  
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const totalBooks = state.books.reduce((sum, book) => sum + book.totalCopies, 0);
    const issuedBooks = state.issues.filter(issue => issue.status === 'issued').length;
    const overdueBooks = state.issues.filter(issue => {
      if (issue.status !== 'issued') return false;
      const dueDate = new Date(issue.dueDate);
      const currentDate = new Date();
      return dueDate < currentDate;
    }).length;
    
    const registeredStudents = state.users.filter(user => user.role === 'student').length;
    const todayReturns = state.issues.filter(issue => 
      issue.returnDate && issue.returnDate.startsWith(today)
    ).length;
    
    const totalFines = state.fines.reduce((sum, fine) => sum + fine.amount, 0);
    const paidFines = state.fines.filter(fine => fine.paid).reduce((sum, fine) => sum + fine.amount, 0);
    
    return {
      totalBooks,
      issuedBooks,
      overdueBooks,
      registeredStudents,
      todayReturns,
      totalFines,
      paidFines,
    };
  }, [state.books, state.issues, state.users, state.fines]);
  
  return stats;
}