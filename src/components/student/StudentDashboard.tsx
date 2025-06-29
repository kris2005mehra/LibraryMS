import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBooks } from '../../hooks/useBooks';
import { useIssues } from '../../hooks/useIssues';
import { useFines } from '../../hooks/useFines';
import { 
  Book, 
  BookOpen, 
  AlertTriangle, 
  IndianRupee,
  Calendar,
  User,
  GraduationCap,
  Phone,
  Mail
} from 'lucide-react';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const { books } = useBooks();
  const { issues } = useIssues();
  const { fines } = useFines();

  // Filter data for current student
  const myIssues = issues.filter(issue => issue.student_id === profile?.id);
  const myCurrentIssues = myIssues.filter(issue => issue.status === 'issued');
  const myFines = fines.filter(fine => fine.student_id === profile?.id);
  const myUnpaidFines = myFines.filter(fine => !fine.paid);

  // Calculate overdue books
  const overdueBooks = myCurrentIssues.filter(issue => {
    const dueDate = new Date(issue.due_date);
    const currentDate = new Date();
    return dueDate < currentDate;
  });

  const totalFineAmount = myUnpaidFines.reduce((sum, fine) => sum + fine.amount, 0);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = 'blue',
    subtitle 
  }: {
    title: string;
    value: number | string;
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
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

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
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Welcome, {profile?.name}
            </h1>
            <p className="text-xl text-white/90 mb-2">Student Dashboard</p>
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                <span>{profile?.roll_no}</span>
              </div>
              <div className="flex items-center">
                <Book className="h-5 w-5 mr-2" />
                <span>{profile?.department}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Books Issued"
            value={myCurrentIssues.length}
            icon={BookOpen}
            color="blue"
            subtitle="Currently borrowed"
          />
          <StatCard
            title="Total Books"
            value={books.length}
            icon={Book}
            color="green"
            subtitle="Available in library"
          />
          <StatCard
            title="Overdue Books"
            value={overdueBooks.length}
            icon={AlertTriangle}
            color="red"
            subtitle="Past due date"
          />
          <StatCard
            title="Unpaid Fines"
            value={`₹${totalFineAmount}`}
            icon={IndianRupee}
            color="yellow"
            subtitle="Outstanding amount"
          />
        </div>

        {/* Current Issues and Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Issues */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">My Current Issues</h3>
            </div>
            <div className="p-6">
              {myCurrentIssues.length > 0 ? (
                <div className="space-y-4">
                  {myCurrentIssues.map((issue: any) => {
                    const dueDate = new Date(issue.due_date);
                    const isOverdue = dueDate < new Date();
                    const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={issue.id} className={`p-4 rounded-lg border ${
                        isOverdue 
                          ? 'bg-red-50/80 border-red-200/50 dark:bg-red-900/80 dark:border-red-700/50'
                          : 'bg-gray-50/80 border-gray-200/50 dark:bg-gray-700/80 dark:border-gray-600/50'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {issue.books?.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              by {issue.books?.author}
                            </p>
                            <div className="mt-2 flex items-center text-sm">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className={isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}>
                                Due: {dueDate.toLocaleDateString()}
                                {isOverdue 
                                  ? ` (${Math.abs(daysUntilDue)} days overdue)`
                                  : ` (${daysUntilDue} days left)`
                                }
                              </span>
                            </div>
                          </div>
                          {isOverdue && (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 text-center py-4">No books currently issued</p>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">My Profile</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{profile?.name}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <GraduationCap className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Roll Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">{profile?.roll_no}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Book className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Department</p>
                  <p className="font-medium text-gray-900 dark:text-white">{profile?.department}</p>
                </div>
              </div>
              
              {profile?.contact && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
                    <p className="font-medium text-gray-900 dark:text-white">{profile.contact}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(profile?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Fines */}
        {myUnpaidFines.length > 0 && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Outstanding Fines
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {myUnpaidFines.map((fine: any) => (
                  <div key={fine.id} className="flex items-center justify-between p-4 bg-red-50/80 dark:bg-red-900/80 border border-red-200/50 dark:border-red-700/50 rounded-lg backdrop-blur-sm">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {fine.issues?.books?.title || 'Book Fine'}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-200">
                        {fine.reason} • {new Date(fine.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">
                      ₹{fine.amount}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-yellow-50/80 dark:bg-yellow-900/80 border border-yellow-200/50 dark:border-yellow-700/50 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Note:</strong> Please pay your outstanding fines to continue borrowing books from the library.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}