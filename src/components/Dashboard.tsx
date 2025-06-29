import React from 'react';
import { useStats } from '../hooks/useStats';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { 
  Book, 
  BookOpen, 
  AlertTriangle, 
  Users, 
  RotateCcw, 
  IndianRupee,
  CheckCircle,
  TrendingUp,
  Moon,
  Sun,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const stats = useStats();
  const { user, signOut } = useAuth();
  const { state, dispatch, refreshData } = useLibrary();
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleRefresh = async () => {
    await refreshData();
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue',
    subtitle 
  }: {
    title: string;
    value: number;
    icon: React.ElementType;
    color?: string;
    subtitle?: string;
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-emerald-500',
      yellow: 'bg-amber-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      indigo: 'bg-indigo-500',
    };

    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 hover:shadow-xl transition-all duration-200">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]} bg-opacity-20`}>
            <Icon className={`h-8 w-8 text-${color}-600`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
            {subtitle && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const recentIssues = state.issues
    .filter(issue => issue.status === 'issued')
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 5);

  const overdueIssues = state.issues.filter(issue => {
    if (issue.status !== 'issued') return false;
    const dueDate = new Date(issue.dueDate);
    const currentDate = new Date();
    return dueDate < currentDate;
  });

  // Show loading state
  if (state.loading && !state.dataLoaded) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed relative flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.shiksha.com/mediadata/images/1622116015phprRIhlq.jpeg)',
        }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white mb-4 mx-auto"></div>
          <p className="text-white text-xl font-semibold">Loading library data...</p>
          <p className="text-white/80 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (state.error && !state.dataLoaded) {
    return (
      <div 
        className="min-h-screen bg-cover bg-center bg-fixed relative flex items-center justify-center"
        style={{
          backgroundImage: 'url(https://images.shiksha.com/mediadata/images/1622116015phprRIhlq.jpeg)',
        }}
      >
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
        <div className="relative z-10 text-center max-w-md mx-auto p-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to Load Data</h3>
            <p className="text-gray-600 mb-6">{state.error}</p>
            <div className="space-y-3">
              <button
                onClick={handleRefresh}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={handleSignOut}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: 'url(https://images.shiksha.com/mediadata/images/1622116015phprRIhlq.jpeg)',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
      
      {/* Content */}
      <div className="relative z-10 space-y-8 p-4 sm:p-6 lg:p-8">
        {/* Welcome Header with Action Buttons */}
        <div className="text-center py-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 relative">
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleRefresh}
                disabled={state.loading}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw className={`h-6 w-6 text-white ${state.loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                title={state.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {state.darkMode ? (
                  <Sun className="h-6 w-6 text-white" />
                ) : (
                  <Moon className="h-6 w-6 text-white" />
                )}
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                title="Sign Out"
              >
                <LogOut className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Narula Institute of Technology
            </h1>
            <p className="text-xl text-white/90 mb-4">Library Management System</p>
            <p className="text-lg text-white/80">
              Welcome {user?.name}, you are logged in as {user?.role?.toUpperCase()}
            </p>
            {user?.role === 'student' && user?.rollNo && (
              <p className="text-md text-white/70 mt-2">
                Roll No: {user.rollNo} | Department: {user.department}
              </p>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            icon={Book}
            color="blue"
            subtitle="In collection"
          />
          <StatCard
            title="Issued Books"
            value={stats.issuedBooks}
            icon={BookOpen}
            color="green"
            subtitle="Currently out"
          />
          <StatCard
            title="Overdue Books"
            value={stats.overdueBooks}
            icon={AlertTriangle}
            color="red"
            subtitle="Past due date"
          />
          <StatCard
            title="Registered Students"
            value={stats.registeredStudents}
            icon={Users}
            color="purple"
            subtitle="Active members"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Today's Returns"
            value={stats.todayReturns}
            icon={RotateCcw}
            color="indigo"
            subtitle="Books returned today"
          />
          <StatCard
            title="Total Fines"
            value={stats.totalFines}
            icon={IndianRupee}
            color="yellow"
            subtitle="₹ Outstanding"
          />
          <StatCard
            title="Paid Fines"
            value={stats.paidFines}
            icon={CheckCircle}
            color="green"
            subtitle="₹ Collected"
          />
          <StatCard
            title="Collection Rate"
            value={Math.round((stats.paidFines / (stats.totalFines || 1)) * 100)}
            icon={TrendingUp}
            color="blue"
            subtitle="% fines collected"
          />
        </div>

        {/* Recent Activity and Overdue Books */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Issues */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Issues</h3>
            </div>
            <div className="p-6">
              {recentIssues.length > 0 ? (
                <div className="space-y-4">
                  {recentIssues.map((issue) => {
                    const book = state.books.find(b => b.id === issue.bookId);
                    const student = state.users.find(u => u.id === issue.studentId);
                    
                    return (
                      <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-lg backdrop-blur-sm">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{book?.title || 'Unknown Book'}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Issued to {student?.name || 'Unknown Student'} on {new Date(issue.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Due: {new Date(issue.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center py-4">No recent issues</p>
              )}
            </div>
          </div>

          {/* Overdue Books */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Overdue Books
              </h3>
            </div>
            <div className="p-6">
              {overdueIssues.length > 0 ? (
                <div className="space-y-4">
                  {overdueIssues.slice(0, 5).map((issue) => {
                    const book = state.books.find(b => b.id === issue.bookId);
                    const student = state.users.find(u => u.id === issue.studentId);
                    const daysOverdue = Math.floor((new Date().getTime() - new Date(issue.dueDate).getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={issue.id} className="flex items-center justify-between p-3 bg-red-50/80 dark:bg-red-900/80 border border-red-200/50 dark:border-red-700/50 rounded-lg backdrop-blur-sm">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{book?.title || 'Unknown Book'}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            {student?.name || 'Unknown Student'} • {daysOverdue} days overdue
                          </p>
                        </div>
                        <div className="text-sm font-medium text-red-600 dark:text-red-400">
                          ₹{daysOverdue * 2}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center py-4">No overdue books</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {(user?.role === 'admin' || user?.role === 'librarian') && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate('/books')}
                className="flex items-center p-4 bg-blue-50/80 dark:bg-blue-900/80 hover:bg-blue-100/80 dark:hover:bg-blue-800/80 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <Book className="h-8 w-8 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Manage Books</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Add & manage books</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/issue-return')}
                className="flex items-center p-4 bg-green-50/80 dark:bg-green-900/80 hover:bg-green-100/80 dark:hover:bg-green-800/80 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Issue Book</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Issue to student</p>
                </div>
              </button>
              <button 
                onClick={() => navigate('/students')}
                className="flex items-center p-4 bg-purple-50/80 dark:bg-purple-900/80 hover:bg-purple-100/80 dark:hover:bg-purple-800/80 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <Users className="h-8 w-8 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">Manage Students</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Add & manage students</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Data Status Indicator */}
        {state.dataLoaded && (
          <div className="text-center">
            <p className="text-white/60 text-sm">
              Data last updated: {new Date().toLocaleTimeString()}
              {state.loading && <span className="ml-2">• Refreshing...</span>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}