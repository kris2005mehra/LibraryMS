import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../hooks/useBooks';
import { useIssues } from '../hooks/useIssues';
import { useFines } from '../hooks/useFines';
import { useProfiles } from '../hooks/useProfiles';
import { Search, BookOpen, RotateCcw, Calendar, AlertTriangle } from 'lucide-react';

export default function IssueReturn() {
  const { profile } = useAuth();
  const { books, updateBook } = useBooks();
  const { issues, addIssue, updateIssue } = useIssues();
  const { addFine } = useFines();
  const { profiles } = useProfiles();
  const [activeTab, setActiveTab] = useState<'issue' | 'return'>('issue');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [daysToIssue, setDaysToIssue] = useState(14);

  const students = profiles.filter(profile => profile.role === 'student');
  const availableBooks = books.filter(book => book.stock > 0);
  const issuedBooks = issues.filter(issue => issue.status === 'issued');

  const filteredIssuedBooks = issuedBooks.filter(issue => {
    const book = books.find(b => b.id === issue.book_id);
    const student = profiles.find(u => u.id === issue.student_id);
    
    if (!book || !student) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return book.title.toLowerCase().includes(searchLower) ||
           student.name.toLowerCase().includes(searchLower) ||
           student.roll_no?.toLowerCase().includes(searchLower);
  });

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent || !selectedBook) {
      alert('Please select both student and book');
      return;
    }

    const student = profiles.find(u => u.id === selectedStudent);
    const book = books.find(b => b.id === selectedBook);
    
    if (!student || !book) {
      alert('Invalid student or book selection');
      return;
    }

    // Check if book is available
    if (book.stock <= 0) {
      alert('Book is not available');
      return;
    }

    try {
      const issueDate = new Date();
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + daysToIssue);

      // Add issue
      await addIssue({
        book_id: selectedBook,
        student_id: selectedStudent,
        issue_date: issueDate.toISOString(),
        due_date: dueDate.toISOString(),
        status: 'issued',
        fine_paid: false,
      });

      // Update book stock
      await updateBook(selectedBook, { stock: book.stock - 1 });

      // Reset form
      setSelectedStudent('');
      setSelectedBook('');
      setDaysToIssue(14);
      
      alert('Book issued successfully!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleReturnBook = async (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return;

    const book = books.find(b => b.id === issue.book_id);
    if (!book) return;

    try {
      const returnDate = new Date();
      const dueDate = new Date(issue.due_date);
      const isOverdue = returnDate > dueDate;
      
      let fineAmount = 0;
      if (isOverdue) {
        const daysOverdue = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        fineAmount = daysOverdue * 2; // ₹2 per day
      }

      // Update issue status
      await updateIssue(issueId, {
        status: 'returned',
        return_date: returnDate.toISOString(),
        fine_amount: fineAmount,
        fine_paid: fineAmount === 0,
      });

      // Update book stock
      await updateBook(issue.book_id, { stock: book.stock + 1 });

      // Add fine if applicable
      if (fineAmount > 0) {
        await addFine({
          student_id: issue.student_id,
          issue_id: issueId,
          amount: fineAmount,
          reason: 'Late return fine',
          paid: false,
        });
      }

      alert(`Book returned successfully! ${fineAmount > 0 ? `Fine: ₹${fineAmount}` : 'No fine.'}`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const calculateFine = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    
    if (now <= due) return 0;
    
    const daysOverdue = Math.ceil((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return daysOverdue * 2;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Issue & Return Books</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('issue')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'issue'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <BookOpen className="h-5 w-5 inline mr-2" />
              Issue Book
            </button>
            <button
              onClick={() => setActiveTab('return')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'return'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <RotateCcw className="h-5 w-5 inline mr-2" />
              Return Book
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'issue' ? (
            <div className="space-y-6">
              <form onSubmit={handleIssueBook} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Student *
                    </label>
                    <select
                      value={selectedStudent}
                      onChange={(e) => setSelectedStudent(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Choose a student...</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} ({student.roll_no}) - {student.department}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Book *
                    </label>
                    <select
                      value={selectedBook}
                      onChange={(e) => setSelectedBook(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Choose a book...</option>
                      {availableBooks.map(book => (
                        <option key={book.id} value={book.id}>
                          {book.title} by {book.author} (Stock: {book.stock})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Issue Period (Days) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={daysToIssue}
                      onChange={(e) => setDaysToIssue(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Date
                    </label>
                    <div className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {new Date(Date.now() + daysToIssue * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Issue Book
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search by book title, student name, or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Issued Books List */}
              <div className="space-y-4">
                {filteredIssuedBooks.length > 0 ? (
                  filteredIssuedBooks.map((issue: any) => {
                    const book = books.find(b => b.id === issue.book_id);
                    const student = profiles.find(u => u.id === issue.student_id);
                    const fine = calculateFine(issue.due_date);
                    const isOverdue = fine > 0;
                    
                    if (!book || !student) return null;

                    return (
                      <div
                        key={issue.id}
                        className={`p-4 rounded-lg border ${
                          isOverdue
                            ? 'bg-red-50 border-red-200 dark:bg-red-900 dark:border-red-700'
                            : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {book.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              by {book.author} • ISBN: {book.isbn}
                            </p>
                            <div className="mt-2 space-y-1 text-sm">
                              <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Student:</span> {student.name} ({student.roll_no})
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Issue Date:</span> {new Date(issue.issue_date).toLocaleDateString()}
                              </p>
                              <p className={`${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                                <span className="font-medium">Due Date:</span> {new Date(issue.due_date).toLocaleDateString()}
                                {isOverdue && (
                                  <span className="ml-2 inline-flex items-center">
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Overdue
                                  </span>
                                )}
                              </p>
                              {fine > 0 && (
                                <p className="text-red-600 dark:text-red-400 font-medium">
                                  Fine: ₹{fine}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleReturnBook(issue.id)}
                            className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                          >
                            Return Book
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No issued books found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'Try adjusting your search criteria.' : 'No books are currently issued.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}