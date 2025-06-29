import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { Search, IndianRupee, CheckCircle, Clock, Download } from 'lucide-react';

export default function Fines() {
  const { user } = useAuth();
  const { state, dispatch } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  const filteredFines = state.fines.filter(fine => {
    const student = state.users.find(u => u.id === fine.studentId);
    const issue = state.issues.find(i => i.id === fine.issueId);
    const book = issue ? state.books.find(b => b.id === issue.bookId) : null;
    
    if (!student) return false;
    
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (book && book.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'paid' && fine.paid) ||
                         (statusFilter === 'unpaid' && !fine.paid);
    
    return matchesSearch && matchesStatus;
  });

  const totalFines = state.fines.reduce((sum, fine) => sum + fine.amount, 0);
  const paidFines = state.fines.filter(fine => fine.paid).reduce((sum, fine) => sum + fine.amount, 0);
  const unpaidFines = totalFines - paidFines;

  const handleMarkAsPaid = async (fineId: string) => {
    const fine = state.fines.find(f => f.id === fineId);
    if (!fine) return;

    const updatedFine = {
      ...fine,
      paid: true,
      paidDate: new Date().toISOString(),
    };

    // Also update the related issue
    const issue = state.issues.find(i => i.id === fine.issueId);
    if (issue) {
      const updatedIssue = { ...issue, finePaid: true };
      dispatch({ type: 'UPDATE_ISSUE', payload: updatedIssue });
    }

    dispatch({ type: 'UPDATE_FINE', payload: updatedFine });
  };

  const generateFineReport = () => {
    // Basic CSV generation for demonstration
    const csvContent = [
      ['Student Name', 'Roll No', 'Book Title', 'Fine Amount', 'Date', 'Status', 'Paid Date'].join(','),
      ...filteredFines.map(fine => {
        const student = state.users.find(u => u.id === fine.studentId);
        const issue = state.issues.find(i => i.id === fine.issueId);
        const book = issue ? state.books.find(b => b.id === issue.bookId) : null;
        
        return [
          student?.name || 'Unknown',
          student?.rollNo || 'N/A',
          book?.title || 'Unknown Book',
          fine.amount,
          new Date(fine.date).toLocaleDateString(),
          fine.paid ? 'Paid' : 'Unpaid',
          fine.paidDate ? new Date(fine.paidDate).toLocaleDateString() : 'N/A'
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fine-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Check if current user is a student and filter their fines
  const userFines = user?.role === 'student' 
    ? filteredFines.filter(fine => fine.studentId === user?.id)
    : filteredFines;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fines Management</h1>
        {(user?.role === 'admin' || user?.role === 'librarian') && (
          <button
            onClick={generateFineReport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <IndianRupee className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Fines</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalFines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Fines</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{paidFines}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <Clock className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unpaid Fines</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{unpaidFines}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      {(user?.role === 'admin' || user?.role === 'librarian') && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by student name, roll no, or book..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'paid' | 'unpaid')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Fines</option>
                <option value="paid">Paid Fines</option>
                <option value="unpaid">Unpaid Fines</option>
              </select>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              Showing {userFines.length} fines
            </div>
          </div>
        </div>
      )}

      {/* Fines List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {user?.role === 'student' ? 'My Fines' : 'All Fines'}
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {userFines.length > 0 ? (
            userFines.map((fine) => {
              const student = state.users.find(u => u.id === fine.studentId);
              const issue = state.issues.find(i => i.id === fine.issueId);
              const book = issue ? state.books.find(b => b.id === issue.bookId) : null;
              
              if (!student) return null;

              return (
                <div key={fine.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {book?.title || 'Unknown Book'}
                        </h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          fine.paid
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {fine.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {(user?.role === 'admin' || user?.role === 'librarian') && (
                          <div>
                            <span className="font-medium">Student:</span> {student.name} ({student.rollNo})
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Amount:</span> ₹{fine.amount}
                        </div>
                        <div>
                          <span className="font-medium">Reason:</span> {fine.reason}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {new Date(fine.date).toLocaleDateString()}
                        </div>
                      </div>
                      
                      {fine.paid && fine.paidDate && (
                        <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                          <span className="font-medium">Paid on:</span> {new Date(fine.paidDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {!fine.paid && (user?.role === 'admin' || user?.role === 'librarian') && (
                      <button
                        onClick={() => handleMarkAsPaid(fine.id)}
                        className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <IndianRupee className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No fines found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {user?.role === 'student' 
                  ? 'You have no fines at the moment.'
                  : searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search criteria.' 
                    : 'No fines have been recorded yet.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fine Rules */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-2">Fine Rules</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
          <li>• Late return fine: ₹2 per day after due date</li>
          <li>• Fines must be paid before issuing new books</li>
          <li>• Students with unpaid fines cannot borrow books</li>
          <li>• Fine calculation starts from the day after due date</li>
        </ul>
      </div>
    </div>
  );
}