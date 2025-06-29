import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';

export default function Books() {
  const { state, dispatch } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [bookForm, setBookForm] = useState({
    isbn: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    year: new Date().getFullYear(),
    totalCopies: 1,
    description: '',
    imageUrl: '',
  });

  const categories = [...new Set(state.books.map(book => book.category))];

  const filteredBooks = state.books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = !categoryFilter || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate ISBN
    if (state.books.some(book => book.isbn === bookForm.isbn)) {
      alert('A book with this ISBN already exists');
      return;
    }

    const newBook: Book = {
      id: Date.now().toString(),
      ...bookForm,
      stock: bookForm.totalCopies,
      addedDate: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_BOOK', payload: newBook });
    setShowAddModal(false);
    resetForm();
  };

  const handleEditBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;

    // Check for duplicate ISBN (excluding current book)
    if (state.books.some(book => book.isbn === bookForm.isbn && book.id !== selectedBook.id)) {
      alert('A book with this ISBN already exists');
      return;
    }

    const updatedBook: Book = {
      ...selectedBook,
      ...bookForm,
      stock: selectedBook.stock + (bookForm.totalCopies - selectedBook.totalCopies),
    };

    dispatch({ type: 'UPDATE_BOOK', payload: updatedBook });
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteBook = () => {
    if (!selectedBook) return;
    
    // Check if book has active issues
    const activeIssues = state.issues.filter(issue => 
      issue.bookId === selectedBook.id && issue.status === 'issued'
    );
    
    if (activeIssues.length > 0) {
      alert('Cannot delete book with active issues');
      return;
    }

    dispatch({ type: 'DELETE_BOOK', payload: selectedBook.id });
    setShowDeleteConfirm(false);
    setSelectedBook(null);
  };

  const resetForm = () => {
    setBookForm({
      isbn: '',
      title: '',
      author: '',
      category: '',
      publisher: '',
      year: new Date().getFullYear(),
      totalCopies: 1,
      description: '',
      imageUrl: '',
    });
    setSelectedBook(null);
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setBookForm({
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      category: book.category,
      publisher: book.publisher,
      year: book.year,
      totalCopies: book.totalCopies,
      description: book.description || '',
      imageUrl: book.imageUrl || '',
    });
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Books Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Book
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            Showing {filteredBooks.length} of {state.books.length} books
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Book Image */}
            {book.imageUrl && (
              <div className="h-48 overflow-hidden">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{book.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  book.stock > 0 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {book.stock > 0 ? 'Available' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p><span className="font-medium">Author:</span> {book.author}</p>
                <p><span className="font-medium">Category:</span> {book.category}</p>
                <p><span className="font-medium">Publisher:</span> {book.publisher}</p>
                <p><span className="font-medium">Year:</span> {book.year}</p>
                <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
                <p><span className="font-medium">Stock:</span> {book.stock}/{book.totalCopies}</p>
              </div>

              {book.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {book.description}
                </p>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(book)}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors duration-200"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedBook(book);
                    setShowDeleteConfirm(true);
                  }}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 rounded-lg transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No books found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || categoryFilter ? 'Try adjusting your search criteria.' : 'Get started by adding your first book.'}
          </p>
        </div>
      )}

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Book</h3>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISBN *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publisher *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.publisher}
                    onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    value={bookForm.year}
                    onChange={(e) => setBookForm({ ...bookForm, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Copies *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={bookForm.totalCopies}
                    onChange={(e) => setBookForm({ ...bookForm, totalCopies: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={bookForm.imageUrl}
                    onChange={(e) => setBookForm({ ...bookForm, imageUrl: e.target.value })}
                    placeholder="https://example.com/book-image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Book
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Book</h3>
            <form onSubmit={handleEditBook} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ISBN *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Author *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Publisher *</label>
                  <input
                    type="text"
                    required
                    value={bookForm.publisher}
                    onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year *</label>
                  <input
                    type="number"
                    required
                    min="1900"
                    max={new Date().getFullYear()}
                    value={bookForm.year}
                    onChange={(e) => setBookForm({ ...bookForm, year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Copies *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={bookForm.totalCopies}
                    onChange={(e) => setBookForm({ ...bookForm, totalCopies: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={bookForm.imageUrl}
                    onChange={(e) => setBookForm({ ...bookForm, imageUrl: e.target.value })}
                    placeholder="https://example.com/book-image.jpg"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Update Book
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedBook && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete "{selectedBook.title}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteBook}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedBook(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}