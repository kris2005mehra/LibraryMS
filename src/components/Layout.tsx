import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Book, 
  Users, 
  BookOpen, 
  CreditCard, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3, roles: ['admin', 'librarian', 'student'] },
    { name: 'Books', href: '/books', icon: Book, roles: ['admin', 'librarian', 'student'] },
    { name: 'Issue/Return', href: '/issue-return', icon: BookOpen, roles: ['admin', 'librarian'] },
    { name: 'Students', href: '/students', icon: Users, roles: ['admin', 'librarian'] },
    { name: 'Fines', href: '/fines', icon: CreditCard, roles: ['admin', 'librarian', 'student'] },
    { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(profile?.role || 'student')
  );

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl">
          <div className="flex items-center justify-between h-16 px-6 bg-blue-600/90 backdrop-blur-md">
            <span className="text-white font-bold text-lg">NIT Library</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="mt-5 px-2">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  location.pathname === item.href
                    ? 'bg-blue-100/80 text-blue-600 dark:bg-blue-900/80 dark:text-blue-200'
                    : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/80'
                }`}
              >
                <item.icon className="mr-4 h-6 w-6" />
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleSignOut}
              className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/80 mt-4"
            >
              <LogOut className="mr-4 h-6 w-6" />
              Sign Out
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:z-40">
        <div className="flex flex-col flex-grow bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-xl">
          <div className="flex items-center h-16 px-6 bg-blue-600/90 backdrop-blur-md">
            <span className="text-white font-bold text-lg">NIT Library</span>
          </div>
          <div className="flex flex-col flex-grow">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location.pathname === item.href
                      ? 'bg-blue-100/80 text-blue-600 dark:bg-blue-900/80 dark:text-blue-200'
                      : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/80'
                  }`}
                >
                  <item.icon className="mr-3 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="px-2 pb-4">
              <button
                onClick={handleSignOut}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700/80"
              >
                <LogOut className="mr-3 h-6 w-6" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header - only show on non-dashboard pages */}
        {location.pathname !== '/dashboard' && (
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <button
                    type="button"
                    className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100/80 dark:hover:bg-gray-700/80"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu size={24} />
                  </button>
                  <div className="ml-4 lg:ml-0">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                      Welcome, {profile?.name || 'User'}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(profile?.role || 'student').charAt(0).toUpperCase() + (profile?.role || 'student').slice(1)} Dashboard
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className={`flex-1 ${location.pathname === '/dashboard' ? '' : 'p-4 sm:p-6 lg:p-8'}`}>
          {children}
        </main>

        {/* Footer - only show on non-dashboard pages */}
        {location.pathname !== '/dashboard' && (
          <footer className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200/50 dark:border-gray-700/50 py-4">
            <div className="px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Library Management System proudly built by Kris Mehra © 2025
              </p>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}