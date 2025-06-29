import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../hooks/useBooks';
import { useIssues } from '../hooks/useIssues';
import { useFines } from '../hooks/useFines';
import { useProfiles } from '../hooks/useProfiles';
import { 
  Book, 
  BookOpen, 
  AlertTriangle, 
  Users, 
  RotateCcw, 
  IndianRupee,
  CheckCircle,
  TrendingUp,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { profile } = useAuth();
  const { books } = useBooks();
  const { issues } = useIssues();
  const { fines } = useFines();
  const { profiles } = useProfiles();
  const navigate = useNavigate();

  // Calculate stats
  const totalBooks = books.reduce((sum, book) => sum + book.total_copies, 0);
  const issuedBooks = issues.filter(issue => issue.status === 'issued').length;
  const overdueBooks = issues.filter(issue => {
    if (issue.status !== 'issued') return false;
    const dueDate = new Date(issue.due_date);
    const currentDate = new Date();
    return dueDate < currentDate;
  }).length;
  
  const registeredStudents = profiles.filter(profile => profile.role === 'student').length;
  const today = new Date().toISOString().split('T')[0];
  const todayReturns = issues.filter(issue => 
    issue.return_date && issue.return_date.startsWith(today)
  ).length;
  
  const totalFines = fines.reduce((sum, fine) => sum + fine.amount, 0);
  const paidFines = fines.filter(fine => fine.paid).reduce((sum, fine) => sum + fine.amount, 0);

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

  const recentIssues = issues
    .filter(issue => issue.status === 'issued')
    .sort((a, b) => new Date(b.issue_date).getTime() - new Date(a.issue_date).getTime())
    .slice(0, 5);

  const overdueIssues = issues.filter(issue => {
    if (issue.status !== 'issued') return false;
    const dueDate = new Date(issue.due_date);
    const currentDate = new Date();
    return dueDate < currentDate;
  });

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
        {/* Welcome Header */}
        <div className="text-center py-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 relative">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Narula Institute of Technology
            </h1>
            <p className="text-xl text-white/90 mb-4">Library Management System</p>
            <p className="text-lg text-white/80">
              Welcome To The LMS, {profile?.name || 'Admin'}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Books"
            value={totalBooks}
            icon={Book}
            color="blue"
            subtitle="In collection"
          />
          <StatCard
            title="Issued Books"
            value={issuedBooks}
            icon={BookOpen}
            color="green"
            subtitle="Currently out"
          />
          <StatCard
            title="Overdue Books"
            value={overdueBooks}
            icon={AlertTriangle}
            color="red"
            subtitle="Past due date"
          />
          <StatCard
            title="Registered Students"
            value={registeredStudents}
            icon={Users}
            color="purple"
            subtitle="Active members"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Today's Returns"
            value={todayReturns}
            icon={RotateCcw}
            color="indigo"
            subtitle="Books returned today"
          />
          <StatCard
            title="Total Fines"
            value={totalFines}
            icon={IndianRupee}
            color="yellow"
            subtitle="₹ Outstanding"
          />
          <StatCard
            title="Paid Fines"
            value={paidFines}
            icon={CheckCircle}
            color="green"
            subtitle="₹ Collected"
          />
          <StatCard
            title="Collection Rate"
            value={Math.round((paidFines / (totalFines || 1)) * 100)}
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
                  {recentIssues.map((issue: any) => (
                    <div key={issue.id} className="flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/80 rounded-lg backdrop-blur-sm">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{issue.books?.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Issued to {issue.profiles?.name} on {new Date(issue.issue_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        Due: {new Date(issue.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
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
                  {overdueIssues.slice(0, 5).map((issue: any) => {
                    const daysOverdue = Math.floor((new Date().getTime() - new Date(issue.due_date).getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={issue.id} className="flex items-center justify-between p-3 bg-red-50/80 dark:bg-red-900/80 border border-red-200/50 dark:border-red-700/50 rounded-lg backdrop-blur-sm">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{issue.books?.title}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-200">
                            {issue.profiles?.name} • {daysOverdue} days overdue
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
        {(profile?.role === 'admin' || profile?.role === 'librarian') && (
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
      </div>
    </div>
  );
}