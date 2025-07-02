import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { useNavigate } from 'react-router-dom';
import { Book, User, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { state, dispatch } = useLibrary();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Find user by email
    const user = state.users.find(u => u.email === loginForm.email);
    
    if (!user) {
      setError('Invalid email or password');
      return;
    }

    // For demo purposes, we'll use simple password validation
    // In a real app, you'd hash and compare passwords properly
    let isValidPassword = false;
    
    if (user.role === 'admin' && loginForm.password === 'admin123') {
      isValidPassword = true;
    } else if (user.role === 'librarian' && loginForm.password === 'lib123') {
      isValidPassword = true;
    } else if (user.role === 'student' && loginForm.password === 'student123') {
      isValidPassword = true;
    }

    if (!isValidPassword) {
      setError('Invalid email or password');
      return;
    }

    dispatch({ type: 'SET_USER', payload: user });
    navigate('/dashboard');
  };

  const handleGuestAccess = () => {
    // Create a guest user for demo purposes
    const guestUser = {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@nit.ac.in',
      role: 'student' as const,
      joinDate: new Date().toISOString(),
    };
    
    dispatch({ type: 'SET_USER', payload: guestUser });
    navigate('/dashboard');
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://images.shiksha.com/mediadata/images/1622116015phprRIhlq.jpeg)',
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-600/20 rounded-full">
                <Book className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome to NIT Library
            </h1>
            <p className="text-lg text-white/90">
              Narula Institute of Technology
            </p>
            <p className="text-sm text-white/80">
              Library Management System
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h2>
            <p className="text-gray-600">Sign in to access the library system</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <button
              onClick={handleGuestAccess}
              className="w-full mt-4 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
            >
              Continue as Guest
            </button>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Admin:</strong> admin@nit.ac.in / admin123</p>
              <p><strong>Librarian:</strong> librarian@nit.ac.in / lib123</p>
              <p><strong>Student:</strong> kris@student.nit.ac.in / student123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm">
            Library Management System © 2025
          </p>
          <p className="text-white/60 text-xs mt-1">
            Proudly built by Kris Mehra
          </p>
        </div>
      </div>
    </div>
  );
}