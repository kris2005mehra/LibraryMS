import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { Search, Plus, Edit, Trash2, Book, AlertTriangle } from 'lucide-react';

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

export default function Students() {
  const { user } = useAuth();
  const { state, dispatch } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: '',
    contact: '',
  });

  const students = state.users.filter(user => user.role === 'student');
  const departments = [...new Set(students.map(student => student.department).filter(Boolean))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesDepartment = !departmentFilter || student.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicate email or roll number
    if (state.users.some(user => user.email === studentForm.email)) {
      alert('A user with this email already exists');
      return;
    }
    
    if (state.users.some(user => user.rollNo === studentForm.rollNo)) {
      alert('A student with this roll number already exists');
      return;
    }

    const newStudent: User = {
      id: Date.now().toString(),
      ...studentForm,
      role: 'student',
      joinDate: new Date().toISOString(),
    };

    dispatch({ type: 'ADD_USER', payload: newStudent });
    setShowAddModal(false);
    resetForm();
  };

  const handleEditStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    // Check for duplicate email or roll number (excluding current student)
    if (state.users.some(user => user.email === studentForm.email && user.id !== selectedStudent.id)) {
      alert('A user with this email already exists');
      return;
    }
    
    if (state.users.some(user => user.rollNo === studentForm.rollNo && user.id !== selectedStudent.id)) {
      alert('A student with this roll number already exists');
      return;
    }

    const updatedStudent: User = {
      ...selectedStudent,
      ...studentForm,
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedStudent });
    setShowEditModal(false);
    resetForm();
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    
    // Check if student has active issues
    const activeIssues = state.issues.filter(issue => 
      issue.studentId === selectedStudent.id && issue.status === 'issued'
    );
    
    if (activeIssues.length > 0) {
      alert('Cannot delete student with active book issues');
      return;
    }

    dispatch({ type: 'DELETE_USER', payload: selectedStudent.id });
    setShowDeleteConfirm(false);
    setSelectedStudent(null);
  };

  const resetForm = () => {
    setStudentForm({
      name: '',
      email: '',
      rollNo: '',
      department: '',
      contact: '',
    });
    setSelectedStudent(null);
  };

  const openEditModal = (student: User) => {
    setSelectedStudent(student);
    setStudentForm({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo || '',
      department: student.department || '',
      contact: student.contact || '',
    });
    setShowEditModal(true);
  };

  const getStudentStats = (studentId: string) => {
    const totalIssued = state.issues.filter(issue => issue.studentId === studentId).length;
    const currentlyIssued = state.issues.filter(issue => 
      issue.studentId === studentId && issue.status === 'issued'
    ).length;
    const overdueBooks = state.issues.filter(issue => {
      if (issue.studentId !== studentId || issue.status !== 'issued') return false;
      const dueDate = new Date(issue.dueDate);
      const currentDate = new Date();
      return dueDate < currentDate;
    }).length;
    const unpaidFines = state.fines.filter(fine => 
      fine.studentId === studentId && !fine.paid
    ).reduce((sum, fine) => sum + fine.amount, 0);

    return { totalIssued, currentlyIssued, overdueBooks, unpaidFines };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Student
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Departments</option>
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            Showing {filteredStudents.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => {
          const stats = getStudentStats(student.id);
          
          return (
            <div key={student.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{student.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.rollNo}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{student.department}</p>
                  </div>
                  {stats.overdueBooks > 0 && (
                    <span className="flex items-center px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Overdue
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <p><span className="font-medium">Email:</span> {student.email}</p>
                  {student.contact && (
                    <p><span className="font-medium">Contact:</span> {student.contact}</p>
                  )}
                  <p><span className="font-medium">Join Date:</span> {new Date(student.joinDate).toLocaleDateString()}</p>
                </div>

                {/* Student Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.currentlyIssued}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Current Issues</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">{stats.totalIssued}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total Issues</div>
                  </div>
                  {stats.overdueBooks > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">{stats.overdueBooks}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Overdue</div>
                    </div>
                  )}
                  {stats.unpaidFines > 0 && (
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">₹{stats.unpaidFines}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Unpaid Fines</div>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(student)}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
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
          );
        })}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Book className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No students found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || departmentFilter ? 'Try adjusting your search criteria.' : 'Get started by adding your first student.'}
          </p>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add New Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.rollNo}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact</label>
                  <input
                    type="tel"
                    value={studentForm.contact}
                    onChange={(e) => setStudentForm({ ...studentForm, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Add Student
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

      {/* Edit Student Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Edit Student</h3>
            <form onSubmit={handleEditStudent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.rollNo}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact</label>
                  <input
                    type="tel"
                    value={studentForm.contact}
                    onChange={(e) => setStudentForm({ ...studentForm, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Update Student
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
      {showDeleteConfirm && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete student "{selectedStudent.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteStudent}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setSelectedStudent(null);
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